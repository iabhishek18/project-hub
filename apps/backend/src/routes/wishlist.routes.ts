import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import * as wishlistService from '../services/wishlist.service';

export const wishlistRouter = Router();

const projectIdSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
  }),
});

const removeSchema = z.object({
  params: z.object({
    projectId: z.string().uuid(),
  }),
});

wishlistRouter.get(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await wishlistService.getWishlist(req.user!.userId);
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }
);

wishlistRouter.post(
  '/',
  authenticate,
  validate(projectIdSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await wishlistService.addToWishlist(req.user!.userId, req.body.projectId);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

wishlistRouter.delete(
  '/:projectId',
  authenticate,
  validate(removeSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await wishlistService.removeFromWishlist(req.user!.userId, req.params.projectId);
      res.json({ success: true, message: 'Removed from wishlist' });
    } catch (err) {
      next(err);
    }
  }
);

wishlistRouter.get(
  '/check/:projectId',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isWishlisted = await wishlistService.isInWishlist(req.user!.userId, req.params.projectId);
      res.json({ success: true, data: { isWishlisted } });
    } catch (err) {
      next(err);
    }
  }
);
