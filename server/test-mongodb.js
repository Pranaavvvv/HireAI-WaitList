const mongoose = require('mongoose');
require('dotenv').config();

// Use your MongoDB Atlas connection string directly
const MONGODB_URI = 'mongodb+srv://Pranav:Pranav%402005@cluster0.2qxiyvd.mongodb.net/waitlist?retryWrites=true&w=majority&appName=Cluster0';

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', MONGODB_URI.replace(/:[^:]*@/, ':***@')); // Hide password in logs

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.error('Error details:', error);
  process.exit(1);
});
