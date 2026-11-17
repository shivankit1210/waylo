import type { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { AppError } from '../../utils/errors.js';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 'Logged in successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }
    const user = await authService.getMe(req.user.id);
    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.clearCookie('accessToken');
    sendSuccess(res, { loggedOut: true }, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
}
