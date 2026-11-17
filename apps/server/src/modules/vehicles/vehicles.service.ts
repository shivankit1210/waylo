import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  CreateFuelLogInput,
  CreateInspectionInput,
  FuelLog as SharedFuelLog,
} from '@waylo/shared';

export class VehiclesService {
  /**
   * List vehicles for a trip or for a user
   */
  async listVehicles(tripId?: string, userId?: string) {
    const whereClause: { tripId?: string; userId?: string } = {};
    if (tripId) whereClause.tripId = tripId;
    else if (userId) whereClause.userId = userId;

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      include: {
        fuelLogs: {
          orderBy: { odometer: 'desc' },
          take: 5,
        },
        inspections: {
          orderBy: { inspectedAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return vehicles;
  }

  /**
   * Get single vehicle details
   */
  async getVehicle(vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        fuelLogs: {
          orderBy: { odometer: 'desc' },
        },
        inspections: {
          orderBy: { inspectedAt: 'desc' },
        },
      },
    });

    if (!vehicle) {
      throw AppError.notFound('Vehicle not found');
    }

    return vehicle;
  }

  /**
   * Create vehicle profile
   */
  async createVehicle(userId: string, data: CreateVehicleInput, tripIdParam?: string) {
    const tripId = tripIdParam || data.tripId || null;

    const vehicle = await prisma.vehicle.create({
      data: {
        userId,
        tripId,
        name: data.name,
        type: data.type || 'CAR',
        make: data.make || null,
        model: data.model || null,
        year: data.year || null,
        registrationNumber: data.registrationNumber || null,
        fuelType: data.fuelType || 'PETROL',
        tankCapacityLiters: data.tankCapacityLiters || null,
        initialOdometer: data.initialOdometer || null,
        currentOdometer: data.currentOdometer || data.initialOdometer || null,
      },
      include: {
        fuelLogs: true,
        inspections: true,
      },
    });

    return vehicle;
  }

  /**
   * Update vehicle profile
   */
  async updateVehicle(vehicleId: string, data: UpdateVehicleInput) {
    const existing = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!existing) {
      throw AppError.notFound('Vehicle not found');
    }

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        name: data.name ?? undefined,
        type: data.type ?? undefined,
        make: data.make !== undefined ? data.make : undefined,
        model: data.model !== undefined ? data.model : undefined,
        year: data.year !== undefined ? data.year : undefined,
        registrationNumber: data.registrationNumber !== undefined ? data.registrationNumber : undefined,
        fuelType: data.fuelType ?? undefined,
        tankCapacityLiters: data.tankCapacityLiters !== undefined ? data.tankCapacityLiters : undefined,
        initialOdometer: data.initialOdometer !== undefined ? data.initialOdometer : undefined,
        currentOdometer: data.currentOdometer !== undefined ? data.currentOdometer : undefined,
        tripId: data.tripId !== undefined ? data.tripId : undefined,
      },
    });
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(vehicleId: string) {
    const existing = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!existing) {
      throw AppError.notFound('Vehicle not found');
    }

    await prisma.vehicle.delete({ where: { id: vehicleId } });
    return { success: true, message: 'Vehicle deleted successfully' };
  }

  /**
   * Add a fuel log with automatic odometer update and fuel economy calculation
   */
  async addFuelLog(vehicleId: string, tripId: string | null, data: CreateFuelLogInput) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      throw AppError.notFound('Vehicle not found');
    }

    const log = await prisma.fuelLog.create({
      data: {
        vehicleId,
        tripId: tripId || vehicle.tripId || null,
        date: data.date ? new Date(data.date) : new Date(),
        odometer: data.odometer,
        litersOrKwh: data.litersOrKwh,
        cost: data.cost,
        currency: data.currency || 'INR',
        isFullTank: data.isFullTank ?? true,
        fuelPricePerUnit: data.fuelPricePerUnit || null,
        stationLocation: data.stationLocation || null,
        notes: data.notes || null,
      },
    });

    // Update vehicle's current odometer if new reading is higher
    if (!vehicle.currentOdometer || data.odometer > vehicle.currentOdometer) {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { currentOdometer: data.odometer },
      });
    }

    return log;
  }

  /**
   * List all fuel logs for a vehicle and compute efficiency for consecutive full tanks
   */
  async listFuelLogs(vehicleId: string): Promise<SharedFuelLog[]> {
    const logs = await prisma.fuelLog.findMany({
      where: { vehicleId },
      orderBy: { odometer: 'asc' },
    });

    const results: SharedFuelLog[] = [];
    let previousFullTankOdometer: number | null = null;

    for (const log of logs) {
      let efficiency: number | null = null;

      if (log.isFullTank && previousFullTankOdometer !== null && log.litersOrKwh > 0) {
        const distance = log.odometer - previousFullTankOdometer;
        if (distance > 0) {
          efficiency = Number((distance / log.litersOrKwh).toFixed(2));
        }
      }

      if (log.isFullTank) {
        previousFullTankOdometer = log.odometer;
      }

      results.push({
        id: log.id,
        vehicleId: log.vehicleId,
        tripId: log.tripId,
        date: log.date.toISOString(),
        odometer: log.odometer,
        litersOrKwh: log.litersOrKwh,
        cost: log.cost,
        currency: log.currency as any,
        isFullTank: log.isFullTank,
        fuelPricePerUnit: log.fuelPricePerUnit,
        stationLocation: log.stationLocation,
        notes: log.notes,
        fuelEfficiencyKmPerUnit: efficiency,
        createdAt: log.createdAt.toISOString(),
        updatedAt: log.updatedAt.toISOString(),
      });
    }

    // Return in reverse chronological order for UI display
    return results.reverse();
  }

  /**
   * Record pre-trip or mid-trip vehicle inspection checklist
   */
  async addInspection(vehicleId: string, tripId: string | null, data: CreateInspectionInput) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      throw AppError.notFound('Vehicle not found');
    }

    const inspection = await prisma.vehicleInspection.create({
      data: {
        vehicleId,
        tripId: tripId || vehicle.tripId || null,
        status: data.status || 'PASSED',
        checklist: data.checklist,
        notes: data.notes || null,
        odometer: data.odometer || null,
      },
    });

    if (data.odometer && (!vehicle.currentOdometer || data.odometer > vehicle.currentOdometer)) {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { currentOdometer: data.odometer },
      });
    }

    return inspection;
  }

  /**
   * List inspection checklists for a vehicle
   */
  async listInspections(vehicleId: string) {
    return prisma.vehicleInspection.findMany({
      where: { vehicleId },
      orderBy: { inspectedAt: 'desc' },
    });
  }
}

export const vehiclesService = new VehiclesService();
