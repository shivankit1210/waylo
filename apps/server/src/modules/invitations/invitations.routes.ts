import { Router } from 'express';
import { TripRole, createInvitationSchema } from '@waylo/shared';
import * as invitationController from './invitations.controller.js';
import { authenticate, requireTripMember } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';

// Sub-router for /trips/:tripId/invitations
export const tripInvitationRoutes = Router({ mergeParams: true });

tripInvitationRoutes.use(authenticate);

tripInvitationRoutes.post(
  '/',
  requireTripMember([TripRole.OWNER, TripRole.LEADER]),
  validateBody(createInvitationSchema),
  invitationController.createInvitation
);

tripInvitationRoutes.get(
  '/',
  requireTripMember(),
  invitationController.listInvitations
);

tripInvitationRoutes.delete(
  '/:invitationId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER]),
  invitationController.revokeInvitation
);

// Top-level router for /invitations
export const invitationRoutes = Router();

invitationRoutes.use(authenticate);
invitationRoutes.post('/accept/:inviteCode', invitationController.acceptInvitation);
