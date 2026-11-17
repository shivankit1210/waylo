import { Router } from 'express';
import {
  TripRole,
  createItineraryDaySchema,
  updateItineraryDaySchema,
  batchGenerateDaysSchema,
  createItineraryItemSchema,
  updateItineraryItemSchema,
  reorderItineraryItemsSchema,
} from '@waylo/shared';
import * as itineraryController from './itinerary.controller.js';
import { authenticate, requireTripMember } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';

export const itineraryRoutes = Router({ mergeParams: true });

itineraryRoutes.use(authenticate);

// ─── Days Endpoints ─────────────────────────────────────────

// GET /api/v1/trips/:tripId/itinerary — Fetch all days with items
itineraryRoutes.get(
  '/',
  requireTripMember(),
  itineraryController.getItinerary
);

// POST /api/v1/trips/:tripId/itinerary/days — Add a day
itineraryRoutes.post(
  '/days',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(createItineraryDaySchema),
  itineraryController.createDay
);

// POST /api/v1/trips/:tripId/itinerary/days/batch-generate — Auto-generate days
itineraryRoutes.post(
  '/days/batch-generate',
  requireTripMember([TripRole.OWNER, TripRole.LEADER]),
  validateBody(batchGenerateDaysSchema),
  itineraryController.batchGenerateDays
);

// PUT /api/v1/trips/:tripId/itinerary/days/:dayId — Update a day
itineraryRoutes.put(
  '/days/:dayId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(updateItineraryDaySchema),
  itineraryController.updateDay
);

// DELETE /api/v1/trips/:tripId/itinerary/days/:dayId — Delete a day
itineraryRoutes.delete(
  '/days/:dayId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER]),
  itineraryController.deleteDay
);

// ─── Items / Stops Endpoints ────────────────────────────────

// POST /api/v1/trips/:tripId/itinerary/days/:dayId/items — Add an item/stop
itineraryRoutes.post(
  '/days/:dayId/items',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(createItineraryItemSchema),
  itineraryController.createItem
);

// PUT /api/v1/trips/:tripId/itinerary/days/:dayId/items/reorder — Reorder items
itineraryRoutes.put(
  '/days/:dayId/items/reorder',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(reorderItineraryItemsSchema),
  itineraryController.reorderItems
);

// PUT /api/v1/trips/:tripId/itinerary/days/:dayId/items/:itemId — Update an item
itineraryRoutes.put(
  '/days/:dayId/items/:itemId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(updateItineraryItemSchema),
  itineraryController.updateItem
);

// PATCH /api/v1/trips/:tripId/itinerary/days/:dayId/items/:itemId/toggle-complete — Toggle complete
itineraryRoutes.patch(
  '/days/:dayId/items/:itemId/toggle-complete',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  itineraryController.toggleItemComplete
);

// DELETE /api/v1/trips/:tripId/itinerary/days/:dayId/items/:itemId — Delete an item
itineraryRoutes.delete(
  '/days/:dayId/items/:itemId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  itineraryController.deleteItem
);
