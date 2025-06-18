import express from 'express';
import { joinWaitlist, getWaitlistStats, getWaitlistEntries, updateEntryStatus } from '../controllers/waitlistController';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/join', joinWaitlist);

// Protected routes (require authentication)
router.get('/stats', protect, getWaitlistStats);
router.get('/entries', protect, getWaitlistEntries);
router.patch('/entries/:id/status', protect, updateEntryStatus);

export default router; 