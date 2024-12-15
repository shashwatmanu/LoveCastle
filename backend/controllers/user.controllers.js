import User from "../models/user.model.js"
import { Types } from 'mongoose'; 
import Match from "../models/match.model.js"
import { v4 as uuidv4 } from 'uuid';
import mongoose from "mongoose";
import {resetDailyUnlocks} from "../helpers/resetDailyUnlocks.js";
import { calculateELO } from "../helpers/calculateElo.js";

  export const updateProfile = async (req, res) => {
    const userId = req.user._id; // Get the logged-in user's ID
    const { bio, preferences, latitude, longitude, age, name, gender } = req.body; // Extract fields from the request
    const files = req.files;

    try {
      // Process uploaded files to get URLs and public_ids from Cloudinary
      const uploadedPictures = files.map((file) => ({
        url: file.path, // Cloudinary URL of the uploaded image
        public_id: file.filename, // Cloudinary public_id of the image
      }));

      // Update user profile in the database
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            bio,
            preferences: preferences ? JSON.parse(preferences) : undefined,
            profilePictures: uploadedPictures.length > 0 ? uploadedPictures : undefined,
            location:
              latitude && longitude
                ? {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                  }
                : undefined,
            age,
            name,
            gender
          },
        },
        { new: true } // Return the updated user
      );

      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile", details: error.message });
    }
  }

  export const getProfiles = async (req, res) => {
    const userId = req.user._id;
  
    try {
      // Fetch the logged-in user
      const currentUser = await User.findById(userId);
  
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const { chessStats, preferences, swipedUsers } = currentUser;
  
      const minRating = chessStats.rating - preferences.chessSkillRange;
      const maxRating = chessStats.rating + preferences.chessSkillRange;
  
      const userObjectId = new Types.ObjectId(userId);
      const swipedUserIds = swipedUsers.map(id => new Types.ObjectId(id));
  
      // Base aggregation pipeline
      const pipeline = [];
  
      // Add $geoNear stage if location preference is enabled
      if (preferences.locationPreference) {
        pipeline.push({
          $geoNear: {
            near: {
              type: "Point",
              coordinates: currentUser.location.coordinates,
            },
            distanceField: "distance", // Field to store the calculated distance
            maxDistance: 50000, // 50 km in meters
            spherical: true, // Use spherical calculations
          },
        });
      }
  
      // Match users based on criteria
      pipeline.push({
        $match: {
          _id: {
            $nin: swipedUserIds, // Exclude swiped users
            $ne: userObjectId,   // Exclude the logged-in user
          },
          'chessStats.rating': { $gte: minRating, $lte: maxRating },
          age: { $gte: preferences.ageRange.min, $lte: preferences.ageRange.max },
          ...(preferences.gender !== "any" && { gender: preferences.gender }), // Add gender filtering
        },
      });
  
      // Project only required fields
      pipeline.push({
        $project: {
          username: 1,
          name: 1,
          bio: 1,
          chessStats: 1,
          age: 1,
          gender: 1,
          distance: 1, // Include the calculated distance
        },
      });
  
      // Execute the aggregation pipeline
      const matches = await User.aggregate(pipeline);
  
      res.status(200).json({ matches });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches", details: error.message });
    }
  };

  export const handleSwipe = async (req, res) => {
    const { targetUserId, direction } = req.body; // `direction` can be 'left' or 'right'
    const userId = req.user._id;
  
    try {
      if (!['left', 'right'].includes(direction)) {
        return res.status(400).json({ error: "Invalid swipe direction." });
      }
  
      const currentUser = await User.findById(userId);
      const targetUser = await User.findById(targetUserId);
  
      if (!currentUser || !targetUser) {
        return res.status(404).json({ error: "One or both users not found." });
      }
  
      // Add the target user to the logged-in user's swipedUsers list
      if (!currentUser.swipedUsers.includes(targetUserId)) {
        currentUser.swipedUsers.push(targetUserId);
        await currentUser.save();
      }
  
      if (direction === 'left') {
        // Left swipe logic (rejection)
        return res.status(200).json({ message: "Profile rejected successfully." });
      }
  
      // Right swipe logic (like)
      if (targetUser.swipedUsers.includes(userId)) {
        // Mutual like: Create a match
        const existingMatch = await Match.findOne({
          $or: [
            { user1: userId, user2: targetUserId },
            { user1: targetUserId, user2: userId },
          ],
        });
  
        if (!existingMatch) {
          const newMatch = await Match.create({
            user1: userId,
            user2: targetUserId,
            icebreakerGameStatus: 'pending', // Set icebreaker game as pending
          });
  
          return res.status(200).json({
            message: "It's a match!",
            match: newMatch,
          });
        } else {
          return res.status(200).json({
            message: "You are already matched with this user.",
            match: existingMatch,
          });
        }
      }
  
      // No match; the swipe is just a like
      res.status(200).json({ message: "Profile liked successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to process swipe.", details: error.message });
    }
  };
  
  export const getUserMatches = async (req, res) => {
    const userId = req.user._id;
  
    try {
      const matches = await Match.find({
        $or: [{ user1: userId }, { user2: userId }],
      })
        .populate('user1', '-password -swipedUsers')
        .populate('user2', '-password -swipedUsers');
  
      res.status(200).json({ matches });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches.", details: error.message });
    }
  };
  
  export const handleMatchResult = async (req, res) => {
    const { matchId, winnerId, moves } = req.body; // Winner ID provided; null for a draw
    const userId = req.user._id;
  
    try {
      const match = await Match.findById(matchId).populate('user1 user2');
      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }
  
      const { user1, user2 } = match;
      const isUser1 = user1._id.equals(userId);
      const opponent = isUser1 ? user2 : user1;
  
      // Check if the game has already been added
      const gameExists = match.games.some((game) => game.moves === moves);
  
      if (!gameExists) {
        const isDraw = !winnerId; // If no winnerId, it's a draw
        const game = {
            gameId: uuidv4(),
            winner: isDraw ? null : new mongoose.Types.ObjectId(winnerId), // Cast winnerId to ObjectId
            loser: isDraw
              ? null
              : new mongoose.Types.ObjectId(winnerId === user1._id.toString() ? user2._id : user1._id), // Cast loserId to ObjectId
            isDraw,
            moves,
            timestamp: new Date(),
          };
  
        // Push the game to the games array
        match.games.push(game);
  
        // Update match stats
        match.totalGamesPlayed += 1;
        if (!isDraw) {
          if (game.winner.equals(user1._id)) {
            match.user1Wins += 1;
          } else {
            match.user2Wins += 1;
          }
        }
  
        // Update icebreaker game status if applicable
        if (match.icebreakerGameStatus === 'pending') {
          match.icebreakerGameStatus = 'completed';
          match.isChatEnabled = true;
        }
      }
  
      // Update user stats
      const user = isUser1 ? user1 : user2;
      const opponentRating = opponent.chessStats.rating;
      const userRating = user.chessStats.rating;
  
      const updatedRating = calculateELO(
        userRating,
        opponentRating,
        winnerId === user._id.toString() ? 'win' : winnerId ? 'lose' : 'draw'
      );
  
      user.chessStats.rating = updatedRating;
      user.chessStats.gamesPlayed += 1;
      if (winnerId === user._id.toString()) {
        user.chessStats.gamesWon += 1;
      }
  
      await user.save();
      await match.save();
  
      const latestGame = match.games[match.games.length - 1];
    res.status(200).json({
      message: 'Match result recorded successfully',
      game: latestGame,
      updatedRating
    });
    } catch (error) {
      res.status(500).json({ error: 'Failed to record match result', details: error.message });
    }
  };

  export const unlockChallenge = async (req, res) => {
    const userId = req.user._id;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Reset daily unlocks if needed
      resetDailyUnlocks(user);
  
      if (user.role === "premium") {
        return res.status(400).json({ error: "Premium users don't need to unlock challenges." });
      }
  
      if (user.dailyUnlocks.challenges >= 2) {
        return res.status(403).json({ error: "Daily challenge unlock limit reached." });
      }
  
      user.dailyUnlocks.challenges += 1;
      await user.save();
  
      res.status(200).json({ message: "Challenge unlocked successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to unlock challenge", details: error.message });
    }
  };
  
  export const sendDirectChallenge = async (req, res) => {
    const { targetUserId, message } = req.body;
    const challengerId = req.user._id;
  
    try {
      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ error: "Target user not found" });
      }
  
      const challenger = await User.findById(challengerId);
  
      // Reset daily unlocks if needed
      resetDailyUnlocks(challenger);
  
      // Check if the challenger is eligible
      if (challenger.role === "free" && challenger.dailyUnlocks.challenges <= 0) {
        return res.status(403).json({
          error: "Free users must unlock challenges by solving a puzzle or watching an ad.",
        });
      }
  
      // Deduct a challenge unlock for free users
      if (challenger.role === "free") {
        challenger.dailyUnlocks.challenges -= 1;
        await challenger.save();
      }
  
      // Check if a challenge already exists
      const existingChallenge = targetUser.directChallenges.find((challenge) =>
        challenge.challenger.equals(challengerId)
      );
      if (existingChallenge) {
        return res.status(400).json({ error: "Challenge already sent to this user" });
      }
  
      // Add the challenge to the target user's `directChallenges` array
      const newChallenge = {
        challenger: challengerId,
        message,
      };
      targetUser.directChallenges.push(newChallenge);
      await targetUser.save();
  
      res.status(200).json({ message: "Challenge sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send challenge", details: error.message });
    }
  };
  
  export const respondToChallenge = async (req, res) => {
  const { challengerId, accept } = req.body; // `accept` is true or false
  const targetUserId = req.user._id;

  try {
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the challenge
    const challengeIndex = targetUser.directChallenges.findIndex((challenge) =>
      challenge.challenger.equals(challengerId)
    );
    if (challengeIndex === -1) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    if (accept) {
      // Create a match if the challenge is accepted
      const newMatch = new Match({
        user1: challengerId,
        user2: targetUserId,
        icebreakerGameStatus: "pending",
      });
      await newMatch.save();
    }

    // Remove the challenge
    targetUser.directChallenges.splice(challengeIndex, 1);
    await targetUser.save();

    res.status(200).json({
      message: accept
        ? "Challenge accepted. Match created."
        : "Challenge rejected.",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to respond to challenge", details: error.message });
  }
  };

  export const fetchChallenges = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Fetch the logged-in user's challenges
      const user = await User.findById(userId).select("directChallenges");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json(user.directChallenges); // Return the directChallenges array
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenges", details: error.message });
    }
  };

  export const unmatchUsers = async (req, res) => {
    const { matchId } = req.body; // Match ID to unmatch
    const userId = req.user._id;
  
    try {
      const match = await Match.findById(matchId);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
  
      const { user1, user2 } = match;
  
      // Ensure the requesting user is part of the match
      if (!user1.equals(userId) && !user2.equals(userId)) {
        return res.status(403).json({ error: "Unauthorized action" });
      }
  
      // Remove the match document
      await Match.findByIdAndDelete(matchId);
  
      res.status(200).json({ message: "Unmatched successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to unmatch", details: error.message });
    }
  };
  
  
  
  