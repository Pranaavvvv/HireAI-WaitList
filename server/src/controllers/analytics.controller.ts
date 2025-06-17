import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AppError } from '../middleware/errorHandler';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    
    const [growth, industry, companySize, painPoints] = await Promise.all([
      AnalyticsService.getGrowthAnalytics(days),
      AnalyticsService.getIndustryAnalytics(),
      AnalyticsService.getCompanySizeAnalytics(),
      AnalyticsService.getPainPointsAnalytics()
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        growth,
        industry,
        companySize,
        painPoints
      }
    });
  } catch (error) {
    next(error);
  }
};

export const exportData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileName = await AnalyticsService.exportToCSV();
    const filePath = path.join(__dirname, '../../exports', fileName);

    // Check if file exists
    try {
      await fsPromises.access(filePath);
    } catch {
      throw new AppError('Export file not found', 404);
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Clean up file after sending
    fileStream.on('end', async () => {
      try {
        await fsPromises.unlink(filePath);
      } catch (error) {
        console.error('Error deleting export file:', error);
      }
    });
  } catch (error) {
    next(error);
  }
}; 