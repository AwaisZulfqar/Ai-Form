import Post from "../../models/Post.js";
import Vote from "../../models/Vote.js";
import { ApiError } from "../../utils/ApiError.js";
import { resolveAuthor } from "../../utils/resolveAuthor.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";

// PATCH /api/posts/:id/vote — per-user up/down vote with toggle. One vote per
// user per post: re-sending the same value clears it, the opposite flips it.
// likeCount / dislikeCount are kept as denormalized counters via $inc.
export const votePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const value = Number(req.body.value); // validated to 1 or -1
  const userId = await resolveAuthor(req.body.userId);

  const post = await Post.findById(id).select("_id").lean();
  if (!post) throw ApiError.notFound("Post not found");

  const existing = await Vote.findOne({ postId: id, userId });

  let likeInc = 0;
  let dislikeInc = 0;
  let userVote = 0;

  if (!existing) {
    await Vote.create({ postId: id, userId, value });
    userVote = value;
    if (value === 1) likeInc = 1;
    else dislikeInc = 1;
  } else if (existing.value === value) {
    await existing.deleteOne();
    userVote = 0;
    if (value === 1) likeInc = -1;
    else dislikeInc = -1;
  } else {
    existing.value = value;
    await existing.save();
    userVote = value;
    if (value === 1) {
      likeInc = 1;
      dislikeInc = -1;
    } else {
      likeInc = -1;
      dislikeInc = 1;
    }
  }

  const updated = await Post.findByIdAndUpdate(
    id,
    { $inc: { likeCount: likeInc, dislikeCount: dislikeInc } },
    { new: true, projection: { likeCount: 1, dislikeCount: 1 } }
  ).lean();

  sendSuccess(res, {
    _id: updated._id,
    likeCount: Math.max(0, updated.likeCount),
    dislikeCount: Math.max(0, updated.dislikeCount),
    userVote,
  });
});

export default votePost;
