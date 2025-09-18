import express from 'express';
import {
  listEvents,
  getEvent,
  createEvent,
  editEvent,
  removeEvent,
  approveEvent,
  rejectEvent,
  uploadBanner,
  upload
} from '../controllers/event.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', listEvents);
router.get('/:id', verifyToken, getEvent);
router.post('/', verifyToken, requireRole('superadmin'), createEvent);
router.put('/:id', verifyToken, requireRole('superadmin'), editEvent);
router.delete('/:id', verifyToken, requireRole('superadmin'), removeEvent);
router.put('/:id/approve', verifyToken, requireRole('superadmin'), approveEvent);
router.put('/:id/reject', verifyToken, requireRole('superadmin'), rejectEvent);
router.post('/:id/upload-banner', verifyToken, requireRole('superadmin'), upload.single('file'), uploadBanner);

export default router;
