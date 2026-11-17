import { Router } from 'express';
import {
  TripRole,
  createDocumentSchema,
  updateDocumentSchema,
} from '@waylo/shared';
import * as documentsController from './documents.controller.js';
import { authenticate, requireTripMember } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';

export const documentRoutes = Router({ mergeParams: true });

documentRoutes.use(authenticate);

documentRoutes.get(
  '/',
  requireTripMember(),
  documentsController.getDocuments
);

documentRoutes.get(
  '/:documentId',
  requireTripMember(),
  documentsController.getDocument
);

documentRoutes.post(
  '/',
  requireTripMember(),
  validateBody(createDocumentSchema),
  documentsController.createDocument
);

documentRoutes.put(
  '/:documentId',
  requireTripMember(),
  validateBody(updateDocumentSchema),
  documentsController.updateDocument
);

documentRoutes.delete(
  '/:documentId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  documentsController.deleteDocument
);
