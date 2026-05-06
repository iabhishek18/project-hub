import { Prisma } from '@prisma/client';
import { ProjectCategory, ProjectFilters } from '@project-hub/shared';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

interface CreateProjectData {
  title: string;
  description: string;
  longDescription?: string;
  price: number;
  category: ProjectCategory;
  techStack: string[];
  features?: string[];
  fileUrl: string;
  fileKey: string;
  thumbnailUrl?: string;
  isFeatured?: boolean;
}

export async function createProject(data: CreateProjectData) {
  return prisma.project.create({
    data: {
      ...data,
      price: new Prisma.Decimal(data.price),
    },
  });
}

export async function updateProject(id: string, data: Partial<CreateProjectData>) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new AppError(404, 'Project not found');
  }

  const updateData: Prisma.ProjectUpdateInput = { ...data };
  if (data.price !== undefined) {
    updateData.price = new Prisma.Decimal(data.price);
  }

  return prisma.project.update({ where: { id }, data: updateData });
}

export async function deleteProject(id: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new AppError(404, 'Project not found');
  }

  return prisma.project.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function getProjectById(id: string, userId?: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      reviews: {
        select: { rating: true },
      },
      purchases: userId
        ? { where: { userId, status: 'COMPLETED' }, select: { id: true } }
        : false,
    },
  });

  if (!project || !project.isActive) {
    throw new AppError(404, 'Project not found');
  }

  const ratings = project.reviews.map(r => r.rating);
  const averageRating = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  const { reviews, purchases, ...projectData } = project;
  return {
    ...projectData,
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
    isPurchased: Array.isArray(purchases) && purchases.length > 0,
  };
}

export async function listProjects(filters: ProjectFilters) {
  const {
    category,
    techStack,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 12,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const where: Prisma.ProjectWhereInput = {
    isActive: true,
  };

  if (category) {
    where.category = category;
  }

  if (techStack) {
    where.techStack = { has: techStack };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = new Prisma.Decimal(minPrice);
    if (maxPrice !== undefined) where.price.lte = new Prisma.Decimal(maxPrice);
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * limit;

  const orderBy: Prisma.ProjectOrderByWithRelationInput = {};
  if (sortBy === 'price' || sortBy === 'createdAt') {
    orderBy[sortBy] = sortOrder;
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        reviews: { select: { rating: true } },
      },
    }),
    prisma.project.count({ where }),
  ]);

  const projectsWithRating = projects.map(({ reviews, ...project }) => {
    const ratings = reviews.map(r => r.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;
    return {
      ...project,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    };
  });

  return {
    projects: projectsWithRating,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getFeaturedProjects() {
  const projects = await prisma.project.findMany({
    where: { isActive: true, isFeatured: true },
    include: { reviews: { select: { rating: true } } },
    take: 8,
    orderBy: { createdAt: 'desc' },
  });

  return projects.map(({ reviews, ...project }) => {
    const ratings = reviews.map(r => r.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;
    return {
      ...project,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    };
  });
}
