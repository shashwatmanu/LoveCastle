import express from "express";
const router = express.Router();
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js"
const JWT_SECRET = process.env.JWT_SECRET;


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

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
        expiresIn: '7d', 
      });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });


export default router;