import { Router } from 'express';
import {
  generateItinerarySchema,
  applyAIItinerarySchema,
  generatePackingSchema,
  applyAIPackingSchema,
  chatCopilotSchema,
} from '@waylo/shared';
import * as aiController from './ai.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';

export const aiRoutes = Router();

aiRoutes.use(authenticate);

aiRoutes.post(
  '/generate-itinerary',
  validateBody(generateItinerarySchema),
  aiController.generateItinerary
);

aiRoutes.post(
  '/apply-itinerary',
  validateBody(applyAIItinerarySchema),
  aiController.applyItinerary
);

aiRoutes.post(
  '/generate-packing',
  validateBody(generatePackingSchema),
  aiController.generatePacking
);

aiRoutes.post(
  '/apply-packing',
  validateBody(applyAIPackingSchema),
  aiController.applyPacking
);

aiRoutes.post(
  '/chat',
  validateBody(chatCopilotSchema),
  aiController.chatCopilot
);
