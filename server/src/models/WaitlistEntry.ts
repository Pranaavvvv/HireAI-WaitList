import mongoose, { Schema, Document } from 'mongoose';

export interface IWaitlistEntry extends Document {
  email: string;
  name: string;
  company: string;
  role: string;
  companySize: string;
  industry: string;
  useCase: string;
  referralSource: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  lastUpdated: Date;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    country?: string;
    city?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
  };
}

const WaitlistEntrySchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  companySize: { type: String, required: true },
  industry: { type: String, required: true },
  useCase: { type: String, required: true },
  referralSource: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  lastUpdated: { type: Date, default: Date.now },
  metadata: {
    ipAddress: String,
    userAgent: String,
    country: String,
    city: String,
    deviceType: String,
    browser: String,
    os: String
  }
});

export default mongoose.model<IWaitlistEntry>('WaitlistEntry', WaitlistEntrySchema); 