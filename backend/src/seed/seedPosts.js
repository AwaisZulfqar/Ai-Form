import Post from "../models/Post.js";
import User from "../models/User.js";
import { seedDefaultUser } from "./seedUser.js";
import { connectDB, disconnectDB } from "../config/db.js";

const SAMPLE_POSTS = [
  {
    topic: "Remote work",
    title: "Is remote work quietly killing team culture?",
    content:
      "Three years fully remote and I still can't decide. Async docs and no commute are great, but I've watched the hallway chatter that used to spark half our ideas just vanish. Some teammates thrive; others have basically gone invisible. Do you think strong culture can actually survive without a shared room, or are we just pretending Slack replaces it?",
  },
  {
    topic: "AI coding assistants",
    title: "Are AI coding assistants making us worse engineers?",
    content:
      "I ship faster than ever, but I've noticed I reach for the autocomplete before I've even finished thinking through the problem. Junior devs on my team can produce working code they can't fully explain. Is this just the same panic people had about IDEs and Stack Overflow, or is there something different about offloading the actual reasoning? Curious where everyone lands.",
  },
  {
    topic: "Open source burnout",
    title: "Maintainers are burning out — who actually pays for open source?",
    content:
      "Half the internet runs on libraries maintained by one exhausted person on nights and weekends. Companies build billion-dollar products on top and contribute nothing back but bug reports. Sponsorship helps a little, but it feels like a broken model. What would actually fix this — foundations, paid maintainership, licensing changes? Or is unpaid passion just the deal we all silently accepted?",
  },
];

// Idempotently seeds a few discussion-starter posts so the feed isn't empty on
// first load (PRD §9.7 / M1). Skips entirely once any post exists so it never
// clobbers real user-generated content. Assumes DB is already connected.
export const seedSamplePosts = async () => {
  const user = await User.findOne({ email: "default@aiforum.local" });
  if (!user) throw new Error("[seed] Default User missing — seed the user first");

  const existing = await Post.countDocuments();
  if (existing > 0) {
    console.log(`[seed] ${existing} post(s) already exist — skipping sample posts`);
    return [];
  }

  const created = await Post.insertMany(SAMPLE_POSTS.map((p) => ({ ...p, author: user._id })));
  console.log(`[seed] inserted ${created.length} sample post(s)`);
  return created;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await connectDB();
    await seedDefaultUser();
    await seedSamplePosts();
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default seedSamplePosts;
