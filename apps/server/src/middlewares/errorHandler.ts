import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ErrorCode } from '@waylo/shared';
import { AppError } from '../utils/errors.js';
import { error as formatError, sendError } from '../utils/apiResponse.js';
import { formatZodErrors } from './validate.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response | void {
  // Handle AppError
  if (err instanceof AppError) {
    return sendError(res, err.code, err.message, err.details, err.statusCode);
  }

  // Handle Zod validation error
  if (err instanceof ZodError) {
    return sendError(
      res,
      ErrorCode.VALIDATION_ERROR,
      'Validation failed',
      formatZodErrors(err),
      400
    );
  }

  // Handle Prisma errors
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const prismaErr = err as { code: string; meta?: Record<string, unknown>; message?: string };
    if (prismaErr.code === 'P2002') {
      const target = Array.isArray(prismaErr.meta?.target)
        ? (prismaErr.meta?.target as string[]).join(', ')
        : 'field';
      return sendError(
        res,
        ErrorCode.CONFLICT,
        `A record with this ${target} already exists`,
        undefined,
        409
      );
    }
    if (prismaErr.code === 'P2025') {
      return sendError(
        res,
        ErrorCode.NOT_FOUND,
        'The requested record was not found',
        undefined,
        404
      );
    }
    if (prismaErr.code === 'P2003') {
      return sendError(
        res,
        ErrorCode.BAD_REQUEST,
        'Referenced related record does not exist',
        undefined,
        400
      );
    }
  }

  // Handle JSON parse error (SyntaxError from express body parser)
  if (err instanceof SyntaxError && 'status' in err && (err as { status?: number }).status === 400) {
    return sendError(res, ErrorCode.BAD_REQUEST, 'Malformed JSON payload', undefined, 400);
  }

  // Fallback internal server error
  logger.error('Unhandled Server Error:', err);

  const message = (err as Error)?.message || 'An unexpected error occurred';

  return res.status(500).json(formatError(ErrorCode.INTERNAL_ERROR, message));
}
