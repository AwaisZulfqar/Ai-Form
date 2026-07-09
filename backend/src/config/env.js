import "dotenv/config";

const nodeEnv = process.env.NODE_ENV || "development";
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
const aiTimeoutMs = parseInt(process.env.AI_TIMEOUT_MS, 10) || 15000;

const config = { nodeEnv, port, mongoUri, openaiApiKey, openaiModel, corsOrigin, aiTimeoutMs };

const missing = [];
if (!config.mongoUri) missing.push("MONGODB_URI");
if (missing.length > 0) {
  throw new Error(`[env] Missing required environment variable(s): ${missing.join(", ")}`);
}

if (!config.openaiApiKey || config.openaiApiKey === "sk-REPLACE_ME") {
  console.warn("[env] OPENAI_API_KEY not set — /generate will fail until configured");
}

export { config };
export default config;
