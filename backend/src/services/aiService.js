import OpenAI from "openai";
import config from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const TITLE_MAX = 120;
const CONTENT_MIN = 50;
const CONTENT_MAX = 2000;

// Single friendly message for every AI failure mode — provider down, bad key,
// timeout, unparseable/invalid output. Internals are logged, never leaked (PRD §13).
const AI_FAIL_MSG = "Unable to generate post right now. Please try again.";

let client;
const getClient = () => {
  if (!config.openaiApiKey || config.openaiApiKey === "sk-REPLACE_ME") {
    console.error("[ai] OPENAI_API_KEY not configured");
    throw ApiError.badGateway(AI_FAIL_MSG);
  }
  if (!client) {
    client = new OpenAI({ apiKey: config.openaiApiKey, timeout: config.aiTimeoutMs });
  }
  return client;
};

const buildPrompt = (
  topic
) => `You are a knowledgeable community member starting a discussion on an online forum.
Write an engaging forum post about the topic: "${topic}".

Content requirements:
- A concise, catchy title of at most 120 characters, with no surrounding quotes.
- A body of 80 to 250 words that raises a clear question or opinion to spark replies.
- A natural, conversational, discussion-starter tone. Not an encyclopedia entry.
- Open with a hook or a personal angle, then invite others to respond by the end.

Writing style (very important, follow strictly):
- Write in plain, human English that sounds like a real person typing, not an AI.
- Do not use em dashes or en dashes. Use commas, periods, or the words "and" and "but" instead.
- Do not use contractions. Write the full words. For example write "I would" not "I'd", "I will" not "I'll", "do not" not "don't", "it is" not "it's", "cannot" not "can't".
- Avoid cliche openers and buzzwords such as "in today's fast-paced world", "delve", "leverage", "unlock", "game changer", "tapestry", and "navigate the landscape".
- Vary your sentence length so the writing has a natural rhythm.
- Do not use emojis, hashtags, headings, bullet points, or any markdown inside the body.

Return ONLY valid JSON, with no markdown fences and no extra text:
{ "title": "...", "content": "..." }`;

// JSON mode should return clean JSON, but strip stray ```json fences defensively.
const stripFences = (s) =>
  s
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

// Given a topic, return a validated { title, content }. Throws a 502 ApiError on
// any failure so the controller never persists a partial/invalid post (PRD §9.3).
export const generatePostContent = async (topic) => {
  const openai = getClient();

  let completion;
  try {
    completion = await openai.chat.completions.create({
      model: config.openaiModel,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You write engaging forum discussion posts and return strict JSON only.",
        },
        { role: "user", content: buildPrompt(topic) },
      ],
    });
  } catch (err) {
    console.error("[ai] provider call failed:", err.message);
    throw ApiError.badGateway(AI_FAIL_MSG);
  }

  const raw = completion.choices?.[0]?.message?.content ?? "";

  let parsed;
  try {
    parsed = JSON.parse(stripFences(raw));
  } catch {
    console.error("[ai] JSON parse failed. raw:", raw.slice(0, 200));
    throw ApiError.badGateway(AI_FAIL_MSG);
  }

  const title = typeof parsed.title === "string" ? parsed.title.trim() : "";
  const content = typeof parsed.content === "string" ? parsed.content.trim() : "";

  if (!title || title.length > TITLE_MAX) {
    console.error(`[ai] invalid title (len ${title.length})`);
    throw ApiError.badGateway(AI_FAIL_MSG);
  }
  if (content.length < CONTENT_MIN || content.length > CONTENT_MAX) {
    console.error(`[ai] invalid content (len ${content.length})`);
    throw ApiError.badGateway(AI_FAIL_MSG);
  }

  return { title, content };
};

export default generatePostContent;
