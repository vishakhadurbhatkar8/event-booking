import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';

dotenv.config();

const OTP_STORE = {}; // { email: { code, expiresAt } }

export const requestOtp = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
  OTP_STORE[email] = {
    code,
    expiresAt: Date.now() + process.env.OTP_EXPIRY * 1000
  };

  console.log(`OTP for ${email}: ${code}`);
  res.json({ message: 'OTP sent (mock)', devOtp: code });
};

export const verifyOtp = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: 'Email & code required' });

  const record = OTP_STORE[email];
  if (!record) return res.status(400).json({ message: 'No OTP requested' });
  if (Date.now() > record.expiresAt) return res.status(400).json({ message: 'OTP expired' });
  if (record.code !== code) return res.status(400).json({ message: 'Invalid OTP' });

  let user = await User.findOne({ email });
  if (!user) {
    const role = email.includes('superadmin') ? 'superadmin' : (email.includes('admin') ? 'admin' : 'user');
    user = new User({ email, role });
    await user.save();
  }

  const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  delete OTP_STORE[email];
  res.json({ token, role: user.role });
};
