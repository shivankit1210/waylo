import { Router } from 'express';
import {
  TripRole,
  createTripSchema,
  updateTripSchema,
  paginationSchema,
} from '@waylo/shared';
import * as tripController from './trips.controller.js';
import { authenticate, requireTripMember } from '../../middlewares/auth.js';
import { validateBody, validateQuery } from '../../middlewares/validate.js';

export const tripRoutes = Router();

// All trip routes require authentication
tripRoutes.use(authenticate);

// Trip collection routes
tripRoutes.get('/', validateQuery(paginationSchema), tripController.listTrips);
tripRoutes.post('/', validateBody(createTripSchema), tripController.createTrip);

// Trip resource routes
tripRoutes.get('/:tripId', requireTripMember(), tripController.getTrip);
tripRoutes.put(
  '/:tripId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER]),
  validateBody(updateTripSchema),
  tripController.updateTrip
);
tripRoutes.delete(
  '/:tripId',
  requireTripMember([TripRole.OWNER]),
  tripController.deleteTrip
);

// Trip actions
tripRoutes.post(
  '/:tripId/duplicate',
  requireTripMember(),
  tripController.duplicateTrip
);
tripRoutes.patch(
  '/:tripId/status',
  requireTripMember([TripRole.OWNER, TripRole.LEADER]),
  tripController.updateStatus
);
tripRoutes.patch(
  '/:tripId/archive',
  requireTripMember([TripRole.OWNER]),
  tripController.archiveTrip
);
