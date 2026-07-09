import { Router } from "express";
import { param } from "express-validator";
import { listPosts, getPost } from "../controllers/postController.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const postIdParam = param("id").isMongoId().withMessage("Invalid post ID");

router.get("/", listPosts);
router.get("/:id", postIdParam, validate, getPost);

export default router;
