// MongoDB connection helper.
import mongoose from "mongoose";
import { MESSAGES } from "../constants/messages";

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(MESSAGES.DB_URI_MISSING);
  }

  try {
    await mongoose.connect(mongoUri);
  } catch (error: unknown) {
    throw error instanceof Error ? error : new Error(MESSAGES.SERVER_ERROR);
  }
};
