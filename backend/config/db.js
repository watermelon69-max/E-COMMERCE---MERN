import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
   const connect= console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error in connecting DB", error.message);
  }
};
export default connectDb;
