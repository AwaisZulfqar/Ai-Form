import mongoose from "mongoose";
import Vote from "../../models/Vote.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";

// GET /api/votes?userId=... — a user's votes so the UI can show their up/down
// state across the feed. Returns an empty list for a missing/invalid user.
export const listUserVotes = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId || !mongoose.isValidObjectId(userId)) {
    return sendSuccess(res, []);
  }

  const votes = await Vote.find({ userId }).select("postId value").lean();
  sendSuccess(
    res,
    votes.map((v) => ({ postId: v.postId, value: v.value }))
  );
});

export default listUserVotes;
