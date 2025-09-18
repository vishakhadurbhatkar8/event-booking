import express from 'express';
import { requestOtp, verifyOtp } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

export default router;
