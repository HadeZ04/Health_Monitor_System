/**
 * Custom Error Classes
 * Standardized error handling across the application
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request', details?: unknown) {
    super(message, 400, true, 'BAD_REQUEST', details);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', details?: unknown) {
    super(message, 401, true, 'UNAUTHORIZED', details);
  }
}

// 403 Forbidden
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', details?: unknown) {
    super(message, 403, true, 'FORBIDDEN', details);
  }
}

// 404 Not Found
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: unknown) {
    super(message, 404, true, 'NOT_FOUND', details);
  }
}

// 409 Conflict
export class ConflictError extends AppError {
  constructor(message: string = 'Conflict', details?: unknown) {
    super(message, 409, true, 'CONFLICT', details);
  }
}

// 422 Unprocessable Entity
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: unknown) {
    super(message, 422, true, 'VALIDATION_ERROR', details);
  }
}

// 429 Too Many Requests
export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests', details?: unknown) {
    super(message, 429, true, 'TOO_MANY_REQUESTS', details);
  }
}

// 500 Internal Server Error
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: unknown) {
    super(message, 500, false, 'INTERNAL_SERVER_ERROR', details);
  }
}

// 503 Service Unavailable
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service unavailable', details?: unknown) {
    super(message, 503, true, 'SERVICE_UNAVAILABLE', details);
  }
}

// 502 Bad Gateway
export class BadGatewayError extends AppError {
  constructor(message: string = 'Bad gateway', details?: unknown) {
    super(message, 502, true, 'BAD_GATEWAY', details);
  }
}
