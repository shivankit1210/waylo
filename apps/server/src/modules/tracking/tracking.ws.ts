import { WebSocketServer, WebSocket } from 'ws';
import type { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { trackingService } from './tracking.service.js';
import { prisma } from '../../config/database.js';
import type { RealtimeClientEvent } from '@waylo/shared';

interface ExtWebSocket extends WebSocket {
  isAlive?: boolean;
  userId?: string;
  tripId?: string;
  displayName?: string;
}

export function initWebSocketServer(server: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server, path: '/ws/live' });

  logger.info('🛰️ Live Ride WebSocket Server initialized at /ws/live');

  wss.on('connection', (ws: ExtWebSocket) => {
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', async (raw) => {
      try {
        const text = raw.toString();
        const event: RealtimeClientEvent = JSON.parse(text);

        switch (event.type) {
          case 'JOIN_TRIP': {
            const { tripId, token } = event.payload;
            try {
              const decoded = jwt.verify(token, env.JWT_SECRET) as {
                id: string;
                displayName?: string;
              };

              let displayName = decoded.displayName || 'Rider';
              let avatarUrl: string | null = null;

              // Query user avatar from db if available
              try {
                const user = await prisma.user.findUnique({
                  where: { id: decoded.id },
                  select: { displayName: true, avatarUrl: true },
                });
                if (user) {
                  displayName = user.displayName;
                  avatarUrl = user.avatarUrl;
                }
              } catch {
                // Keep default
              }

              ws.userId = decoded.id;
              ws.tripId = tripId;
              ws.displayName = displayName;

              trackingService.registerRider(
                tripId,
                decoded.id,
                displayName,
                avatarUrl,
                ws
              );

              logger.info(`Rider ${displayName} joined live convoy for trip ${tripId}`);
            } catch (authErr) {
              logger.warn('WebSocket JOIN_TRIP token verification failed');
              ws.close(4001, 'Unauthorized');
            }
            break;
          }

          case 'UPDATE_LOCATION': {
            const { tripId, latitude, longitude, speedKmh, headingDeg, batteryPercent, altitude } =
              event.payload;

            if (ws.userId && ws.tripId === tripId) {
              trackingService.updateLocation(
                tripId,
                ws.userId,
                ws.displayName || 'Rider',
                null,
                {
                  latitude,
                  longitude,
                  speedKmh,
                  headingDeg,
                  batteryPercent,
                  altitude,
                }
              );
            }
            break;
          }

          case 'SEND_PING': {
            const { tripId, pingType, message, latitude, longitude } = event.payload;
            if (ws.userId && ws.tripId === tripId) {
              trackingService.sendCrewPing(
                tripId,
                ws.userId,
                ws.displayName || 'Rider',
                pingType,
                message,
                latitude,
                longitude
              );
            }
            break;
          }

          case 'LEAVE_TRIP': {
            if (ws.userId && ws.tripId) {
              trackingService.removeRider(ws.tripId, ws.userId);
              ws.tripId = undefined;
            }
            break;
          }
        }
      } catch (err) {
        logger.warn('Failed to parse WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      if (ws.tripId && ws.userId) {
        trackingService.removeRider(ws.tripId, ws.userId);
        logger.info(`Rider ${ws.displayName || ws.userId} disconnected from trip ${ws.tripId}`);
      }
    });

    ws.on('error', (err) => {
      logger.error('WebSocket connection error:', err);
    });
  });

  // Heartbeat ping interval every 30 seconds to clean stale sockets
  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      const extWs = client as ExtWebSocket;
      if (extWs.isAlive === false) {
        if (extWs.tripId && extWs.userId) {
          trackingService.removeRider(extWs.tripId, extWs.userId);
        }
        return extWs.terminate();
      }

      extWs.isAlive = false;
      extWs.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  return wss;
}
