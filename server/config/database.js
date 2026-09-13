const mongoose = require('mongoose');

/**
 * Connect to MongoDB instance using Mongoose.
 * Logs connection status and handles connection error events.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crypto-compass';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn('[Database Warning] Running in offline database mode. Start MongoDB daemon to enable persistence.');
  }

  mongoose.connection.on('error', (err) => {
    console.error(`[Database Error] Runtime connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('[Database] MongoDB disconnected');
  });
};

module.exports = connectDB;
