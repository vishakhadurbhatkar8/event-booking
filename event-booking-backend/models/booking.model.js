import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: String, required: true },
  status: { type: String, enum: ['reserved', 'confirmed', 'cancelled', 'expired'], default: 'reserved' },
  expiresAt: Date,
  idProof: String
});

export const Booking = mongoose.model('Booking', bookingSchema);
