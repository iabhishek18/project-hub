import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import * as requestService from '../services/request.service';

export const requestRouter = Router();

const createRequestSchema = z.object({
  body: z.object({
    requirementDetails: z.string().min(20).max(5000),
    budget: z.number().positive().optional(),
    deadline: z.string().datetime().optional(),
  }),
});

requestRouter.post(
  '/',
  authenticate,
  validate(createRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requirementDetails, budget, deadline } = req.body;
      const request = await requestService.createRequest(
        req.user!.userId,
        requirementDetails,
        budget,
        deadline ? new Date(deadline) : undefined
      );
      res.status(201).json({ success: true, data: request });
    } catch (err) {
      next(err);
    }
  }
);

requestRouter.get(
  '/my-requests',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await requestService.getUserRequests(req.user!.userId);
      res.json({ success: true, data: requests });
    } catch (err) {
      next(err);
    }
  }
);
