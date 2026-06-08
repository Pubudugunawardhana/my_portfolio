const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  location: { type: String, default: '' },
  shortBio: { type: String, default: '' },
  longBio: { type: String, default: '' },
  email: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  medium: { type: String, default: '' },
  school: { type: String, default: '' },
  university: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  resumeFile: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('About', AboutSchema);
