import { Router } from 'express';
import {
  TripRole,
  createVehicleSchema,
  updateVehicleSchema,
  createFuelLogSchema,
  createInspectionSchema,
} from '@waylo/shared';
import * as vehiclesController from './vehicles.controller.js';
import { authenticate, requireTripMember } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';

// ─── Trip-Scoped Vehicle Routes (/trips/:tripId/vehicles) ───
export const vehicleRoutes = Router({ mergeParams: true });

vehicleRoutes.use(authenticate);

vehicleRoutes.get(
  '/',
  requireTripMember(),
  vehiclesController.getVehicles
);

vehicleRoutes.post(
  '/',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(createVehicleSchema),
  vehiclesController.createVehicle
);

vehicleRoutes.get(
  '/:vehicleId',
  requireTripMember(),
  vehiclesController.getVehicle
);

vehicleRoutes.put(
  '/:vehicleId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(updateVehicleSchema),
  vehiclesController.updateVehicle
);

vehicleRoutes.delete(
  '/:vehicleId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER]),
  vehiclesController.deleteVehicle
);

vehicleRoutes.get(
  '/:vehicleId/fuel-logs',
  requireTripMember(),
  vehiclesController.getFuelLogs
);

vehicleRoutes.post(
  '/:vehicleId/fuel-logs',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(createFuelLogSchema),
  vehiclesController.addFuelLog
);

vehicleRoutes.get(
  '/:vehicleId/inspections',
  requireTripMember(),
  vehiclesController.getInspections
);

vehicleRoutes.post(
  '/:vehicleId/inspections',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(createInspectionSchema),
  vehiclesController.addInspection
);

// ─── Global User Vehicle Routes (/vehicles) ─────────────────
export const userVehicleRoutes = Router();

userVehicleRoutes.use(authenticate);

userVehicleRoutes.get('/', vehiclesController.getVehicles);
userVehicleRoutes.post('/', validateBody(createVehicleSchema), vehiclesController.createVehicle);
userVehicleRoutes.get('/:vehicleId', vehiclesController.getVehicle);
userVehicleRoutes.put('/:vehicleId', validateBody(updateVehicleSchema), vehiclesController.updateVehicle);
userVehicleRoutes.delete('/:vehicleId', vehiclesController.deleteVehicle);
userVehicleRoutes.get('/:vehicleId/fuel-logs', vehiclesController.getFuelLogs);
userVehicleRoutes.post('/:vehicleId/fuel-logs', validateBody(createFuelLogSchema), vehiclesController.addFuelLog);
userVehicleRoutes.get('/:vehicleId/inspections', vehiclesController.getInspections);
userVehicleRoutes.post('/:vehicleId/inspections', validateBody(createInspectionSchema), vehiclesController.addInspection);
