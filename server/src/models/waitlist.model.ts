import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const waitlistSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  companySize: z.string().min(1, 'Please select company size'),
  industry: z.string().min(1, 'Please select industry'),
  currentTools: z.string().optional().default(''),
  painPoints: z.string().min(10, 'Please describe your main challenges'),
  hearAbout: z.string().min(1, 'Please tell us how you heard about us'),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  isVerified: z.boolean().default(true),
  verificationCode: z.string().optional(),
  verificationCodeExpires: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export type WaitlistEntry = z.infer<typeof waitlistSchema>;

// Mongoose schema
const waitlistMongooseSchema = new Schema<WaitlistEntry & Document>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true
  },
  company: { type: String, required: true },
  role: { type: String, required: true },
  companySize: { type: String, required: true },
  industry: { type: String, required: true },
  currentTools: { type: String, default: '' },
  painPoints: { type: String, required: true },
  hearAbout: { type: String, required: true },
  newsletter: { type: Boolean, default: false },
  terms: { type: Boolean, required: true },
  isVerified: { type: Boolean, default: true },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add unique indexes with explicit names to prevent duplicates
waitlistMongooseSchema.index({ email: 1 }, { unique: true, name: 'email_unique' });
waitlistMongooseSchema.index({ phone: 1 }, { unique: true, name: 'phone_unique' });
waitlistMongooseSchema.index({ createdAt: -1 });

// Pre-save middleware
waitlistMongooseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Waitlist = mongoose.model<WaitlistEntry & Document>('Waitlist', waitlistMongooseSchema); 