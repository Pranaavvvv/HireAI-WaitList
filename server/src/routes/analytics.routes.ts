import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { getAnalytics, exportData } from '../controllers/analytics.controller';

const router = express.Router();

// All analytics routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin', 'super_admin'));

// Analytics endpoints
router.get('/', getAnalytics);
router.get('/export', exportData);

export default router; 