import { Router } from 'express';
import * as mapsController from './maps.controller.js';
import { authenticate, requireTripMember } from '../../middlewares/auth.js';

// ─── Trip-Scoped Route & Map Endpoints (/trips/:tripId/route)
export const tripRouteRoutes = Router({ mergeParams: true });

tripRouteRoutes.use(authenticate);

tripRouteRoutes.get('/', requireTripMember(), mapsController.getTripRoute);

// ─── General Weather & Directions Routes ─────────────────────
export const mapsRoutes = Router();

mapsRoutes.use(authenticate);

mapsRoutes.post('/directions', mapsController.getDirections);
mapsRoutes.get('/weather/forecast', mapsController.getWeather);
