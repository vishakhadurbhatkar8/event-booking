import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' }
});

export const User = mongoose.model('User', userSchema);
