const express = require('express');
const router = express.Router();
const Certification = require('../models/Certification');
const { protect } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const certs = await Certification.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const cert = await Certification.create(req.body);
    res.status(201).json(cert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certification deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
