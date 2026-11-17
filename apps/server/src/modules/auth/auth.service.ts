import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { RegisterInput, LoginInput, AuthTokens, User } from '@waylo/shared';
import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/errors.js';

export function sanitizeUser(user: {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  timezone: string;
  preferredCurrency: string;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    timezone: user.timezone,
    preferredCurrency: user.preferredCurrency as User['preferredCurrency'],
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function generateToken(payload: { id: string; email: string; displayName: string }): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export async function register(data: RegisterInput): Promise<AuthTokens> {
  const normalizedEmail = data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw AppError.conflict('An account with this email address already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      displayName: data.displayName.trim(),
      passwordHash,
    },
  });

  const accessToken = generateToken({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  });

  return {
    accessToken,
    user: sanitizeUser(user),
  };
}

export async function login(data: LoginInput): Promise<AuthTokens> {
  const normalizedEmail = data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const accessToken = generateToken({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  });

  return {
    accessToken,
    user: sanitizeUser(user),
  };
}

export async function getMe(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  return sanitizeUser(user);
}
