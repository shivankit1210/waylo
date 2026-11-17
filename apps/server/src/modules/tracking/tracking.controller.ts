import type { Request, Response, NextFunction } from 'express';
import { trackingService } from './tracking.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { AppError } from '../../utils/errors.js';

export async function getSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const session = trackingService.getSession(tripId);
    sendSuccess(res, session);
  } catch (error) {
    next(error);
  }
}

export async function startSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const { name } = req.body;
    const session = await trackingService.startSession(tripId, name || 'Live Convoy Session');
    sendSuccess(res, session, 'Live ride session started', 201);
  } catch (error) {
    next(error);
  }
}

export async function endSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const session = await trackingService.endSession(tripId);
    if (!session) {
      throw AppError.notFound('No active ride session found');
    }
    sendSuccess(res, session, 'Live ride session ended');
  } catch (error) {
    next(error);
  }
}

export async function getRiders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const riders = trackingService.getRoomRiders(tripId);
    sendSuccess(res, riders);
  } catch (error) {
    next(error);
  }
}

export async function updateLocation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const user = req.user!;
    const location = trackingService.updateLocation(
      tripId,
      user.id,
      user.displayName,
      null,
      req.body
    );
    sendSuccess(res, location);
  } catch (error) {
    next(error);
  }
}

export async function getPings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const pings = trackingService.getRecentPings(tripId);
    sendSuccess(res, pings);
  } catch (error) {
    next(error);
  }
}

export async function sendPing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const user = req.user!;
    const { pingType, message, latitude, longitude } = req.body;
    const alert = trackingService.sendCrewPing(
      tripId,
      user.id,
      user.displayName,
      pingType,
      message,
      latitude,
      longitude
    );
    sendSuccess(res, alert, 'Crew alert broadcasted', 201);
  } catch (error) {
    next(error);
  }
}
