import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserRole } from '@project-hub/shared';
import { validate } from '../middleware/validate.middleware';
import * as authService from '../services/auth.service';

export const authRouter = Router();

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(128),
    role: z.enum([UserRole.STUDENT, UserRole.COLLEGE, UserRole.COMPANY]),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    password: z.string().min(8).max(128),
  }),
});

authRouter.post(
  '/signup',
  validate(signupSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;
      const result = await authService.signup(name, email, password, role);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post(
  '/login',
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post(
  '/admin/login',
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.adminLogin(email, password);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post(
  '/refresh',
  validate(refreshSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post(
  '/reset-password',
  validate(resetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);
