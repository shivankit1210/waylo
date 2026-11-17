import type { Request, Response, NextFunction } from 'express';
import { vehiclesService } from './vehicles.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export async function getVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tripId } = req.params;
    const userId = req.user!.id;
    const vehicles = await vehiclesService.listVehicles(tripId, tripId ? undefined : userId);
    sendSuccess(res, vehicles);
  } catch (error) {
    next(error);
  }
}

export async function getVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { vehicleId } = req.params;
    const vehicle = await vehiclesService.getVehicle(vehicleId);
    sendSuccess(res, vehicle);
  } catch (error) {
    next(error);
  }
}

export async function createVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tripId } = req.params;
    const userId = req.user!.id;
    const vehicle = await vehiclesService.createVehicle(userId, req.body, tripId);
    sendSuccess(res, vehicle, 'Vehicle created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { vehicleId } = req.params;
    const vehicle = await vehiclesService.updateVehicle(vehicleId, req.body);
    sendSuccess(res, vehicle, 'Vehicle updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { vehicleId } = req.params;
    const result = await vehiclesService.deleteVehicle(vehicleId);
    sendSuccess(res, result, 'Vehicle deleted successfully');
  } catch (error) {
    next(error);
  }
}

export async function getFuelLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { vehicleId } = req.params;
    const logs = await vehiclesService.listFuelLogs(vehicleId);
    sendSuccess(res, logs);
  } catch (error) {
    next(error);
  }
}

export async function addFuelLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { vehicleId, tripId } = req.params;
    const log = await vehiclesService.addFuelLog(vehicleId, tripId || null, req.body);
    sendSuccess(res, log, 'Fuel log recorded successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function getInspections(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { vehicleId } = req.params;
    const inspections = await vehiclesService.listInspections(vehicleId);
    sendSuccess(res, inspections);
  } catch (error) {
    next(error);
  }
}

export async function addInspection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { vehicleId, tripId } = req.params;
    const inspection = await vehiclesService.addInspection(vehicleId, tripId || null, req.body);
    sendSuccess(res, inspection, 'Vehicle inspection saved successfully', 201);
  } catch (error) {
    next(error);
  }
}
