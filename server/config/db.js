import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const dbconnection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${dbconnection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit process with failure — no point running a backend with no DB
    process.exit(1);
  }
};

export default connectDB;
