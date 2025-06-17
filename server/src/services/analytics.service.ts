import { Waitlist } from '../models/waitlist.model';
import { logger } from '../utils/logger';
import { createObjectCsvWriter } from 'csv-writer';
import { format } from 'date-fns';
import path from 'path';

export class AnalyticsService {
  // Get waitlist growth over time
  static async getGrowthAnalytics(days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const dailyGrowth = await Waitlist.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 },
            verified: {
              $sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] }
            }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      return dailyGrowth;
    } catch (error) {
      logger.error('Error getting growth analytics:', error);
      throw error;
    }
  }

  // Get industry distribution
  static async getIndustryAnalytics() {
    try {
      const industryStats = await Waitlist.aggregate([
        {
          $group: {
            _id: "$industry",
            count: { $sum: 1 },
            verifiedCount: {
              $sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] }
            }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return industryStats;
    } catch (error) {
      logger.error('Error getting industry analytics:', error);
      throw error;
    }
  }

  // Get company size distribution
  static async getCompanySizeAnalytics() {
    try {
      const companySizeStats = await Waitlist.aggregate([
        {
          $group: {
            _id: "$companySize",
            count: { $sum: 1 },
            verifiedCount: {
              $sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] }
            }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return companySizeStats;
    } catch (error) {
      logger.error('Error getting company size analytics:', error);
      throw error;
    }
  }

  // Get pain points analysis
  static async getPainPointsAnalytics() {
    try {
      const painPoints = await Waitlist.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            painPoints: { $push: "$painPoints" }
          }
        }
      ]);

      // Basic text analysis (can be enhanced with NLP)
      const painPointsText = painPoints[0]?.painPoints.join(' ').toLowerCase() || '';
      const commonWords = this.analyzeText(painPointsText);

      return {
        total: painPoints[0]?.total || 0,
        commonWords
      };
    } catch (error) {
      logger.error('Error getting pain points analytics:', error);
      throw error;
    }
  }

  // Export waitlist data to CSV
  static async exportToCSV() {
    try {
      const waitlistData = await Waitlist.find().select('-verificationCode -verificationCodeExpires');
      
      const exportPath = path.join(__dirname, '../../exports');
      const fileName = `waitlist-export-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`;
      
      const csvWriter = createObjectCsvWriter({
        path: path.join(exportPath, fileName),
        header: [
          { id: 'firstName', title: 'First Name' },
          { id: 'lastName', title: 'Last Name' },
          { id: 'email', title: 'Email' },
          { id: 'phone', title: 'Phone' },
          { id: 'company', title: 'Company' },
          { id: 'role', title: 'Role' },
          { id: 'companySize', title: 'Company Size' },
          { id: 'industry', title: 'Industry' },
          { id: 'currentTools', title: 'Current Tools' },
          { id: 'painPoints', title: 'Pain Points' },
          { id: 'hearAbout', title: 'How They Heard About Us' },
          { id: 'newsletter', title: 'Newsletter Subscribed' },
          { id: 'isVerified', title: 'Verified' },
          { id: 'createdAt', title: 'Registration Date' }
        ]
      });

      await csvWriter.writeRecords(waitlistData);
      return fileName;
    } catch (error) {
      logger.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  // Helper method for text analysis
  private static analyzeText(text: string) {
    const words = text.split(/\W+/);
    const wordCount: { [key: string]: number } = {};
    
    // Common words to exclude
    const excludeWords = new Set([
      'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
      'his', 'from', 'they', 'will', 'would', 'there', 'their', 'what', 'about',
      'which', 'when', 'make', 'like', 'time', 'just', 'know', 'people', 'into',
      'year', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
      'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
      'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
      'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
    ]);

    words.forEach(word => {
      if (word.length > 3 && !excludeWords.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));
  }
} 