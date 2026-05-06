import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export async function createReview(
  userId: string,
  projectId: string,
  rating: number,
  comment?: string
) {
  const purchase = await prisma.purchase.findFirst({
    where: { userId, projectId, status: 'COMPLETED' },
  });

  if (!purchase) {
    throw new AppError(403, 'You must purchase this project before reviewing');
  }

  return prisma.review.upsert({
    where: { userId_projectId: { userId, projectId } },
    update: { rating, comment },
    create: { userId, projectId, rating, comment },
  });
}

export async function getProjectReviews(
  projectId: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { projectId },
      include: { user: { select: { name: true, role: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count({ where: { projectId } }),
  ]);

  return {
    reviews,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function deleteReview(reviewId: string, userId: string) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  if (review.userId !== userId) {
    throw new AppError(403, 'You can only delete your own reviews');
  }

  return prisma.review.delete({ where: { id: reviewId } });
}
