import express from 'express';
import { register, getStats } from '../controllers/waitlist.controller';
import { validateRequest } from '../middleware/validateRequest';
import { waitlistSchema } from '../models/waitlist.model';
import { z } from 'zod';

const router = express.Router();

// Routes
router.post('/register', register);
router.get('/stats', getStats); // TODO: Add admin middleware

export default router; 