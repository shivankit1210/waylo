import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TripRole } from '@waylo/shared';
import { env } from '../config/env.js';
import { prisma } from '../config/database.js';
import { AppError } from '../utils/errors.js';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export interface TripMemberContext {
  id: string;
  tripId: string;
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      tripMember?: TripMemberContext;
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
  displayName: string;
  iat?: number;
  exp?: number;
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.cookies && typeof req.cookies.accessToken === 'string') {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw AppError.unauthorized('Authentication required');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (!decoded || !decoded.id) {
      throw AppError.unauthorized('Invalid token payload');
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      displayName: decoded.displayName,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      next(AppError.unauthorized('Invalid or expired token'));
      return;
    }
    next(err);
  }
}

export function requireTripMember(allowedRoles?: (TripRole | string)[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw AppError.unauthorized('Authentication required');
      }

      const tripId = req.params.tripId;
      if (!tripId) {
        throw AppError.badRequest('Trip ID parameter is required');
      }

      // Check if trip exists
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        select: { id: true, ownerId: true },
      });

      if (!trip) {
        throw AppError.notFound('Trip not found');
      }

      // Check if user is a member
      const member = await prisma.tripMember.findUnique({
        where: {
          tripId_userId: {
            tripId,
            userId: req.user.id,
          },
        },
      });

      if (!member) {
        throw AppError.forbidden('You are not a member of this trip');
      }

      // Check role permissions if restricted
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(member.role)) {
          throw AppError.forbidden('You do not have permission to perform this action');
        }
      }

      req.tripMember = member;
      next();
    } catch (err) {
      next(err);
    }
  };
}
