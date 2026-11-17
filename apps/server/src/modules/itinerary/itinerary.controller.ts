import type { Request, Response, NextFunction } from 'express';
import * as itineraryService from './itinerary.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export async function getItinerary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const days = await itineraryService.getTripItinerary(tripId);
    sendSuccess(res, days);
  } catch (err) {
    next(err);
  }
}

export async function createDay(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const day = await itineraryService.createDay(tripId, req.body);
    sendSuccess(res, day, 'Itinerary day created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function batchGenerateDays(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const days = await itineraryService.batchGenerateDays(tripId, req.body);
    sendSuccess(res, days, 'Itinerary days generated successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateDay(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId, dayId } = req.params;
    const day = await itineraryService.updateDay(tripId, dayId, req.body);
    sendSuccess(res, day, 'Itinerary day updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteDay(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId, dayId } = req.params;
    const result = await itineraryService.deleteDay(tripId, dayId);
    sendSuccess(res, result, 'Itinerary day deleted successfully');
  } catch (err) {
    next(err);
  }
}

export async function createItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId, dayId } = req.params;
    const item = await itineraryService.createItem(tripId, dayId, req.body);
    sendSuccess(res, item, 'Stop / activity added successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId, dayId, itemId } = req.params;
    const item = await itineraryService.updateItem(tripId, dayId, itemId, req.body);
    sendSuccess(res, item, 'Stop / activity updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function toggleItemComplete(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId, dayId, itemId } = req.params;
    const item = await itineraryService.toggleItemComplete(tripId, dayId, itemId);
    sendSuccess(res, item, 'Activity status updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId, dayId, itemId } = req.params;
    const result = await itineraryService.deleteItem(tripId, dayId, itemId);
    sendSuccess(res, result, 'Stop / activity removed successfully');
  } catch (err) {
    next(err);
  }
}

export async function reorderItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId, dayId } = req.params;
    const items = await itineraryService.reorderItems(tripId, dayId, req.body.items);
    sendSuccess(res, items, 'Activities reordered successfully');
  } catch (err) {
    next(err);
  }
}
