import express from "express";
import multer from "multer";
import { reserveSeat, cancelBooking, getMyBookings, confirmBooking, getAllBookings, uploadIdProof, approveBooking, rejectBooking } from "../controllers/booking.controller.js";
import { getBookingAnalytics } from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/idproofs/" });

router.post("/", authMiddleware, reserveSeat);
router.get("/me", authMiddleware, getMyBookings);
router.get("/all", authMiddleware, getAllBookings);
router.get("/analytics", authMiddleware, getBookingAnalytics);
router.put("/:id/cancel", authMiddleware, cancelBooking);
router.put("/:id/confirm", authMiddleware, confirmBooking);
router.post("/:id/upload-idproof", authMiddleware, upload.single("idProof"), uploadIdProof);
router.put("/:id/approve", authMiddleware, approveBooking);
router.put("/:id/reject", authMiddleware, rejectBooking);

export default router;
