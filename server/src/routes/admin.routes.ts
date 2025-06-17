import express from 'express';
import { z } from 'zod';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest';
import {
  login,
  createAdmin,
  getProfile,
  updateProfile,
  getAllAdmins,
  toggleAdminStatus
} from '../controllers/admin.controller';

const router = express.Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().min(8).optional(),
  newPassword: z.string().min(8).optional()
}).refine(data => {
  if (data.currentPassword && !data.newPassword) return false;
  if (!data.currentPassword && data.newPassword) return false;
  return true;
}, {
  message: "Both current password and new password are required for password update"
});

// Public routes
router.post('/login', validateRequest(loginSchema), login);

// Protected routes
router.use(protect); // All routes after this middleware require authentication

// Admin profile routes
router.get('/profile', getProfile);
router.patch('/profile', validateRequest(updateProfileSchema), updateProfile);

// Super admin only routes
router.use(restrictTo('super_admin'));

router.post('/create', createAdmin);
router.get('/all', getAllAdmins);
router.patch('/:adminId/toggle-status', toggleAdminStatus);

export default router; 