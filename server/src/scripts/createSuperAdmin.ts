import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Admin } from '../models/admin.model';
import { logger } from '../utils/logger';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hireai-waitlist';
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB');

    // Delete existing super admin if exists
    await Admin.deleteMany({ role: 'super_admin' });
    logger.info('Deleted existing super admin accounts');

    // Create super admin
    const superAdmin = await Admin.create({
      email: 'admin@hireai.com',
      password: 'Admin@123',
      name: 'Super Admin',
      role: 'super_admin'
    });

    logger.info('Super admin created successfully:', {
      email: superAdmin.email,
      role: superAdmin.role
    });

    process.exit(0);
  } catch (error) {
    logger.error('Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin(); 