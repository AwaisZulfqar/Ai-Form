import Post from "../../models/Post.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AUTHOR_FIELDS } from "../../constants.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// GET /api/posts?page=1&limit=10 — feed page, newest-first, author populated,
// with pagination metadata (PRD §7.2).
export const listPosts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(req.query.limit, 10) || DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments(),
  ]);

  sendSuccess(res, {
    posts,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    hasMore: skip + posts.length < total,
  });
});

export default listPosts;
