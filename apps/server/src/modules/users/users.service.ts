import type { UpdateProfileInput, UserProfile, SupportedCurrency } from '@waylo/shared';
import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';

interface RawDbUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  timezone: string;
  preferredCurrency: string;
  bio: string | null;
  budgetStyle: string | null;
  preferredPace: string | null;
  accommodationType: string | null;
  interests: string[];
  dietaryPreferences: string[];
  createdAt: Date;
  updatedAt: Date;
}

function formatUserProfile(user: RawDbUser): UserProfile {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    timezone: user.timezone,
    preferredCurrency: user.preferredCurrency as SupportedCurrency,
    bio: user.bio,
    budgetStyle: user.budgetStyle,
    preferredPace: user.preferredPace,
    accommodationType: user.accommodationType,
    interests: user.interests ?? [],
    dietaryPreferences: user.dietaryPreferences ?? [],
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function getProfile(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw AppError.notFound('User profile not found');
  }

  return formatUserProfile(user);
}

export async function updateProfile(
  userId: string,
  data: UpdateProfileInput
): Promise<UserProfile> {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existing) {
    throw AppError.notFound('User profile not found');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.displayName !== undefined && { displayName: data.displayName }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      ...(data.timezone !== undefined && { timezone: data.timezone }),
      ...(data.preferredCurrency !== undefined && { preferredCurrency: data.preferredCurrency }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.budgetStyle !== undefined && { budgetStyle: data.budgetStyle }),
      ...(data.preferredPace !== undefined && { preferredPace: data.preferredPace }),
      ...(data.accommodationType !== undefined && { accommodationType: data.accommodationType }),
      ...(data.interests !== undefined && { interests: data.interests }),
      ...(data.dietaryPreferences !== undefined && { dietaryPreferences: data.dietaryPreferences }),
    },
  });

  return formatUserProfile(updated);
}
