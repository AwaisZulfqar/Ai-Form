import Post from "../../models/Post.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AUTHOR_FIELDS } from "./constants.js";

// GET /api/posts — full feed, newest-first, author populated (PRD §7.2).
export const listPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).populate("author", AUTHOR_FIELDS).lean();

  sendSuccess(res, posts);
});

export default listPosts;
