import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";
import mongoose from "mongoose";

export const reserveSeat = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existing = await Booking.findOne({ user: userId, event: eventId });
    if (existing) {
      return res.status(400).json({ message: "You already have a booking request for this event" });
    }

    const booking = new Booking({
      user: userId,
      event: eventId,
      status: "pending", // Changed to pending - requires superadmin approval
      reservedAt: new Date(),
      expiresAt: new Date(Date.now() + 120000) // 2 minutes from now
    });
    await booking.save();

    res.json({ 
      message: "Booking request submitted successfully! Please upload your ID proof to complete the reservation.", 
      booking 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking request failed" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "reserved") {
      return res.status(400).json({ message: "Booking is not in reserved status" });
    }

    booking.status = "confirmed";
    await booking.save();

    res.json({ message: "Booking confirmed successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to confirm booking" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event")
      .sort({ reservedAt: -1 });

    console.log('Bookings found:', bookings.length);
    console.log('First booking:', bookings[0]);
    console.log('First booking event:', bookings[0]?.event);

    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const uploadIdProof = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "No ID proof file uploaded" });
    }

    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "ID proof can only be uploaded for pending bookings" });
    }

    booking.idProof = req.file.path;
    await booking.save();

    res.json({ 
      message: "ID proof uploaded successfully! Your booking is now under review.", 
      booking 
    });
  } catch (err) {
    console.error('Upload ID proof error:', err);
    res.status(500).json({ message: "Failed to upload ID proof" });
  }
};

export const approveBooking = async (req, res) => {
  try {
    // Only superadmin can approve bookings
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: "Access denied. Superadmin only." });
    }

    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId).populate("event").populate("user", "email");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be approved" });
    }

    booking.status = "approved";
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();
    await booking.save();

    res.json({ 
      message: "Booking approved successfully!", 
      booking 
    });
  } catch (err) {
    console.error('Approve booking error:', err);
    res.status(500).json({ message: "Failed to approve booking" });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    // Only superadmin can reject bookings
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: "Access denied. Superadmin only." });
    }

    const bookingId = req.params.id;
    const { reason } = req.body;
    const booking = await Booking.findById(bookingId).populate("event").populate("user", "email");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be rejected" });
    }

    booking.status = "rejected";
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();
    booking.rejectionReason = reason || "No reason provided";
    await booking.save();

    res.json({ 
      message: "Booking rejected successfully!", 
      booking 
    });
  } catch (err) {
    console.error('Reject booking error:', err);
    res.status(500).json({ message: "Failed to reject booking" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    // Only superadmin can access this endpoint
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: "Access denied. Superadmin only." });
    }

    const bookings = await Booking.find({})
      .populate("event")
      .populate("user", "email")
      .populate("approvedBy", "email")
      .sort({ reservedAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error('Get all bookings error:', err);
    res.status(500).json({ message: "Failed to fetch all bookings" });
  }
};
