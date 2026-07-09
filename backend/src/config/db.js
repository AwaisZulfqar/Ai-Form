import mongoose from "mongoose";
import config from "./env.js";

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async () => {
  mongoose.set("strictQuery", true);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      console.log(`[db] connection attempt ${attempt}/${MAX_ATTEMPTS}`);
      const conn = await mongoose.connect(config.mongoUri);
      console.log(`[db] connected to ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.log(`[db] attempt ${attempt} failed: ${err.message}`);
      if (attempt === MAX_ATTEMPTS) {
        throw err;
      }
      await sleep(RETRY_DELAY_MS);
    }
  }
};

export const getDbState = () => mongoose.connection.readyState;

export const disconnectDB = async () => mongoose.disconnect();

export default connectDB;
