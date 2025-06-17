import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Zod schema for validation
export const adminSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'super_admin']).default('admin'),
  lastLogin: z.date().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export type IAdmin = z.infer<typeof adminSchema>;

// Define methods interface
interface IAdminMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create a Model type that knows about IUserMethods
type AdminModel = Model<IAdmin, {}, IAdminMethods>;

type AdminDocument = Document<unknown, {}, IAdmin> & IAdmin & IAdminMethods & {
  _id: mongoose.Types.ObjectId;
};

// Mongoose schema
const adminMongooseSchema = new Schema<IAdmin, AdminModel, IAdminMethods>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
adminMongooseSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.updatedAt = new Date();
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
adminMongooseSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
adminMongooseSchema.index({ role: 1 });

export const Admin = mongoose.model<IAdmin, AdminModel>('Admin', adminMongooseSchema);
export type { AdminDocument };