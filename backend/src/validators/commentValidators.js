import { body } from "express-validator";

// Comment text rules (PRD §12.4): required, 1-500 chars after trim.
export const commentTextChain = body("text")
  .trim()
  .notEmpty()
  .withMessage("Comment cannot be empty")
  .bail()
  .isLength({ max: 500 })
  .withMessage("Comment must be at most 500 characters");
