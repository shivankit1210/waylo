import { ErrorCode } from '@waylo/shared';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, string[]>;

  constructor(
    statusCode: number,
    code: string | ErrorCode,
    message: string,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string, details?: Record<string, string[]>): AppError {
    return new AppError(400, ErrorCode.BAD_REQUEST, message, details);
  }

  static validation(message: string, details?: Record<string, string[]>): AppError {
    return new AppError(400, ErrorCode.VALIDATION_ERROR, message, details);
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError(401, ErrorCode.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Forbidden: insufficient permissions'): AppError {
    return new AppError(403, ErrorCode.FORBIDDEN, message);
  }

  static notFound(message = 'Resource not found'): AppError {
    return new AppError(404, ErrorCode.NOT_FOUND, message);
  }

  static conflict(message: string): AppError {
    return new AppError(409, ErrorCode.CONFLICT, message);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(500, ErrorCode.INTERNAL_ERROR, message);
  }
}
