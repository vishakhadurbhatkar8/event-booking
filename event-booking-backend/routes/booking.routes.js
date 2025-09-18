import express from 'express';
import {
  listUserBookings,
  reserveSeat,
  confirmBooking,
  cancelBookingCtrl,
  uploadIdProof,
  upload
} from '../controllers/booking.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, listUserBookings);
router.post('/reserve', verifyToken, reserveSeat);
router.post('/:id/confirm', verifyToken, confirmBooking);
router.post('/:id/cancel', verifyToken, cancelBookingCtrl);
router.post('/:id/upload-id', verifyToken, upload.single('file'), uploadIdProof);

export default router;
