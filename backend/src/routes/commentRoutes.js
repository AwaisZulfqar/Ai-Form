import { Router } from "express";
import { listComments, createComment } from "../controllers/comment/index.js";
import { validate } from "../middleware/validate.js";
import { postIdParam } from "../validators/postValidators.js";
import { commentTextChain } from "../validators/commentValidators.js";

// mergeParams so the parent :id (post id) is visible here.
const router = Router({ mergeParams: true });

router.get("/", postIdParam, validate, listComments);
router.post("/", postIdParam, commentTextChain, validate, createComment);

export default router;
