import express from "express";
import { sendMessage, getMessages } from "../controllers/chat.controllers.js";

const router = express.Router();

// Route to send a message, including matchId as a parameter
router.post('/:matchId', sendMessage);

// Route to fetch messages for a specific match
router.get('/:matchId', getMessages);

export default router;
