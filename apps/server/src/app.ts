import express, { type Express, Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { AppError } from './utils/errors.js';

import { authRoutes } from './modules/auth/auth.routes.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { tripRoutes } from './modules/trips/trips.routes.js';
import { memberRoutes } from './modules/members/members.routes.js';
import {
  tripInvitationRoutes,
  invitationRoutes,
} from './modules/invitations/invitations.routes.js';
import { itineraryRoutes } from './modules/itinerary/itinerary.routes.js';
import { packingRoutes } from './modules/packing/packing.routes.js';
import { expenseRoutes } from './modules/expenses/expenses.routes.js';
import { vehicleRoutes, userVehicleRoutes } from './modules/vehicles/vehicles.routes.js';
import { tripRouteRoutes, mapsRoutes } from './modules/maps/maps.routes.js';
import { accommodationRoutes } from './modules/accommodations/accommodations.routes.js';
import { documentRoutes } from './modules/documents/documents.routes.js';
import { aiRoutes } from './modules/ai/ai.routes.js';
import { trackingRoutes } from './modules/tracking/tracking.routes.js';
import { journalRoutes } from './modules/journal/journal.routes.js';

export const app: Express = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [env.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Rate limiter for authentication routes (100 req per 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests from this IP address, please try again after 15 minutes',
    },
  },
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

// API v1 Router
const v1Router = Router();

v1Router.use('/auth', authLimiter, authRoutes);
v1Router.use('/users', usersRoutes);
v1Router.use('/trips/:tripId/members', memberRoutes);
v1Router.use('/trips/:tripId/invitations', tripInvitationRoutes);
v1Router.use('/trips/:tripId/itinerary', itineraryRoutes);
v1Router.use('/trips/:tripId/packing', packingRoutes);
v1Router.use('/trips/:tripId/expenses', expenseRoutes);
v1Router.use('/trips/:tripId/vehicles', vehicleRoutes);
v1Router.use('/trips/:tripId/route', tripRouteRoutes);
v1Router.use('/trips/:tripId/accommodations', accommodationRoutes);
v1Router.use('/trips/:tripId/documents', documentRoutes);
v1Router.use('/trips/:tripId/tracking', trackingRoutes);
v1Router.use('/trips/:tripId/journal', journalRoutes);
v1Router.use('/maps', mapsRoutes);
v1Router.use('/vehicles', userVehicleRoutes);
v1Router.use('/ai', aiRoutes);
v1Router.use('/trips', tripRoutes);
v1Router.use('/invitations', invitationRoutes);

// Mount under /api/v1
app.use('/api/v1', v1Router);

// Unmatched route 404 handler
app.use('*', (req, res, next) => {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
});

// Global error handler
app.use(errorHandler);
