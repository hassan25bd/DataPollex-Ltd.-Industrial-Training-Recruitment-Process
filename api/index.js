import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.error('MongoDB connection failure in serverless function:', error.message);
  }
  return app(req, res);
}
