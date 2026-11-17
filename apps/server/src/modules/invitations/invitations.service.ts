import crypto from 'crypto';
import {
  InvitationStatus,
  TripRole,
  type CreateInvitationInput,
  type TripInvitation,
} from '@waylo/shared';
import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';

interface RawInvitation {
  id: string;
  tripId: string;
  invitedEmail: string | null;
  inviteCode: string;
  role: string;
  status: string;
  expiresAt: Date;
  invitedById: string;
  createdAt: Date;
  updatedAt: Date;
}

function formatInvitation(inv: RawInvitation): TripInvitation {
  return {
    id: inv.id,
    tripId: inv.tripId,
    invitedEmail: inv.invitedEmail,
    inviteCode: inv.inviteCode,
    role: inv.role as TripRole,
    status: inv.status as InvitationStatus,
    expiresAt: inv.expiresAt.toISOString(),
    invitedBy: inv.invitedById,
    createdAt: inv.createdAt.toISOString(),
    updatedAt: inv.updatedAt.toISOString(),
  };
}

export async function createInvitation(
  tripId: string,
  invitedById: string,
  data: CreateInvitationInput
): Promise<TripInvitation> {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    throw AppError.notFound('Trip not found');
  }

  const hours = data.expiresInHours ?? 48;
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
  const inviteCode = crypto.randomBytes(8).toString('hex');

  const invitation = await prisma.tripInvitation.create({
    data: {
      tripId,
      invitedById,
      invitedEmail: data.invitedEmail ? data.invitedEmail.toLowerCase().trim() : null,
      inviteCode,
      role: data.role ?? TripRole.MEMBER,
      status: InvitationStatus.PENDING,
      expiresAt,
    },
  });

  return formatInvitation(invitation);
}

export async function listInvitations(tripId: string): Promise<TripInvitation[]> {
  const invitations = await prisma.tripInvitation.findMany({
    where: { tripId },
    orderBy: { createdAt: 'desc' },
  });

  return invitations.map(formatInvitation);
}

export async function revokeInvitation(
  tripId: string,
  invitationId: string
): Promise<void> {
  const invitation = await prisma.tripInvitation.findFirst({
    where: { id: invitationId, tripId },
  });

  if (!invitation) {
    throw AppError.notFound('Invitation not found');
  }

  await prisma.tripInvitation.update({
    where: { id: invitationId },
    data: { status: InvitationStatus.REVOKED },
  });
}

export async function acceptInvitation(
  userId: string,
  inviteCode: string
): Promise<{ tripId: string; memberId: string; role: TripRole }> {
  const invitation = await prisma.tripInvitation.findUnique({
    where: { inviteCode },
    include: {
      trip: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!invitation) {
    throw AppError.notFound('Invalid invitation link');
  }

  if (invitation.status !== InvitationStatus.PENDING) {
    throw AppError.badRequest(
      `This invitation has already been ${invitation.status.toLowerCase()}`
    );
  }

  const now = new Date();
  if (now > invitation.expiresAt) {
    await prisma.tripInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.EXPIRED },
    });
    throw AppError.badRequest('This invitation link has expired');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  if (
    invitation.invitedEmail &&
    invitation.invitedEmail.toLowerCase() !== user.email.toLowerCase()
  ) {
    throw AppError.forbidden(
      `This invitation was addressed specifically to ${invitation.invitedEmail}`
    );
  }

  const existingMember = await prisma.tripMember.findUnique({
    where: {
      tripId_userId: {
        tripId: invitation.tripId,
        userId,
      },
    },
  });

  if (existingMember) {
    throw AppError.conflict('You are already a member of this trip');
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.tripInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED },
    });

    const member = await tx.tripMember.create({
      data: {
        tripId: invitation.tripId,
        userId,
        role: invitation.role,
      },
    });

    return {
      tripId: invitation.tripId,
      memberId: member.id,
      role: member.role as TripRole,
    };
  });

  return result;
}
