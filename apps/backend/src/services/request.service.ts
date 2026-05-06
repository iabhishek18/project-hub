import { Prisma } from '@prisma/client';
import { RequestStatus } from '@project-hub/shared';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export async function createRequest(
  userId: string,
  requirementDetails: string,
  budget?: number,
  deadline?: Date
) {
  return prisma.request.create({
    data: {
      userId,
      requirementDetails,
      budget: budget ? new Prisma.Decimal(budget) : null,
      deadline,
    },
  });
}

export async function getUserRequests(userId: string) {
  return prisma.request.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllRequests() {
  return prisma.request.findMany({
    include: { user: { select: { name: true, email: true, role: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus,
  adminNotes?: string
) {
  const request = await prisma.request.findUnique({ where: { id: requestId } });
  if (!request) {
    throw new AppError(404, 'Request not found');
  }

  return prisma.request.update({
    where: { id: requestId },
    data: { status, adminNotes },
  });
}
