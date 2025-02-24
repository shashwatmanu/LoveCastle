import Message from "../models/message.model.js";
import Match from "../models/match.model.js";

// Controller to send a message
export const sendMessage = async (req, res) => {
    const { matchId } = req.params; // Extract matchId from the route
    const { content } = req.body; // Message content
    const sender = req.user._id; // Logged-in user
    
    try {
        // Validate matchId
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ error: "Match not found." });
        }

        
        // Ensure the user is part of the match
        if (![match.user1.toString(), match.user2.toString()].includes(sender.toString())) {
            return res.status(403).json({ error: "You are not authorized to send messages in this match." });
        }

        // Create and save the message
        const message = await Message.create({
            matchId,
            sender,
            message: content
        });

        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message.", details: error.message });
    }
};

// Controller to fetch messages for a specific match
export const getMessages = async (req, res) => {
    const { matchId } = req.params;
    // console.log(matchId);

    try {
        // Validate matchId
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ error: "Match not found." });
        }

        // Ensure the user is part of the match
        const userId = req.user._id;
        if (![match.user1.toString(), match.user2.toString()].includes(userId.toString())) {
            return res.status(403).json({ error: "You are not authorized to view messages in this match." });
        }

        // Fetch messages for the match
        const messages = await Message.find({ matchId }).sort({ createdAt: 1 });
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages.", details: error.message });
    }
};
