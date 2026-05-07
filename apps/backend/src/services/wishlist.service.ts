import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export async function addToWishlist(userId: string, projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || !project.isActive) {
    throw new AppError(404, 'Project not found');
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (existing) {
    throw new AppError(409, 'Project already in wishlist');
  }

  return prisma.wishlist.create({
    data: { userId, projectId },
    include: {
      project: {
        select: { id: true, title: true, price: true, category: true, thumbnailUrl: true, techStack: true },
      },
    },
  });
}

export async function removeFromWishlist(userId: string, projectId: string) {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (!existing) {
    throw new AppError(404, 'Project not in wishlist');
  }

  return prisma.wishlist.delete({
    where: { userId_projectId: { userId, projectId } },
  });
}

export async function getWishlist(userId: string) {
  const items = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          category: true,
          techStack: true,
          thumbnailUrl: true,
          isActive: true,
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return items
    .filter((item: typeof items[number]) => item.project.isActive)
    .map((item: typeof items[number]) => {
      const { reviews, ...project } = item.project;
      const ratings = reviews.map((r: { rating: number }) => r.rating);
      const averageRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;
      return {
        id: item.id,
        addedAt: item.createdAt,
        project: {
          ...project,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: reviews.length,
        },
      };
    });
}

export async function isInWishlist(userId: string, projectId: string) {
  const item = await prisma.wishlist.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });
  return !!item;
}
