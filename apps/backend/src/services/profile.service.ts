import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const [purchaseCount, totalSpent, reviewCount, wishlistCount, recentPurchases, recentReviews] = await Promise.all([
    prisma.purchase.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.purchase.aggregate({
      where: { userId, status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.review.count({ where: { userId } }),
    prisma.wishlist.count({ where: { userId } }),
    prisma.purchase.findMany({
      where: { userId, status: 'COMPLETED' },
      include: { project: { select: { id: true, title: true, category: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.review.findMany({
      where: { userId },
      include: { project: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return {
    user,
    stats: {
      totalPurchases: purchaseCount,
      totalSpent: Number(totalSpent._sum.amount || 0),
      reviewsWritten: reviewCount,
      wishlistCount,
    },
    recentActivity: [
      ...recentPurchases.map((p) => ({
        type: 'purchase' as const,
        id: p.id,
        projectId: p.project.id,
        projectTitle: p.project.title,
        date: p.createdAt,
        amount: Number(p.amount),
      })),
      ...recentReviews.map((r) => ({
        type: 'review' as const,
        id: r.id,
        projectId: r.project.id,
        projectTitle: r.project.title,
        date: r.createdAt,
        rating: r.rating,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10),
  };
}
