import type { Request, Response, NextFunction } from 'express';
import { routesService } from './routes.service.js';
import { weatherService } from './weather.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export async function getTripRoute(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { tripId } = req.params;
    const routeData = await routesService.getTripRoute(tripId);
    sendSuccess(res, routeData);
  } catch (error) {
    next(error);
  }
}

export async function getDirections(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { waypoints } = req.body;
    const route = await routesService.calculateDirections(waypoints || []);
    sendSuccess(res, route);
  } catch (error) {
    next(error);
  }
}

export async function getWeather(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const lat = parseFloat(req.query.lat as string) || 15.4989;
    const lng = parseFloat(req.query.lng as string) || 73.8278;
    const locationName = (req.query.locationName as string) || undefined;

    const weather = await weatherService.getForecast(lat, lng, locationName);
    sendSuccess(res, weather);
  } catch (error) {
    next(error);
  }
}
