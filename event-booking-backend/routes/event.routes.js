import express from "express";
import multer from "multer";
import { createEvent, getEvents, getEventById, approveEvent, deleteEvent, uploadBanner } from "../controllers/event.controller.js";
import { reserveSeat } from "../controllers/booking.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/banners/" });

router.post("/", authMiddleware, createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/:id/approve", authMiddleware, approveEvent);
router.delete("/:id", authMiddleware, deleteEvent);
router.post("/:id/upload-banner", authMiddleware, upload.single("banner"), uploadBanner);
router.post("/:id/book", authMiddleware, (req, res) => {
  req.body.eventId = req.params.id;
  reserveSeat(req, res);
});

export default router;
