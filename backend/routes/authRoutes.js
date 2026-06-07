const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  try {
    // 1. Fetch Google's public keys for Firebase tokens
    const keyRes = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    const keys = await keyRes.json();

    // 2. Decode the header to find which key was used
    const decodedHeader = jwt.decode(idToken, { complete: true }).header;
    const cert = keys[decodedHeader.kid];

    if (!cert) return res.status(401).json({ message: 'Invalid token signature' });

    // 3. Verify the token using the certificate
    const decoded = jwt.verify(idToken, cert, { algorithms: ['RS256'] });

    // 4. Check if this email exists in our DB
    const user = await User.findOne({ email: decoded.email });

    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Access Denied. Email not authorized.' });
    }
  } catch (error) {
    console.error('Google Auth Error:', error.message);
    res.status(401).json({ message: 'Invalid or expired Google Token', error: error.message });
  }
});

// Setup Initial User (Run Once or Use Seed Script)
router.post('/setup', async (req, res) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = await User.create({ email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

module.exports = router;
