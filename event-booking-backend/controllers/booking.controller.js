import { Booking } from '../models/booking.model.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
export const upload = multer({ storage });

export const listUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.email }).populate('eventId');
  res.json(bookings);
};

export const reserveSeat = async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ message: 'eventId required' });

  const booking = new Booking({
    eventId,
    user: req.user.email,
    status: 'reserved',
    expiresAt: Date.now() + 2 * 60 * 1000
  });

  await booking.save();
  res.status(201).json(booking);
};

export const confirmBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Not found' });
  if (booking.user !== req.user.email) return res.status(403).json({ message: 'Forbidden' });

  if (Date.now() > booking.expiresAt && booking.status === 'reserved') {
    booking.status = 'expired';
    await booking.save();
    return res.status(400).json({ message: 'Reservation expired' });
  }

  booking.status = 'confirmed';
  await booking.save();
  res.json(booking);
};

export const cancelBookingCtrl = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Not found' });
  if (booking.user !== req.user.email) return res.status(403).json({ message: 'Forbidden' });

  booking.status = 'cancelled';
  await booking.save();
  res.json(booking);
};

export const uploadIdProof = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Not found' });
  if (booking.user !== req.user.email) return res.status(403).json({ message: 'Forbidden' });

  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  booking.idProof = req.file.filename;
  await booking.save();
  res.json({ message: 'ID proof uploaded', booking });
};
