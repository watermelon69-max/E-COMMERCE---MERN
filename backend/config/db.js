import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error in connecting DB", error.message);
    process.exit(1);
  }
};
export default connectDb;
