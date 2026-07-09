import { param, body } from "express-validator";

// Reusable express-validator chains for post routes. Paired with the shared
// `validate` middleware, which turns any failures into the 400 error envelope.
export const postIdParam = param("id").isMongoId().withMessage("Invalid post ID");

export const topicChain = body("topic")
  .trim()
  .notEmpty()
  .withMessage("Topic cannot be empty")
  .bail()
  .isLength({ min: 3 })
  .withMessage("Topic must be at least 3 characters")
  .isLength({ max: 100 })
  .withMessage("Topic must be at most 100 characters");

export const voteChain = body("value")
  .toInt()
  .isIn([1, -1])
  .withMessage("Vote value must be 1 (up) or -1 (down)");
