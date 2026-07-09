import { ApiError } from "../utils/ApiError.js";
import { sendError } from "../utils/response.js";

export const errorHandler = (err, req, res, next) => {
  void next;
  console.error(err);

  let statusCode = 500;
  let message = "Something went wrong";
  let errors;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  sendError(res, statusCode, message, errors);
};

export default errorHandler;
