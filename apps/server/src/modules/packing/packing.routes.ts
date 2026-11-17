import { Router } from 'express';
import {
  TripRole,
  createPackingListSchema,
  updatePackingListSchema,
  createLuggageBagSchema,
  updateLuggageBagSchema,
  createPackingItemSchema,
  updatePackingItemSchema,
  batchUpdateItemStatusSchema,
  applyPackingTemplateSchema,
} from '@waylo/shared';
import * as packingController from './packing.controller.js';
import { authenticate, requireTripMember } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';

export const packingRoutes = Router({ mergeParams: true });

packingRoutes.use(authenticate);

// ─── Packing Lists Endpoints ────────────────────────────────
packingRoutes.get(
  '/',
  requireTripMember(),
  packingController.getPackingLists
);

packingRoutes.post(
  '/',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(createPackingListSchema),
  packingController.createPackingList
);

packingRoutes.put(
  '/:listId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(updatePackingListSchema),
  packingController.updatePackingList
);

packingRoutes.delete(
  '/:listId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER]),
  packingController.deletePackingList
);

packingRoutes.post(
  '/apply-template',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(applyPackingTemplateSchema),
  packingController.applyTemplate
);

// ─── Luggage Bags Endpoints ─────────────────────────────────
packingRoutes.get(
  '/bags',
  requireTripMember(),
  packingController.getLuggageBags
);

packingRoutes.post(
  '/bags',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(createLuggageBagSchema),
  packingController.createLuggageBag
);

packingRoutes.put(
  '/bags/:bagId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(updateLuggageBagSchema),
  packingController.updateLuggageBag
);

packingRoutes.delete(
  '/bags/:bagId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER]),
  packingController.deleteLuggageBag
);

// ─── Items Endpoints ────────────────────────────────────────
packingRoutes.post(
  '/:listId/items',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(createPackingItemSchema),
  packingController.createPackingItem
);

packingRoutes.put(
  '/items/:itemId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(updatePackingItemSchema),
  packingController.updatePackingItem
);

packingRoutes.patch(
  '/items/:itemId/status',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  packingController.updateItemStatus
);

packingRoutes.post(
  '/items/batch-status',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(batchUpdateItemStatusSchema),
  packingController.batchUpdateStatus
);

packingRoutes.delete(
  '/items/:itemId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  packingController.deletePackingItem
);
