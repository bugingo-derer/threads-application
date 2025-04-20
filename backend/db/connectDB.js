import mongoose from "mongoose";
import dotenv from "dotenv"

//package config
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully ${conn.connection.host}`);
  } catch (error) {
    console.error("Error in connectDB: ", error);
    process.exit(1);
  }
}

export default connectDB