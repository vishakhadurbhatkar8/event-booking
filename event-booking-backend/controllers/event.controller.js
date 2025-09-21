import Event from "../models/event.model.js";

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.json({ message: "Event created successfully", event });
  } catch (err) {
    console.error('Event creation error:', err);
    res.status(500).json({ message: "Event creation failed" });
  }
};

export const addEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      status: 'pending' // default until super admin approves
    });
    const saved = await event.save();
    res.status(201).json(saved); // ✅ return event so frontend can use it
  } catch (err) {
    res.status(500).json({ message: 'Error creating event' });
  }
};

export const getEvents = async (req, res) => {
  try {
    // Check if this is an admin request (has authorization header)
    const isAdmin = req.headers.authorization;
    
    let query = {};
    if (!isAdmin) {
      // Regular users only see approved events
      query = { approved: true };
    }
    // Admins see all events (approved and pending)
    
    const events = await Event.find(query).populate('createdBy', 'email');
    res.json(events);
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'email');
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error('Get event by ID error:', err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};

export const approveEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  event.approved = true;
  await event.save();
  res.json({ message: "Event approved" });
};

export const deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event deleted" });
};

export const uploadBanner = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const event = await Event.findById(req.params.id);
  event.banner = req.file.path;
  await event.save();

  res.json({ message: "Banner uploaded successfully", path: event.banner });
};
