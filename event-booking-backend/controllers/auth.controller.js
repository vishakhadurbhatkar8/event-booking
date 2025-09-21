import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

// Step 1: Request OTP (for now just generate & return it)
export const requestOtp = async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email, role: email === "superadmin@gmail.com" ? "superadmin" : "user" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  await user.save();

  // TODO: Send via email (here we return for testing)
  res.json({ message: "OTP generated", otp });
  console.log(otp)
};

// Step 2: Verify OTP and login
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.otp = null; // reset otp
  await user.save();

  res.json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// Upload ID Proof
export const uploadIdProof = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const user = await User.findById(req.user.id);
  user.idProof = req.file.path;
  await user.save();

  res.json({ message: "ID Proof uploaded successfully", path: user.idProof });
};
