import Post from "../../models/Post.js";
import Comment from "../../models/Comment.js";
import User from "../../models/User.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AUTHOR_FIELDS, DEFAULT_USER_EMAIL } from "../../constants.js";

// POST /api/posts/:id/comments — create a comment as the Default User and bump
// the post's denormalized commentCount (PRD §7.7 / §6.3).
export const createComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id).select("_id").lean();
  if (!post) throw ApiError.notFound("Post not found");

  const user = await User.findOne({ email: DEFAULT_USER_EMAIL }).select("_id").lean();
  if (!user) throw ApiError.internal("Default user is not seeded");

  const comment = await Comment.create({ postId: id, author: user._id, text: req.body.text });
  await Post.findByIdAndUpdate(id, { $inc: { commentCount: 1 } });
  await comment.populate("author", AUTHOR_FIELDS);

  sendSuccess(res, comment.toObject(), 201);
});

export default createComment;
