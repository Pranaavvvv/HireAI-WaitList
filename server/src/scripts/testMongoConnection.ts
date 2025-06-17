import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const testConnection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    logger.info('Attempting to connect to MongoDB Atlas...');
    
    await mongoose.connect(mongoURI);
    logger.info('Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    logger.info('Available collections:', collections.map(c => c.name));
    
    // Test write operation
    const testCollection = mongoose.connection.db.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date() 
    });
    logger.info('Successfully performed write operation');
    
    // Clean up test data
    await testCollection.deleteOne({ test: true });
    logger.info('Successfully cleaned up test data');

    process.exit(0);
  } catch (error) {
    logger.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
};

testConnection(); 