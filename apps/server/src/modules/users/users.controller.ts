import type { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { AppError } from '../../utils/errors.js';

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }
    const profile = await usersService.getProfile(req.user.id);
    sendSuccess(res, profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }
    const profile = await usersService.updateProfile(req.user.id, req.body);
    sendSuccess(res, profile, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
}
