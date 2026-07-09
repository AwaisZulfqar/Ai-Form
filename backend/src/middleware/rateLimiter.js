import rateLimit from "express-rate-limit";
import { sendError } from "../utils/response.js";

// Throttle AI generation to protect the free provider quota and deter abuse
// (PRD NFR-8 / §9.6): 10 requests per 15 minutes per IP.
export const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => sendError(res, 429, "You're generating too fast — try again shortly."),
});

export default generateLimiter;
