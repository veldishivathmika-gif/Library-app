const mongoose = require('mongoose');

async function connectDB() {
  try {
    
    await mongoose.connect("mongodb://localhost:27017/library");
    console.log('MongoDB connected:', mongoose.connection.host);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
