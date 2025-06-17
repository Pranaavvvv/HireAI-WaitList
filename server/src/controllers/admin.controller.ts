import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { Admin, adminSchema, AdminDocument } from '../models/admin.model';
import { AppError } from '../middleware/errorHandler';
import { generateToken } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

// Login admin
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    logger.info('Login attempt:', { email });

    // Check if email and password exist
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    // Check if admin exists && password is correct
    const admin = await Admin.findOne({ email }).exec() as AdminDocument | null;
    if (!admin) {
      logger.warn('Login failed: Admin not found', { email });
      throw new AppError('Incorrect email or password', 401);
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn('Login failed: Invalid password', { email });
      throw new AppError('Incorrect email or password', 401);
    }

    // Check if admin is active
    if (!admin.isActive) {
      logger.warn('Login failed: Account deactivated', { email });
      throw new AppError('Your account has been deactivated', 401);
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id.toString());

    // Remove password from output
    const adminWithoutPassword = {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      lastLogin: admin.lastLogin
    };

    logger.info('Login successful', { email, role: admin.role });

    res.status(200).json({
      status: 'success',
      token,
      data: { admin: adminWithoutPassword }
    });
  } catch (error) {
    next(error);
  }
};

// Create new admin (super_admin only)
export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = adminSchema.parse(req.body);

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: validatedData.email }).exec();
    if (existingAdmin) {
      throw new AppError('Email already registered', 400);
    }

    // Create admin with hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
    
    const admin = new Admin({
      ...validatedData,
      password: hashedPassword
    });
    
    await admin.save();

    // Remove password from output
    const adminWithoutPassword = {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: admin.isActive,
      createdAt: admin.createdAt
    };

    res.status(201).json({
      status: 'success',
      data: { admin: adminWithoutPassword }
    });
  } catch (error) {
    next(error);
  }
};

// Get current admin profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password').exec() as AdminDocument | null;
    res.status(200).json({
      status: 'success',
      data: { admin }
    });
  } catch (error) {
    next(error);
  }
};

// Update admin profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id).exec() as AdminDocument | null;
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    // Update basic info
    if (name) admin.name = name;
    if (email) admin.email = email;

    // Update password if provided
    if (currentPassword && newPassword) {
      const isPasswordCorrect = await admin.comparePassword(currentPassword);
      if (!isPasswordCorrect) {
        throw new AppError('Current password is incorrect', 401);
      }
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }

    await admin.save();

    // Remove password from output
    const adminWithoutPassword = {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      updatedAt: admin.updatedAt
    };

    res.status(200).json({
      status: 'success',
      data: { admin: adminWithoutPassword }
    });
  } catch (error) {
    next(error);
  }
};

// Get all admins (super_admin only)
export const getAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await Admin.find().select('-password').exec() as AdminDocument[];
    res.status(200).json({
      status: 'success',
      results: admins.length,
      data: { admins: admins.map(admin => ({
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
      })) }
    });
  } catch (error) {
    next(error);
  }
};

// Toggle admin status (super_admin only)
export const toggleAdminStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId).exec() as AdminDocument | null;
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    // Prevent self-deactivation
    if (admin && admin._id && admin._id.toString() === req.admin._id.toString()) {
      throw new AppError('You cannot deactivate your own account', 400);
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    res.status(200).json({
      status: 'success',
      data: {
        admin: {
          _id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          isActive: admin.isActive
        }
      }
    });
  } catch (error) {
    next(error);
  }
}; 