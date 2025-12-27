const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not set. Create a .env file with MONGO_URI.');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_URI, {
    autoIndex: true,
  });
  return mongoose.connection;
}

module.exports = { connectDB };
