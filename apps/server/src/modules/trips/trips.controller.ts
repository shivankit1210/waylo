import type { Request, Response, NextFunction } from 'express';
import { TripStatus } from '@waylo/shared';
import * as tripService from './trips.service.js';
import { sendSuccess, sendPaginated } from '../../utils/apiResponse.js';
import { AppError } from '../../utils/errors.js';

export async function listTrips(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }

    const { page, pageSize, search, sortBy, sortOrder, status } = req.query as {
      page?: string;
      pageSize?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      status?: string;
    };

    const filters = {
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      search,
      sortBy,
      sortOrder: sortOrder ?? 'desc',
      status,
    };

    const result = await tripService.listTrips(req.user.id, filters);
    sendPaginated(res, result.trips, result.pagination);
  } catch (err) {
    next(err);
  }
}

export async function createTrip(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }

    const trip = await tripService.createTrip(req.user.id, req.body);
    sendSuccess(res, trip, 'Trip created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function getTrip(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const trip = await tripService.getTrip(req.params.tripId);
    sendSuccess(res, trip);
  } catch (err) {
    next(err);
  }
}

export async function updateTrip(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const trip = await tripService.updateTrip(req.params.tripId, req.body);
    sendSuccess(res, trip, 'Trip updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteTrip(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await tripService.deleteTrip(req.params.tripId);
    sendSuccess(res, { deleted: true }, 'Trip deleted successfully');
  } catch (err) {
    next(err);
  }
}

export async function duplicateTrip(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }

    const trip = await tripService.duplicateTrip(req.user.id, req.params.tripId);
    sendSuccess(res, trip, 'Trip duplicated successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { status } = req.body;
    if (!status || !Object.values(TripStatus).includes(status)) {
      throw AppError.badRequest('A valid trip status is required');
    }

    const trip = await tripService.updateStatus(req.params.tripId, status);
    sendSuccess(res, trip, 'Trip status updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function archiveTrip(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const trip = await tripService.archiveTrip(req.params.tripId);
    sendSuccess(res, trip, 'Trip archived successfully');
  } catch (err) {
    next(err);
  }
}
