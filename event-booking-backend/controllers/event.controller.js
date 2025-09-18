import { Event } from '../models/event.model.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
export const upload = multer({ storage });

export const listEvents = async (req, res) => {
  const events = await Event.find({ approved: true });
  res.json(events);
};

export const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  if (!event.approved && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Not approved yet' });
  }
  res.json(event);
};

export const createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  const event = new Event({ title, description, date, location, approved: false });
  await event.save();
  res.status(201).json(event);
};

export const editEvent = async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
};

export const removeEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

export const approveEvent = async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
};

export const rejectEvent = async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, { approved: false }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
};

export const uploadBanner = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const updated = await Event.findByIdAndUpdate(req.params.id, { banner: req.file.filename }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Banner uploaded', event: updated });
};
