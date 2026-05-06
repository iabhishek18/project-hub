import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import * as reviewService from '../services/review.service';

export const reviewRouter = Router();

const createReviewSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
  }),
});

reviewRouter.post(
  '/',
  authenticate,
  validate(createReviewSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId, rating, comment } = req.body;
      const review = await reviewService.createReview(req.user!.userId, projectId, rating, comment);
      res.status(201).json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }
);

reviewRouter.get(
  '/project/:projectId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await reviewService.getProjectReviews(req.params.projectId, page, limit);
      res.json({ success: true, data: result.reviews, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  }
);

reviewRouter.delete(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await reviewService.deleteReview(req.params.id, req.user!.userId);
      res.json({ success: true, message: 'Review deleted' });
    } catch (err) {
      next(err);
    }
  }
);
