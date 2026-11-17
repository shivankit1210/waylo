import type { Request, Response, NextFunction } from 'express';
import * as invitationService from './invitations.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { AppError } from '../../utils/errors.js';

export async function createInvitation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }
    const invitation = await invitationService.createInvitation(
      req.params.tripId,
      req.user.id,
      req.body
    );
    sendSuccess(res, invitation, 'Invitation link created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function listInvitations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const invitations = await invitationService.listInvitations(req.params.tripId);
    sendSuccess(res, invitations);
  } catch (err) {
    next(err);
  }
}

export async function revokeInvitation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await invitationService.revokeInvitation(
      req.params.tripId,
      req.params.invitationId
    );
    sendSuccess(res, { revoked: true }, 'Invitation revoked successfully');
  } catch (err) {
    next(err);
  }
}

export async function acceptInvitation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }
    const result = await invitationService.acceptInvitation(
      req.user.id,
      req.params.inviteCode
    );
    sendSuccess(res, result, 'Trip invitation accepted successfully');
  } catch (err) {
    next(err);
  }
}
