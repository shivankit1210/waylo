import type { Request, Response, NextFunction } from 'express';
import { accommodationsService } from './accommodations.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export async function getAccommodations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const stays = await accommodationsService.listAccommodations(tripId);
    sendSuccess(res, stays);
  } catch (error) {
    next(error);
  }
}

export async function getAccommodation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { accommodationId } = req.params;
    const stay = await accommodationsService.getAccommodation(accommodationId);
    sendSuccess(res, stay);
  } catch (error) {
    next(error);
  }
}

export async function createAccommodation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const stay = await accommodationsService.createAccommodation(tripId, req.body);
    sendSuccess(res, stay, 'Accommodation booking created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateAccommodation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { accommodationId } = req.params;
    const stay = await accommodationsService.updateAccommodation(accommodationId, req.body);
    sendSuccess(res, stay, 'Accommodation booking updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteAccommodation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { accommodationId } = req.params;
    const result = await accommodationsService.deleteAccommodation(accommodationId);
    sendSuccess(res, result, 'Accommodation booking deleted successfully');
  } catch (error) {
    next(error);
  }
}
