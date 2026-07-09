import { Router } from "express";
import { listPosts, getPost, generatePost, likePost } from "../controllers/post/index.js";
import { validate } from "../middleware/validate.js";
import { generateLimiter } from "../middleware/rateLimiter.js";
import { postIdParam, topicChain } from "../validators/postValidators.js";
import commentRoutes from "./commentRoutes.js";

const router = Router();

router.get("/", listPosts);
router.post("/generate", generateLimiter, topicChain, validate, generatePost);
router.get("/:id", postIdParam, validate, getPost);
router.patch("/:id/like", postIdParam, validate, likePost);
router.use("/:id/comments", commentRoutes);

export default router;
