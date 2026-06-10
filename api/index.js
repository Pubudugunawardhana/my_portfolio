require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('../backend/routes/authRoutes');
const aboutRoutes = require('../backend/routes/aboutRoutes');
const projectRoutes = require('../backend/routes/projectRoutes');
const skillRoutes = require('../backend/routes/skillRoutes');
const certificationRoutes = require('../backend/routes/certificationRoutes');
const messageRoutes = require('../backend/routes/messageRoutes');
const analyticsRoutes = require('../backend/routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for Base64 images/CVs

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.send('Portfolio API is running on Vercel Serverless...');
});

// For local testing
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;
