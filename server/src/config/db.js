import mongoose from 'mongoose';

// Disable query buffering so disconnected queries fail immediately instead of hanging
mongoose.set('bufferCommands', false);

let cachedConnection = null;

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;

  // If on Vercel and URI points to localhost or is missing, skip attempting localhost connection
  if (process.env.VERCEL && (!uri || uri.includes('127.0.0.1') || uri.includes('localhost'))) {
    console.log('Vercel environment detected without external MongoDB URI. Using cloud data store.');
    return null;
  }

  if (!uri) {
    console.log('No MONGODB_URI provided. Using cloud data store.');
    return null;
  }

  try {
    cachedConnection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${cachedConnection.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.warn(`MongoDB connection skipped (${error.message}). Using cloud data store.`);
    return null;
  }
};

