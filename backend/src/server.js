import app from "./app.js";
import config from "./config/env.js";
import { connectDB } from "./config/db.js";
import { seedUsers } from "./seed/seedUsers.js";
import { seedSamplePosts } from "./seed/seedPosts.js";

const start = async () => {
  try {
    await connectDB();
    await seedUsers();
    await seedSamplePosts();

    app.listen(config.port, () => {
      console.log(`[server] listening on http://localhost:${config.port} (${config.nodeEnv})`);
    });
  } catch (err) {
    console.error("[server] failed to start:", err.message);
    process.exit(1);
  }
};

start();
