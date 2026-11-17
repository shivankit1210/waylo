import { Router } from 'express';
import { TripRole, addMemberSchema, updateMemberRoleSchema } from '@waylo/shared';
import * as membersController from './members.controller.js';
import { authenticate, requireTripMember } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';

export const memberRoutes = Router({ mergeParams: true });

memberRoutes.use(authenticate);

memberRoutes.get('/', requireTripMember(), membersController.listMembers);
memberRoutes.post(
  '/',
  requireTripMember([TripRole.OWNER, TripRole.LEADER]),
  validateBody(addMemberSchema),
  membersController.addMember
);
memberRoutes.put(
  '/:memberId',
  requireTripMember([TripRole.OWNER]),
  validateBody(updateMemberRoleSchema),
  membersController.updateMemberRole
);
memberRoutes.delete(
  '/:memberId',
  requireTripMember(),
  membersController.removeMember
);
