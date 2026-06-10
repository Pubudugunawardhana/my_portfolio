const express = require('express');
const router = express.Router();
const About = require('../models/About');
const { protect } = require('../middleware/authMiddleware');

// @route GET /api/about
router.get('/', async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/about (Protect)
router.put('/', protect, async (req, res) => {
  try {
    let about = await About.findOne();
    if (about) {
      about = await About.findOneAndUpdate({}, req.body, { new: true });
    } else {
      about = await About.create(req.body);
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
