import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

const AUTHOR_FIELDS = "name avatar";

// GET /api/posts — full feed, newest-first, author populated (PRD §7.2).
export const listPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).populate("author", AUTHOR_FIELDS).lean();

  sendSuccess(res, posts);
});

// GET /api/posts/:id — one post plus its comments, oldest-first (PRD §7.3).
export const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate("author", AUTHOR_FIELDS).lean();
  if (!post) throw ApiError.notFound("Post not found");

  const comments = await Comment.find({ postId: id })
    .sort({ createdAt: 1 })
    .populate("author", AUTHOR_FIELDS)
    .lean();

  sendSuccess(res, { ...post, comments });
});
