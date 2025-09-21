import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
  idProof: { type: String }
});

export default mongoose.model("User", userSchema);
