import mongoose from "mongoose";
import User from "../models/User.js";
import { ApiError } from "./ApiError.js";
import { DEFAULT_USER_EMAIL } from "../constants.js";

// Trusts a client-supplied authorId only if it maps to a real seeded user
// (the demo's "acting as" switcher); anything else falls back to the Default
// User. Keeps write attribution controlled without adding real auth.
export const resolveAuthor = async (authorId) => {
  if (authorId && mongoose.isValidObjectId(authorId)) {
    const user = await User.findById(authorId).select("_id").lean();
    if (user) return user._id;
  }

  const fallback = await User.findOne({ email: DEFAULT_USER_EMAIL }).select("_id").lean();
  if (!fallback) throw ApiError.internal("Default user is not seeded");
  return fallback._id;
};

export default resolveAuthor;
