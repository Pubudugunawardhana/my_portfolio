import mongoose from 'mongoose';
import { defineModel } from './defineModel';

const AnalyticsSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  views: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

export default defineModel('Analytics', AnalyticsSchema);
