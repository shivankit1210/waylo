import {
  RideSessionStatus,
  PingType,
  type RiderLocation,
  type RideSession,
  type CrewPingAlert,
  type RealtimeServerEvent,
} from '@waylo/shared';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import type { WebSocket } from 'ws';

export interface ConnectedRider {
  ws?: WebSocket;
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  location?: RiderLocation;
  lastHeartbeat: number;
}

export class TrackingService {
  // In-memory Trip Room Registry: tripId -> (userId -> ConnectedRider)
  private tripRooms = new Map<string, Map<string, ConnectedRider>>();

  // Active Ride Sessions: tripId -> RideSession
  private activeSessions = new Map<string, RideSession>();

  // Recent Crew Pings: tripId -> CrewPingAlert[]
  private recentPings = new Map<string, CrewPingAlert[]>();

  /**
   * Start or resume a live ride tracking session
   */
  async startSession(tripId: string, name: string): Promise<RideSession> {
    const existing = this.activeSessions.get(tripId);
    if (existing && existing.status === RideSessionStatus.ACTIVE) {
      return existing;
    }

    const session: RideSession = {
      id: `session-${Date.now()}`,
      tripId,
      name,
      status: RideSessionStatus.ACTIVE,
      startedAt: new Date().toISOString(),
      activeRidersCount: this.getRoomRiders(tripId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.activeSessions.set(tripId, session);

    // Broadcast session update to room
    this.broadcastToTrip(tripId, {
      type: 'SESSION_STATUS_CHANGED',
      payload: { session },
    });

    return session;
  }

  /**
   * End an active ride session
   */
  async endSession(tripId: string): Promise<RideSession | null> {
    const session = this.activeSessions.get(tripId);
    if (!session) return null;

    session.status = RideSessionStatus.ENDED;
    session.endedAt = new Date().toISOString();
    session.updatedAt = new Date().toISOString();

    this.broadcastToTrip(tripId, {
      type: 'SESSION_STATUS_CHANGED',
      payload: { session },
    });

    return session;
  }

  /**
   * Get session status for trip
   */
  getSession(tripId: string): RideSession {
    const session = this.activeSessions.get(tripId);
    if (session) {
      session.activeRidersCount = this.getRoomRiders(tripId).length;
      return session;
    }

    // Default inactive session
    return {
      id: `idle-${tripId}`,
      tripId,
      name: 'Convoy Standby',
      status: RideSessionStatus.PAUSED,
      startedAt: new Date().toISOString(),
      activeRidersCount: this.getRoomRiders(tripId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Register rider in trip room
   */
  registerRider(
    tripId: string,
    userId: string,
    displayName: string,
    avatarUrl?: string | null,
    ws?: WebSocket
  ) {
    if (!this.tripRooms.has(tripId)) {
      this.tripRooms.set(tripId, new Map());
    }

    const room = this.tripRooms.get(tripId)!;
    const existing = room.get(userId);

    const rider: ConnectedRider = {
      ws: ws || existing?.ws,
      userId,
      displayName,
      avatarUrl: avatarUrl || existing?.avatarUrl || null,
      location: existing?.location,
      lastHeartbeat: Date.now(),
    };

    room.set(userId, rider);

    // Notify room of rider join
    this.broadcastToTrip(
      tripId,
      {
        type: 'RIDER_JOINED',
        payload: { userId, displayName },
      },
      userId
    );

    // Send snapshot to newly joined rider
    if (ws && ws.readyState === ws.OPEN) {
      const snapshot: RealtimeServerEvent = {
        type: 'RIDER_LOCATIONS_SNAPSHOT',
        payload: { riders: this.getRoomRiders(tripId) },
      };
      ws.send(JSON.stringify(snapshot));
    }
  }

  /**
   * Remove rider from trip room
   */
  removeRider(tripId: string, userId: string) {
    const room = this.tripRooms.get(tripId);
    if (!room) return;

    room.delete(userId);
    if (room.size === 0) {
      this.tripRooms.delete(tripId);
    }

    this.broadcastToTrip(tripId, {
      type: 'RIDER_LEFT',
      payload: { userId },
    });
  }

  /**
   * Update rider live coordinates and broadcast
   */
  updateLocation(
    tripId: string,
    userId: string,
    displayName: string,
    avatarUrl: string | null | undefined,
    coords: {
      latitude: number;
      longitude: number;
      altitude?: number | null;
      speedKmh?: number | null;
      headingDeg?: number | null;
      batteryPercent?: number | null;
    }
  ): RiderLocation {
    if (!this.tripRooms.has(tripId)) {
      this.tripRooms.set(tripId, new Map());
    }

    const room = this.tripRooms.get(tripId)!;
    let rider = room.get(userId);

    if (!rider) {
      rider = {
        userId,
        displayName,
        avatarUrl,
        lastHeartbeat: Date.now(),
      };
      room.set(userId, rider);
    }

    const isMoving = coords.speedKmh ? coords.speedKmh > 3 : false;

    const location: RiderLocation = {
      userId,
      displayName,
      avatarUrl: avatarUrl || rider.avatarUrl,
      latitude: coords.latitude,
      longitude: coords.longitude,
      altitude: coords.altitude || null,
      speedKmh: coords.speedKmh || null,
      headingDeg: coords.headingDeg || null,
      batteryPercent: coords.batteryPercent ?? null,
      isMoving,
      lastPingAt: new Date().toISOString(),
    };

    rider.location = location;
    rider.lastHeartbeat = Date.now();

    // Broadcast location update
    this.broadcastToTrip(tripId, {
      type: 'RIDER_LOCATION_UPDATED',
      payload: { rider: location },
    });

    return location;
  }

  /**
   * Get all active riders in room with their locations
   */
  getRoomRiders(tripId: string): RiderLocation[] {
    const room = this.tripRooms.get(tripId);
    if (!room) return [];

    const list: RiderLocation[] = [];
    room.forEach((r) => {
      if (r.location) {
        list.push(r.location);
      } else {
        // Placeholder until first GPS fix
        list.push({
          userId: r.userId,
          displayName: r.displayName,
          avatarUrl: r.avatarUrl,
          latitude: 15.2993, // default Goa if unknown
          longitude: 74.124,
          isMoving: false,
          lastPingAt: new Date(r.lastHeartbeat).toISOString(),
        });
      }
    });

    return list;
  }

  /**
   * Broadcast crew alert / emergency ping
   */
  sendCrewPing(
    tripId: string,
    userId: string,
    senderName: string,
    pingType: PingType,
    message?: string | null,
    latitude?: number | null,
    longitude?: number | null
  ): CrewPingAlert {
    const alert: CrewPingAlert = {
      id: `ping-${Date.now()}`,
      tripId,
      userId,
      senderName,
      pingType,
      message: message || this.getDefaultPingMessage(pingType),
      latitude: latitude || null,
      longitude: longitude || null,
      createdAt: new Date().toISOString(),
    };

    if (!this.recentPings.has(tripId)) {
      this.recentPings.set(tripId, []);
    }

    const pings = this.recentPings.get(tripId)!;
    pings.unshift(alert);
    if (pings.length > 50) pings.pop();

    this.broadcastToTrip(tripId, {
      type: 'CREW_PING',
      payload: { alert },
    });

    return alert;
  }

  /**
   * Get recent crew alerts
   */
  getRecentPings(tripId: string): CrewPingAlert[] {
    return this.recentPings.get(tripId) || [];
  }

  /**
   * Broadcast real-time message to all active WebSocket clients in a trip room
   */
  broadcastToTrip(tripId: string, event: RealtimeServerEvent, excludeUserId?: string) {
    const room = this.tripRooms.get(tripId);
    if (!room) return;

    const data = JSON.stringify(event);
    room.forEach((rider, uId) => {
      if (excludeUserId && uId === excludeUserId) return;
      if (rider.ws && rider.ws.readyState === rider.ws.OPEN) {
        try {
          rider.ws.send(data);
        } catch (err) {
          logger.warn(`Failed to send event to user ${uId}:`, err);
        }
      }
    });
  }

  private getDefaultPingMessage(type: PingType): string {
    switch (type) {
      case PingType.REGROUP:
        return 'Convoy Regroup requested. Please pull over safely at the next scenic turnout.';
      case PingType.MECHANICAL_STOP:
        return 'Mechanical stop / tyre puncture check needed.';
      case PingType.FUEL_STOP:
        return 'Refueling required at the next petrol station / charging plaza.';
      case PingType.PHOTO_STOP:
        return 'Epic scenic viewpoint! Stopping 5 mins for photos.';
      case PingType.SOS_EMERGENCY:
        return '🚨 EMERGENCY SOS BEACON ACTIVATED. Crew assistance requested immediately.';
      default:
        return 'Crew alert from rider.';
    }
  }
}

export const trackingService = new TrackingService();
