import express from 'express';
import { register, getStats, getAllUsers } from '../controllers/waitlist.controller';
import { validateRequest } from '../middleware/validateRequest';
import { waitlistSchema } from '../models/waitlist.model';
import { z } from 'zod';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

// Routes
router.post('/register', register);
router.get('/stats', getStats); // TODO: Add admin middleware
router.get('/all', protect, restrictTo('admin', 'super_admin'), getAllUsers);

export default router; 