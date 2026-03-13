/**
 * Custom error class for API responses
 * Extends built-in Error class with status code
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON format for response
   */
  toJSON() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

module.exports = ApiError;