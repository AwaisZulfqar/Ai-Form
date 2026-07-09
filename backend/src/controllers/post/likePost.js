import Post from "../../models/Post.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";

// PATCH /api/posts/:id/like — atomic increment (PRD §7.5).
export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { likeCount: 1 } },
    { new: true, projection: { likeCount: 1 } }
  ).lean();

  if (!post) throw ApiError.notFound("Post not found");

  sendSuccess(res, { _id: post._id, likeCount: post.likeCount });
});

export default likePost;
