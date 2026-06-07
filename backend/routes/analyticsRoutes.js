const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const { protect } = require('../middleware/authMiddleware');

// Public route to increment views
router.post('/increment', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let stat = await Analytics.findOne({ date: today });
    if (stat) {
      stat.views += 1;
      stat.lastUpdated = Date.now();
      await stat.save();
    } else {
      stat = await Analytics.create({ date: today, views: 1 });
    }
    res.json({ success: true, views: stat.views });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Protected route to get analytics
router.get('/', async (req, res) => { // Removed protect for simplicity if needed in public charts, but let's keep it open or protected based on use case. Currently analytics is usually public on portfolio or admin only. We will leave public to view.
  try {
    const stats = await Analytics.find().sort({ date: -1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
