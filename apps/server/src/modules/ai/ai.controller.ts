import type { Request, Response, NextFunction } from 'express';
import { aiService } from './ai.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export async function generateItinerary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const itinerary = await aiService.generateItinerary(req.body);
    sendSuccess(res, itinerary, 'Itinerary generated successfully');
  } catch (error) {
    next(error);
  }
}

export async function applyItinerary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId, itinerary } = req.body;
    const result = await aiService.applyItineraryToTrip(tripId, itinerary);
    sendSuccess(res, result, result.message, 201);
  } catch (error) {
    next(error);
  }
}

export async function generatePacking(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const packing = await aiService.generatePacking(req.body);
    sendSuccess(res, packing, 'Packing checklist generated successfully');
  } catch (error) {
    next(error);
  }
}

export async function applyPacking(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId, items } = req.body;
    const result = await aiService.applyPackingToTrip(tripId, items);
    sendSuccess(res, result, result.message, 201);
  } catch (error) {
    next(error);
  }
}

export async function chatCopilot(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await aiService.chatCopilot(req.body);
    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
}
