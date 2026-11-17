import type { Request, Response, NextFunction } from 'express';
import * as membersService from './members.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { AppError } from '../../utils/errors.js';

export async function listMembers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const members = await membersService.listMembers(req.params.tripId);
    sendSuccess(res, members);
  } catch (err) {
    next(err);
  }
}

export async function addMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, role } = req.body;
    const member = await membersService.addMember(req.params.tripId, email, role);
    sendSuccess(res, member, 'Member added successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateMemberRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { role } = req.body;
    const member = await membersService.updateMemberRole(
      req.params.tripId,
      req.params.memberId,
      role
    );
    sendSuccess(res, member, 'Member role updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function removeMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }
    await membersService.removeMember(
      req.params.tripId,
      req.params.memberId,
      req.user.id
    );
    sendSuccess(res, { removed: true }, 'Member removed successfully');
  } catch (err) {
    next(err);
  }
}
