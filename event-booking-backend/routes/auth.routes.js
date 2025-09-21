import express from "express";
import multer from "multer";
import { requestOtp, verifyOtp, uploadIdProof } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/idproofs/" });

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/upload-idproof", authMiddleware, upload.single("idProof"), uploadIdProof);

export default router;
