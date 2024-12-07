import express from "express";
const router = express.Router();
import bcrypt from "bcrypt"
import User from "../models/user.model.js"

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err.message });
  }
});



export default router;