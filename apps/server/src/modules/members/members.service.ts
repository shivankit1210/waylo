import { TripRole, type TripMemberSummary } from '@waylo/shared';
import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';

interface RawMemberWithUser {
  id: string;
  userId: string;
  role: string;
  joinedAt: Date;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    email: string;
  };
}

function formatMemberSummary(member: RawMemberWithUser): TripMemberSummary {
  return {
    id: member.id,
    userId: member.userId,
    role: member.role as TripRole,
    user: {
      id: member.user.id,
      displayName: member.user.displayName,
      avatarUrl: member.user.avatarUrl,
      email: member.user.email,
    },
  };
}

export async function listMembers(tripId: string): Promise<TripMemberSummary[]> {
  const members = await prisma.tripMember.findMany({
    where: { tripId },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
          email: true,
        },
      },
    },
    orderBy: { joinedAt: 'asc' },
  });

  return members.map(formatMemberSummary);
}

export async function addMember(
  tripId: string,
  email: string,
  role: TripRole = TripRole.MEMBER
): Promise<TripMemberSummary> {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw AppError.notFound(`No user found with email '${normalizedEmail}'`);
  }

  const existing = await prisma.tripMember.findUnique({
    where: {
      tripId_userId: {
        tripId,
        userId: user.id,
      },
    },
  });

  if (existing) {
    throw AppError.conflict('User is already a member of this trip');
  }

  const newMember = await prisma.tripMember.create({
    data: {
      tripId,
      userId: user.id,
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
          email: true,
        },
      },
    },
  });

  return formatMemberSummary(newMember);
}

export async function updateMemberRole(
  tripId: string,
  memberId: string,
  newRole: TripRole
): Promise<TripMemberSummary> {
  const member = await prisma.tripMember.findFirst({
    where: { id: memberId, tripId },
    include: {
      trip: {
        select: {
          ownerId: true,
        },
      },
      user: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
          email: true,
        },
      },
    },
  });

  if (!member) {
    throw AppError.notFound('Trip member not found');
  }

  if (member.userId === member.trip.ownerId && newRole !== TripRole.OWNER) {
    throw AppError.badRequest('Cannot change the role of the trip owner');
  }

  const updatedMember = await prisma.tripMember.update({
    where: { id: memberId },
    data: { role: newRole },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
          email: true,
        },
      },
    },
  });

  return formatMemberSummary(updatedMember);
}

export async function removeMember(
  tripId: string,
  memberId: string,
  currentUserId: string
): Promise<void> {
  const member = await prisma.tripMember.findFirst({
    where: { id: memberId, tripId },
    include: {
      trip: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  if (!member) {
    throw AppError.notFound('Trip member not found');
  }

  const isTripOwner = member.trip.ownerId === currentUserId;
  const isSelf = member.userId === currentUserId;

  if (!isTripOwner && !isSelf) {
    throw AppError.forbidden('You can only remove yourself or members from trips you own');
  }

  if (member.userId === member.trip.ownerId) {
    throw AppError.badRequest('The trip owner cannot leave or be removed from the trip');
  }

  await prisma.tripMember.delete({
    where: { id: memberId },
  });
}
