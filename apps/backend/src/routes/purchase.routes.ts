import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import * as purchaseService from '../services/purchase.service';

export const purchaseRouter = Router();

const createOrderSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
  }),
});

const verifyPaymentSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().min(1),
    razorpayPaymentId: z.string().min(1),
    razorpaySignature: z.string().min(1),
  }),
});

purchaseRouter.post(
  '/create-order',
  authenticate,
  validate(createOrderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await purchaseService.createOrder(req.user!.userId, req.body.projectId);
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }
);

purchaseRouter.post(
  '/verify',
  authenticate,
  validate(verifyPaymentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
      const purchase = await purchaseService.verifyPayment(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );
      res.json({ success: true, data: purchase });
    } catch (err) {
      next(err);
    }
  }
);

purchaseRouter.get(
  '/download/:projectId',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await purchaseService.getDownloadUrl(req.user!.userId, req.params.projectId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

purchaseRouter.get(
  '/my-purchases',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const purchases = await purchaseService.getUserPurchases(req.user!.userId);
      res.json({ success: true, data: purchases });
    } catch (err) {
      next(err);
    }
  }
);
