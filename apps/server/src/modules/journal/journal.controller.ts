import type { Request, Response } from 'express';
import { JournalService } from './journal.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export class JournalController {
  // ─── Journal Entries ────────────────────────────────────────

  static async listJournalEntries(req: Request, res: Response) {
    const tripId = req.params.tripId as string;
    const entries = await JournalService.listJournalEntries(tripId);
    return sendSuccess(res, entries);
  }

  static async getJournalEntry(req: Request, res: Response) {
    const tripId = req.params.tripId as string;
    const entryId = req.params.entryId as string;
    const entry = await JournalService.getJournalEntry(tripId, entryId);
    return sendSuccess(res, entry);
  }

  static async createJournalEntry(req: Request, res: Response) {
    const tripId = req.params.tripId as string;
    const userId = req.user!.id;
    const entry = await JournalService.createJournalEntry(tripId, userId, req.body);
    return sendSuccess(res, entry, 'Journal memory saved', 201);
  }

  static async updateJournalEntry(req: Request, res: Response) {
    const tripId = req.params.tripId as string;
    const entryId = req.params.entryId as string;
    const updated = await JournalService.updateJournalEntry(tripId, entryId, req.body);
    return sendSuccess(res, updated, 'Journal entry updated');
  }

  static async deleteJournalEntry(req: Request, res: Response) {
    const tripId = req.params.tripId as string;
    const entryId = req.params.entryId as string;
    await JournalService.deleteJournalEntry(tripId, entryId);
    return sendSuccess(res, null, 'Journal entry removed');
  }

  // ─── Trip Highlights ────────────────────────────────────────

  static async listHighlights(req: Request, res: Response) {
    const tripId = req.params.tripId as string;
    const highlights = await JournalService.listHighlights(tripId);
    return sendSuccess(res, highlights);
  }

  static async createHighlight(req: Request, res: Response) {
    const tripId = req.params.tripId as string;
    const highlight = await JournalService.createHighlight(tripId, req.body);
    return sendSuccess(res, highlight, 'Highlight added', 201);
  }

  static async updateHighlight(req: Request, res: Response) {
    const tripId = req.params.tripId as string;
    const highlightId = req.params.highlightId as string;
    const updated = await JournalService.updateHighlight(tripId, highlightId, req.body);
    return sendSuccess(res, updated, 'Highlight updated');
  }

  static async deleteHighlight(req: Request, res: Response) {
    const tripId = req.params.tripId as string;
    const highlightId = req.params.highlightId as string;
    await JournalService.deleteHighlight(tripId, highlightId);
    return sendSuccess(res, null, 'Highlight removed');
  }

  // ─── Analytics ──────────────────────────────────────────────

  static async getTripAnalytics(req: Request, res: Response) {
    const tripId = req.params.tripId as string;
    const analytics = await JournalService.getTripAnalytics(tripId);
    return sendSuccess(res, analytics);
  }
}
