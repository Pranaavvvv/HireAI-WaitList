import express from 'express';
import { joinWaitlist, getWaitlistStats, getWaitlistEntries, updateEntryStatus } from '../controllers/waitlistController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/join', joinWaitlist);

// Protected routes (require authentication)
router.get('/stats', authenticateToken, getWaitlistStats);
router.get('/entries', authenticateToken, getWaitlistEntries);
router.patch('/entries/:id/status', authenticateToken, updateEntryStatus);

export default router; 