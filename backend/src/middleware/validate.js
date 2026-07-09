import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

// Runs after express-validator chains: collects any failures into the
// standard field-error envelope (PRD §7.9) and forwards a 400 ApiError.
export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  next(ApiError.badRequest("Validation failed", errors));
};

export default validate;
