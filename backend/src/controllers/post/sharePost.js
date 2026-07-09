import Post from "../../models/Post.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";

// PATCH /api/posts/:id/share — atomic increment of the share counter.
export const sharePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { shareCount: 1 } },
    { new: true, projection: { shareCount: 1 } }
  ).lean();

  if (!post) throw ApiError.notFound("Post not found");

  sendSuccess(res, { _id: post._id, shareCount: post.shareCount });
});

export default sharePost;
