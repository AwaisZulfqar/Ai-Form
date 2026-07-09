export class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "ApiError";
  }

  static badRequest(message, errors = null) {
    return new ApiError(400, message, errors);
  }

  static notFound(message = "Not found") {
    return new ApiError(404, message);
  }

  static badGateway(message) {
    return new ApiError(502, message);
  }

  static internal(message) {
    return new ApiError(500, message);
  }

  static tooMany(message) {
    return new ApiError(429, message);
  }
}

export default ApiError;
