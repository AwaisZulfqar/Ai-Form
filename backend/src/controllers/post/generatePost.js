import Post from "../../models/Post.js";
import { generatePostContent } from "../../services/aiService.js";
import { resolveAuthor } from "../../utils/resolveAuthor.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AUTHOR_FIELDS } from "../../constants.js";

// POST /api/posts/generate — validate topic → AI → persist as the selected
// (or Default) user (PRD §4.1 / §7.4). The AI service throws 502 before we ever
// reach create(), so a partial/invalid post is never saved.
export const generatePost = asyncHandler(async (req, res) => {
  const { topic, authorId } = req.body;

  const author = await resolveAuthor(authorId);
  const { title, content } = await generatePostContent(topic);

  const post = await Post.create({ title, content, topic, author });
  await post.populate("author", AUTHOR_FIELDS);

  sendSuccess(res, post.toObject(), 201);
});

export default generatePost;
