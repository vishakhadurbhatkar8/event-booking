import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected", "cancelled"], default: "pending" },
  reservedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // For countdown functionality
  idProof: { type: String }, // Path to uploaded ID proof file
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Superadmin who approved/rejected
  approvedAt: { type: Date },
  rejectionReason: { type: String } // Reason for rejection if applicable
});

export default mongoose.model("Booking", bookingSchema);
