import { Router } from 'express';
import {
  TripRole,
  createAccommodationSchema,
  updateAccommodationSchema,
} from '@waylo/shared';
import * as accommodationsController from './accommodations.controller.js';
import { authenticate, requireTripMember } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';

export const accommodationRoutes = Router({ mergeParams: true });

accommodationRoutes.use(authenticate);

accommodationRoutes.get(
  '/',
  requireTripMember(),
  accommodationsController.getAccommodations
);

accommodationRoutes.get(
  '/:accommodationId',
  requireTripMember(),
  accommodationsController.getAccommodation
);

accommodationRoutes.post(
  '/',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(createAccommodationSchema),
  accommodationsController.createAccommodation
);

accommodationRoutes.put(
  '/:accommodationId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(updateAccommodationSchema),
  accommodationsController.updateAccommodation
);

accommodationRoutes.delete(
  '/:accommodationId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER]),
  accommodationsController.deleteAccommodation
);
