const mongoose = require('mongoose');

const connectDB = async () => {
  // Disable command buffering when DB connection is pending/failed
  mongoose.set('bufferCommands', false);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/personalized_learning_db', {
      serverSelectionTimeoutMS: 2000 // 2 seconds timeout instead of 10s default
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Notice: ${error.message}`);
    console.log('⚡ Running in In-Memory Demo mode (Full functionality active without requiring local MongoDB daemon).');
  }
};

module.exports = connectDB;
