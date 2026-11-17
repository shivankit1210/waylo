import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodSchema } from 'zod';
import { ErrorCode } from '@waylo/shared';
import { sendError } from '../utils/apiResponse.js';

export function formatZodErrors(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_root';
    if (!formatted[key]) {
      formatted[key] = [];
    }
    formatted[key].push(issue.message);
  }
  return formatted;
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await schema.safeParseAsync(req.body);
    if (!result.success) {
      sendError(
        res,
        ErrorCode.VALIDATION_ERROR,
        'Validation failed',
        formatZodErrors(result.error),
        400
      );
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await schema.safeParseAsync(req.query);
    if (!result.success) {
      sendError(
        res,
        ErrorCode.VALIDATION_ERROR,
        'Invalid query parameters',
        formatZodErrors(result.error),
        400
      );
      return;
    }
    req.query = result.data as unknown as Record<string, string>;
    next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await schema.safeParseAsync(req.params);
    if (!result.success) {
      sendError(
        res,
        ErrorCode.VALIDATION_ERROR,
        'Invalid route parameters',
        formatZodErrors(result.error),
        400
      );
      return;
    }
    req.params = result.data as unknown as Record<string, string>;
    next();
  };
}
