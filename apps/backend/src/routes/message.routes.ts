import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import * as messageService from '../services/message.service';

export const messageRouter = Router();

const sendMessageSchema = z.object({
  body: z.object({
    subject: z.string().min(3).max(200),
    content: z.string().min(10).max(5000),
  }),
});

messageRouter.post(
  '/',
  authenticate,
  validate(sendMessageSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subject, content } = req.body;
      const message = await messageService.sendMessage(req.user!.userId, subject, content);
      res.status(201).json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }
);

messageRouter.get(
  '/my-messages',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await messageService.getUserMessages(req.user!.userId);
      res.json({ success: true, data: messages });
    } catch (err) {
      next(err);
    }
  }
);
