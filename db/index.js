import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // console.log("DB_URI:", process.env.DB_URI);

    await mongoose.connect(process.env.DB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
