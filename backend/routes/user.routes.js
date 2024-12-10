import express from "express";
import upload from "../helpers/multer.js";
import User from "../models/user.model.js";
import { Types } from 'mongoose'; // If using Mongoose


const router = express.Router();

router.put(
  "/update-profile",
  upload.array("photos", 3),
  async (req, res) => {
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
);

router.get("/fetch-profiles", async (req, res) => {
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
      
      // Base query to find matching users
      const query = {
        _id: {
          $nin: swipedUserIds, // Exclude swiped users
          $ne: userObjectId,       // Exclude the logged-in user
        },
        // chessStats: {
        //   rating: { $gte: minRating, $lte: maxRating },
        // },
        'chessStats.rating': { $gte: minRating, $lte: maxRating },
        age: { $gte: preferences.ageRange.min, $lte: preferences.ageRange.max },
      };
  
      // Add gender filtering if not set to "any"
      if (preferences.gender !== "any") {
        query.gender = preferences.gender;
      }
  
    //   console.log(currentUser.location.coordinates);
      // Add location filtering if enabled
      if (preferences.locationPreference) {
        query["location"] = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: currentUser.location.coordinates,
            },
            $maxDistance: 50000, // 50 km in meters
          },
        };
      }
  
    //   console.log(query);
      // Fetch matching users
      const matches = await User.find(query);
  
      res.status(200).json({ matches });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches", details: error.message });
    }
  });
  

export default router;
