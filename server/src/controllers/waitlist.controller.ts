import { Request, Response, NextFunction } from 'express';
import { Waitlist, waitlistSchema, WaitlistEntry } from '../models/waitlist.model';
import { emailService } from '../utils/emailService';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Register a new waitlist entry
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Received registration request:', {
      body: req.body,
      headers: req.headers
    });

    try {
      const validatedData = waitlistSchema.parse(req.body);
      logger.info('Data validated successfully:', validatedData);
    } catch (validationError: any) {
      logger.error('Zod Validation error caught in controller:', validationError.errors);
      return next(new AppError(
        'Validation failed',
        400,
        validationError.errors.map((error: any) => ({
          field: error.path.join('.'),
          message: error.message
        }))
      ));
    }

    const existingEntry = await Waitlist.findOne({ email: req.body.email });
    if (existingEntry) {
      throw new AppError('Email already registered', 400);
    }

    const waitlistEntry = await Waitlist.create({
      ...req.body,
      isVerified: true // Set to true by default, no verification needed
    });

    // Send welcome email immediately (optional, or remove if not desired)
    // await emailService.sendWelcomeEmail(req.body.email, req.body.firstName);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Welcome to the waitlist!',
      data: {
        email: waitlistEntry.email,
        firstName: waitlistEntry.firstName
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get waitlist statistics (admin only)
export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = await Waitlist.countDocuments();
    const verified = await Waitlist.countDocuments({ isVerified: true });
    const byIndustry = await Waitlist.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const byCompanySize = await Waitlist.aggregate([
      { $group: { _id: '$companySize', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        total,
        verified,
        byIndustry,
        byCompanySize
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all waitlist users (admin only)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await Waitlist.find().select('-verificationCode -verificationCodeExpires -__v');
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    next(error);
  }
}; 