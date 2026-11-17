import type { Response } from 'express';
import type { ApiResponse, ApiError, PaginatedResponse } from '@waylo/shared';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function success<T>(data: T, message?: string): ApiResponse<T> {
  const res: ApiResponse<T> = {
    success: true,
    data,
  };
  if (message) {
    res.message = message;
  }
  return res;
}

export function paginated<T>(
  data: T[],
  pagination: PaginationMeta
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination,
  };
}

export function error(
  code: string,
  message: string,
  details?: Record<string, string[]>
): ApiError {
  const res: ApiError = {
    success: false,
    error: {
      code,
      message,
    },
  };
  if (details && Object.keys(details).length > 0) {
    res.error.details = details;
  }
  return res;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response {
  return res.status(statusCode).json(success(data, message));
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  statusCode = 200
): Response {
  return res.status(statusCode).json(paginated(data, pagination));
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  details?: Record<string, string[]>,
  statusCode = 400
): Response {
  return res.status(statusCode).json(error(code, message, details));
}
