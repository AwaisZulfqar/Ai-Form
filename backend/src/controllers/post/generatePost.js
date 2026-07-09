import Post from "../../models/Post.js";
import User from "../../models/User.js";
import { generatePostContent } from "../../services/aiService.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AUTHOR_FIELDS, DEFAULT_USER_EMAIL } from "./constants.js";

// POST /api/posts/generate — validate topic → AI → persist as the Default User
// (PRD §4.1 / §7.4). The AI service throws 502 before we ever reach create(),
// so a partial/invalid post is never saved.
export const generatePost = asyncHandler(async (req, res) => {
  const { topic } = req.body;

  const user = await User.findOne({ email: DEFAULT_USER_EMAIL }).select("_id").lean();
  if (!user) throw ApiError.internal("Default user is not seeded");

  const { title, content } = await generatePostContent(topic);

  const post = await Post.create({ title, content, topic, author: user._id });
  await post.populate("author", AUTHOR_FIELDS);

  sendSuccess(res, post.toObject(), 201);
});

export default generatePost;
