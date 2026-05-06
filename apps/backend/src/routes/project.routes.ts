import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ProjectCategory, UserRole } from '@project-hub/shared';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import * as projectService from '../services/project.service';

export const projectRouter = Router();

const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(1000),
    longDescription: z.string().max(5000).optional(),
    price: z.number().positive(),
    category: z.nativeEnum(ProjectCategory),
    techStack: z.array(z.string()).min(1),
    features: z.array(z.string()).optional(),
    fileUrl: z.string().url(),
    fileKey: z.string().min(1),
    thumbnailUrl: z.string().url().optional(),
    isFeatured: z.boolean().optional(),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).max(1000).optional(),
    longDescription: z.string().max(5000).optional(),
    price: z.number().positive().optional(),
    category: z.nativeEnum(ProjectCategory).optional(),
    techStack: z.array(z.string()).min(1).optional(),
    features: z.array(z.string()).optional(),
    fileUrl: z.string().url().optional(),
    fileKey: z.string().min(1).optional(),
    thumbnailUrl: z.string().url().optional(),
    isFeatured: z.boolean().optional(),
  }),
});

projectRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        category: req.query.category as ProjectCategory | undefined,
        techStack: req.query.techStack as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        search: req.query.search as string | undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 12,
        sortBy: req.query.sortBy as 'price' | 'createdAt' | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
      };
      const result = await projectService.listProjects(filters);
      res.json({ success: true, data: result.projects, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  }
);

projectRouter.get(
  '/featured',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await projectService.getFeaturedProjects();
      res.json({ success: true, data: projects });
    } catch (err) {
      next(err);
    }
  }
);

projectRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let userId: string | undefined;
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        try {
          const jwt = await import('jsonwebtoken');
          const token = authHeader.split(' ')[1];
          const payload = jwt.default.verify(token, process.env.JWT_SECRET!) as { userId: string };
          userId = payload.userId;
        } catch {
          // Token invalid — still show project, just without purchase status
        }
      }
      const project = await projectService.getProjectById(req.params.id, userId);
      res.json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  }
);

projectRouter.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createProjectSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await projectService.createProject(req.body);
      res.status(201).json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  }
);

projectRouter.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateProjectSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await projectService.updateProject(req.params.id, req.body);
      res.json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  }
);

projectRouter.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await projectService.deleteProject(req.params.id);
      res.json({ success: true, message: 'Project deleted' });
    } catch (err) {
      next(err);
    }
  }
);
