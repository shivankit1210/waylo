import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { requireTripMember } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';
import { JournalController } from './journal.controller.js';
import {
  createJournalEntrySchema,
  updateJournalEntrySchema,
  createTripHighlightSchema,
  updateTripHighlightSchema,
} from '@waylo/shared';

export const journalRoutes = Router({ mergeParams: true });

// Protect all journal and analytics routes with authentication & trip membership
journalRoutes.use(authenticate, requireTripMember());

// Trip Analytics
journalRoutes.get('/analytics', JournalController.getTripAnalytics);

// Journal Entries
journalRoutes.get('/entries', JournalController.listJournalEntries);
journalRoutes.get('/entries/:entryId', JournalController.getJournalEntry);
journalRoutes.post(
  '/entries',
  validateBody(createJournalEntrySchema),
  JournalController.createJournalEntry
);
journalRoutes.patch(
  '/entries/:entryId',
  validateBody(updateJournalEntrySchema),
  JournalController.updateJournalEntry
);
journalRoutes.delete('/entries/:entryId', JournalController.deleteJournalEntry);

// Trip Highlights
journalRoutes.get('/highlights', JournalController.listHighlights);
journalRoutes.post(
  '/highlights',
  validateBody(createTripHighlightSchema),
  JournalController.createHighlight
);
journalRoutes.patch(
  '/highlights/:highlightId',
  validateBody(updateTripHighlightSchema),
  JournalController.updateHighlight
);
journalRoutes.delete('/highlights/:highlightId', JournalController.deleteHighlight);
