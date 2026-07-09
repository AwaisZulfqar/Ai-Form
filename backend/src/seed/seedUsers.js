import User from "../models/User.js";
import { connectDB, disconnectDB } from "../config/db.js";
import { DEFAULT_USER_EMAIL } from "../constants.js";

// Default User is the fallback actor (PRD §6.1). The rest exist so the demo can
// attribute posts/comments to different people via the "acting as" switcher.
export const SEED_USERS = [
  { name: "Default User", email: DEFAULT_USER_EMAIL },
  { name: "Alex Rivera", email: "alex@aiforum.local" },
  { name: "Sam Chen", email: "sam@aiforum.local" },
  { name: "Jordan Lee", email: "jordan@aiforum.local" },
  { name: "Maya Patel", email: "maya@aiforum.local" },
];

export const seedUsers = async () => {
  const users = await Promise.all(
    SEED_USERS.map((u) =>
      User.findOneAndUpdate(
        { email: u.email },
        { $setOnInsert: { name: u.name, email: u.email, avatar: null } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );
  console.log(`[seed] ensured ${users.length} users`);
  return users;
};

// Backwards-compatible helper for callers that only need the default actor.
export const seedDefaultUser = async () => {
  const [defaultUser] = await seedUsers();
  return defaultUser;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await connectDB();
    await seedUsers();
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default seedUsers;
