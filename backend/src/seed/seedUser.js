import User from "../models/User.js";
import { connectDB, disconnectDB } from "../config/db.js";

// Idempotently upserts the Default User (PRD §9.7 / §6.1). Assumes DB is already connected.
export const seedDefaultUser = async () => {
  const email = "default@aiforum.local";

  const existing = await User.findOne({ email });

  const user = await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { name: "Default User", email, avatar: null } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(existing ? "[seed] Default User already exists" : "[seed] Default User created");

  return user;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await connectDB();
    await seedDefaultUser();
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default seedDefaultUser;
