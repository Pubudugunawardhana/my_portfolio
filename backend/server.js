require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

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
  res.send('Portfolio API is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
