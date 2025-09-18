import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  banner: String,
  approved: { type: Boolean, default: false }
});

export const Event = mongoose.model('Event', eventSchema);
