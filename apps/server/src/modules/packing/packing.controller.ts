import type { Request, Response, NextFunction } from 'express';
import * as packingService from './packing.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export async function getPackingLists(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const lists = await packingService.getTripPackingLists(tripId);
    sendSuccess(res, lists);
  } catch (err) {
    next(err);
  }
}

export async function createPackingList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const list = await packingService.createPackingList(tripId, req.body);
    sendSuccess(res, list, 'Packing list created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updatePackingList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { listId } = req.params;
    const list = await packingService.updatePackingList(listId, req.body);
    sendSuccess(res, list, 'Packing list updated');
  } catch (err) {
    next(err);
  }
}

export async function deletePackingList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { listId } = req.params;
    const result = await packingService.deletePackingList(listId);
    sendSuccess(res, result, 'Packing list removed');
  } catch (err) {
    next(err);
  }
}

export async function applyTemplate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const { templateKey, name } = req.body;
    const lists = await packingService.applyTemplate(tripId, templateKey, name);
    sendSuccess(res, lists, 'Packing template applied successfully', 201);
  } catch (err) {
    next(err);
  }
}

// ─── Luggage Bags ───────────────────────────────────────────

export async function getLuggageBags(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const bags = await packingService.getLuggageBags(tripId);
    sendSuccess(res, bags);
  } catch (err) {
    next(err);
  }
}

export async function createLuggageBag(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const bag = await packingService.createLuggageBag(tripId, req.body);
    sendSuccess(res, bag, 'Luggage bag added', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateLuggageBag(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { bagId } = req.params;
    const bag = await packingService.updateLuggageBag(bagId, req.body);
    sendSuccess(res, bag, 'Luggage bag updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteLuggageBag(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { bagId } = req.params;
    const result = await packingService.deleteLuggageBag(bagId);
    sendSuccess(res, result, 'Luggage bag removed');
  } catch (err) {
    next(err);
  }
}

// ─── Items ──────────────────────────────────────────────────

export async function createPackingItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { listId } = req.params;
    const item = await packingService.createPackingItem(listId, req.body);
    sendSuccess(res, item, 'Item added to packing list', 201);
  } catch (err) {
    next(err);
  }
}

export async function updatePackingItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { itemId } = req.params;
    const item = await packingService.updatePackingItem(itemId, req.body);
    sendSuccess(res, item, 'Packing item updated');
  } catch (err) {
    next(err);
  }
}

export async function updateItemStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { itemId } = req.params;
    const { status } = req.body;
    const item = await packingService.updateItemStatus(itemId, status);
    sendSuccess(res, item, 'Status updated');
  } catch (err) {
    next(err);
  }
}

export async function batchUpdateStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { itemIds, status } = req.body;
    const result = await packingService.batchUpdateStatus(itemIds, status);
    sendSuccess(res, result, 'Statuses updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deletePackingItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { itemId } = req.params;
    const result = await packingService.deletePackingItem(itemId);
    sendSuccess(res, result, 'Item removed');
  } catch (err) {
    next(err);
  }
}
