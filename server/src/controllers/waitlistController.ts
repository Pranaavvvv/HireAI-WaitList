import { Request, Response } from 'express';
import WaitlistEntry from '../models/WaitlistEntry';
import UAParser from 'ua-parser-js';
import geoip from 'geoip-lite';

export const joinWaitlist = async (req: Request, res: Response) => {
  try {
    const {
      email,
      name,
      company,
      role,
      companySize,
      industry,
      useCase,
      referralSource
    } = req.body;

    // Check if email already exists
    const existingEntry = await WaitlistEntry.findOne({ email });
    if (existingEntry) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Parse user agent and get device info
    const ua = new UAParser(req.headers['user-agent']);
    const deviceInfo = ua.getDevice();
    const browserInfo = ua.getBrowser();
    const osInfo = ua.getOS();

    // Get location info from IP
    const ip = req.ip || req.socket.remoteAddress || '';
    const geo = geoip.lookup(ip);

    const entry = new WaitlistEntry({
      email,
      name,
      company,
      role,
      companySize,
      industry,
      useCase,
      referralSource,
      metadata: {
        ipAddress: ip,
        userAgent: req.headers['user-agent'],
        country: geo?.country,
        city: geo?.city,
        deviceType: deviceInfo.type || 'desktop',
        browser: browserInfo.name,
        os: osInfo.name
      }
    });

    await entry.save();
    res.status(201).json({ message: 'Successfully joined waitlist' });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    res.status(500).json({ message: 'Error joining waitlist' });
  }
};

export const getWaitlistStats = async (req: Request, res: Response) => {
  try {
    const totalEntries = await WaitlistEntry.countDocuments();
    const pendingEntries = await WaitlistEntry.countDocuments({ status: 'pending' });
    const approvedEntries = await WaitlistEntry.countDocuments({ status: 'approved' });
    const rejectedEntries = await WaitlistEntry.countDocuments({ status: 'rejected' });

    // Get company size distribution
    const companySizeStats = await WaitlistEntry.aggregate([
      { $group: { _id: '$companySize', count: { $sum: 1 } } }
    ]);

    // Get industry distribution
    const industryStats = await WaitlistEntry.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 } } }
    ]);

    // Get role distribution
    const roleStats = await WaitlistEntry.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Get use case distribution
    const useCaseStats = await WaitlistEntry.aggregate([
      { $group: { _id: '$useCase', count: { $sum: 1 } } }
    ]);

    // Get referral source distribution
    const referralStats = await WaitlistEntry.aggregate([
      { $group: { _id: '$referralSource', count: { $sum: 1 } } }
    ]);

    // Get device type distribution
    const deviceStats = await WaitlistEntry.aggregate([
      { $group: { _id: '$metadata.deviceType', count: { $sum: 1 } } }
    ]);

    // Get country distribution
    const countryStats = await WaitlistEntry.aggregate([
      { $group: { _id: '$metadata.country', count: { $sum: 1 } } }
    ]);

    // Get daily signup trend
    const dailySignups = await WaitlistEntry.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalEntries,
      pendingEntries,
      approvedEntries,
      rejectedEntries,
      companySizeStats,
      industryStats,
      roleStats,
      useCaseStats,
      referralStats,
      deviceStats,
      countryStats,
      dailySignups
    });
  } catch (error) {
    console.error('Error getting waitlist stats:', error);
    res.status(500).json({ message: 'Error getting waitlist stats' });
  }
};

export const getWaitlistEntries = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const entries = await WaitlistEntry.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await WaitlistEntry.countDocuments(query);

    res.json({
      entries,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error getting waitlist entries:', error);
    res.status(500).json({ message: 'Error getting waitlist entries' });
  }
};

export const updateEntryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const entry = await WaitlistEntry.findByIdAndUpdate(
      id,
      { status, lastUpdated: new Date() },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error updating entry status:', error);
    res.status(500).json({ message: 'Error updating entry status' });
  }
}; 