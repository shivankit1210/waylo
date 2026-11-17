import http from 'http';
import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';
import { logger } from './utils/logger.js';
import { initWebSocketServer } from './modules/tracking/tracking.ws.js';

const server = http.createServer(app);
const wss = initWebSocketServer(server);

server.listen(env.PORT, () => {
  logger.info('===============================================');
  logger.info('🚀 Waylo API Server started successfully!');
  logger.info(`📡 Port:        ${env.PORT}`);
  logger.info(`🌐 Environment: ${env.NODE_ENV}`);
  logger.info(`🔗 Health:      http://localhost:${env.PORT}/health`);
  logger.info(`📍 API v1:      http://localhost:${env.PORT}/api/v1`);
  logger.info(`🛰️ WebSocket:   ws://localhost:${env.PORT}/ws/live`);
  logger.info('===============================================');
});

async function handleShutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  wss.close(() => {
    logger.info('WebSocket server closed.');
  });

  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await prisma.$disconnect();
      logger.info('Database connection closed.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during database disconnect:', err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error('Graceful shutdown timeout exceeded. Forcing shutdown.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => {
  void handleShutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void handleShutdown('SIGINT');
});
