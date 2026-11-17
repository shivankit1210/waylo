import { Router } from 'express';
import {
  startRideSessionSchema,
  updateRiderLocationSchema,
  sendCrewPingSchema,
} from '@waylo/shared';
import * as trackingController from './tracking.controller.js';
import { authenticate, requireTripMember } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';

export const trackingRoutes = Router({ mergeParams: true });

trackingRoutes.use(authenticate);
trackingRoutes.use(requireTripMember());

trackingRoutes.get('/session', trackingController.getSession);
trackingRoutes.post('/session', trackingController.startSession);
trackingRoutes.patch('/session/end', trackingController.endSession);

trackingRoutes.get('/riders', trackingController.getRiders);
trackingRoutes.post(
  '/location',
  validateBody(updateRiderLocationSchema),
  trackingController.updateLocation
);

trackingRoutes.get('/pings', trackingController.getPings);
trackingRoutes.post(
  '/pings',
  validateBody(sendCrewPingSchema),
  trackingController.sendPing
);
