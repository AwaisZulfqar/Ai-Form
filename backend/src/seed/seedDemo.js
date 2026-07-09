import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { seedUsers } from "./seedUsers.js";
import { connectDB, disconnectDB } from "../config/db.js";
import { DEFAULT_USER_EMAIL } from "../constants.js";

// Posts authored by the non-default seeded users so the feed visibly shows
// multiple people even on an already-populated database.
const DEMO_POSTS = [
  {
    email: "alex@aiforum.local",
    topic: "Design systems",
    title: "Do design systems slow small teams down?",
    content:
      "Every team I join eventually wants a design system, then spends three months building tokens and Storybook pages instead of shipping. For a five-person startup, is that upfront cost ever worth it, or should we just keep a tidy component folder and revisit once the product actually has traction? Curious where the line really is.",
  },
  {
    email: "sam@aiforum.local",
    topic: "Testing",
    title: "How much testing is actually enough?",
    content:
      "I keep seeing teams chase one hundred percent coverage and then still ship bugs, because the tests only checked the easy paths. Lately I write fewer tests but aim them at the parts that would genuinely hurt if they broke. Where do you draw the line between confidence and just padding the coverage number?",
  },
  {
    email: "jordan@aiforum.local",
    topic: "Career growth",
    title: "Is the senior-to-staff jump mostly about writing less code?",
    content:
      "The higher I go, the less my day is about typing and the more it is about aligning people who disagree. Nobody warned me that the staff jump would feel like trading my favourite part of the job for meetings and documents. Is that just how it goes, or have people found a way to stay hands-on and still grow?",
  },
];

const DEMO_COMMENTS = [
  {
    email: "maya@aiforum.local",
    text: "This matches my experience completely. The cost is real early on.",
  },
  {
    email: "sam@aiforum.local",
    text: "Counterpoint: a thin system pays off the moment a second team touches the code.",
  },
];

export const seedDemoContent = async () => {
  const users = await User.find().select("_id email name").lean();
  const byEmail = Object.fromEntries(users.map((u) => [u.email, u]));
  const nonDefault = users.filter((u) => u.email !== DEFAULT_USER_EMAIL);
  if (nonDefault.length === 0) throw new Error("[seed] seed users first");

  const marker = await Post.exists({ author: { $in: nonDefault.map((u) => u._id) } });
  if (marker) {
    console.log("[seed] demo content already present — skipping");
    return;
  }

  const created = await Post.insertMany(
    DEMO_POSTS.map((p) => ({
      topic: p.topic,
      title: p.title,
      content: p.content,
      author: byEmail[p.email]._id,
    }))
  );

  const target = created[0];
  const comments = DEMO_COMMENTS.filter((c) => byEmail[c.email]).map((c) => ({
    postId: target._id,
    author: byEmail[c.email]._id,
    text: c.text,
  }));
  await Comment.insertMany(comments);
  await Post.findByIdAndUpdate(target._id, { $inc: { commentCount: comments.length } });

  console.log(`[seed] inserted ${created.length} demo posts + ${comments.length} comments`);
  return created;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await connectDB();
    await seedUsers();
    await seedDemoContent();
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default seedDemoContent;
