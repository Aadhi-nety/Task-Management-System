import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database connection configuration
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

/**
 * Get database connection status
 */
const getDBStatus = () => {
  return {
    connected: mongoose.connection.readyState === 1,
    state: mongoose.STATES[mongoose.connection.readyState]
  };
};

/**
 * Close database connection
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

export { connectDB, getDBStatus, closeDB };