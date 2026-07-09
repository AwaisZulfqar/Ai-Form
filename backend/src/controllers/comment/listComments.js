import Comment from "../../models/Comment.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AUTHOR_FIELDS } from "../../constants.js";

// GET /api/posts/:id/comments — comments for a post, oldest-first (PRD §7.6).
export const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ postId: req.params.id })
    .sort({ createdAt: 1 })
    .populate("author", AUTHOR_FIELDS)
    .lean();

  sendSuccess(res, comments);
});

export default listComments;
