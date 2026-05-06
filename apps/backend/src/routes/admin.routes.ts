import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserRole, RequestStatus } from '@project-hub/shared';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { prisma } from '../config/database';
import * as requestService from '../services/request.service';
import * as messageService from '../services/message.service';

export const adminRouter = Router();

adminRouter.use(authenticate);
adminRouter.use(authorize(UserRole.ADMIN));

adminRouter.get(
  '/dashboard',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [totalRevenue, totalSales, totalUsers, totalProjects, recentTransactions] =
        await Promise.all([
          prisma.purchase.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true },
          }),
          prisma.purchase.count({ where: { status: 'COMPLETED' } }),
          prisma.user.count({ where: { role: { not: UserRole.ADMIN } } }),
          prisma.project.count({ where: { isActive: true } }),
          prisma.purchase.findMany({
            where: { status: 'COMPLETED' },
            include: {
              user: { select: { name: true } },
              project: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          }),
        ]);

      res.json({
        success: true,
        data: {
          totalRevenue: Number(totalRevenue._sum.amount || 0),
          totalSales,
          totalUsers,
          totalProjects,
          recentTransactions: recentTransactions.map(t => ({
            id: t.id,
            buyerName: t.user.name,
            projectTitle: t.project.title,
            amount: Number(t.amount),
            date: t.createdAt.toISOString(),
          })),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

adminRouter.get(
  '/users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: { role: { not: UserRole.ADMIN } },
          select: { id: true, name: true, email: true, role: true, createdAt: true },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where: { role: { not: UserRole.ADMIN } } }),
      ]);

      res.json({
        success: true,
        data: users,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      next(err);
    }
  }
);

adminRouter.get(
  '/requests',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await requestService.getAllRequests();
      res.json({ success: true, data: requests });
    } catch (err) {
      next(err);
    }
  }
);

const updateRequestSchema = z.object({
  body: z.object({
    status: z.nativeEnum(RequestStatus),
    adminNotes: z.string().max(2000).optional(),
  }),
});

adminRouter.put(
  '/requests/:id',
  validate(updateRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, adminNotes } = req.body;
      const request = await requestService.updateRequestStatus(req.params.id, status, adminNotes);
      res.json({ success: true, data: request });
    } catch (err) {
      next(err);
    }
  }
);

adminRouter.get(
  '/messages',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await messageService.getAllMessages();
      res.json({ success: true, data: messages });
    } catch (err) {
      next(err);
    }
  }
);

adminRouter.put(
  '/messages/:id/read',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await messageService.markAsRead(req.params.id);
      res.json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }
);

const replySchema = z.object({
  body: z.object({
    reply: z.string().min(1).max(5000),
  }),
});

adminRouter.put(
  '/messages/:id/reply',
  validate(replySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await messageService.replyToMessage(req.params.id, req.body.reply);
      res.json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }
);

adminRouter.get(
  '/transactions',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const skip = (page - 1) * limit;

      const [transactions, total] = await Promise.all([
        prisma.purchase.findMany({
          include: {
            user: { select: { name: true, email: true } },
            project: { select: { title: true } },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.purchase.count(),
      ]);

      res.json({
        success: true,
        data: transactions.map(t => ({
          id: t.id,
          buyerName: t.user.name,
          buyerEmail: t.user.email,
          projectTitle: t.project.title,
          amount: Number(t.amount),
          status: t.status,
          paymentId: t.razorpayPaymentId,
          date: t.createdAt.toISOString(),
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      next(err);
    }
  }
);
