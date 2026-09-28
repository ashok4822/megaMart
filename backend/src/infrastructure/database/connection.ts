import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(uri: string): Promise<void> {
  if (isConnected) return;

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  console.log("MongoDB connected");

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
    isConnected = false;
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err);
    isConnected = false;
  });
}
