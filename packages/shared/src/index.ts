// Shared types between frontend and backend

export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  COLLEGE = 'COLLEGE',
  COMPANY = 'COMPANY',
}

export enum ProjectCategory {
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  MOBILE_APP = 'MOBILE_APP',
  MACHINE_LEARNING = 'MACHINE_LEARNING',
  DATA_SCIENCE = 'DATA_SCIENCE',
  BLOCKCHAIN = 'BLOCKCHAIN',
  IOT = 'IOT',
  CLOUD_COMPUTING = 'CLOUD_COMPUTING',
  CYBERSECURITY = 'CYBERSECURITY',
  GAME_DEVELOPMENT = 'GAME_DEVELOPMENT',
  DEVOPS = 'DEVOPS',
  OTHER = 'OTHER',
}

export enum PurchaseStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole.STUDENT | UserRole.COLLEGE | UserRole.COMPANY;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  accessToken: string;
}

// Project types
export interface ProjectFilters {
  category?: ProjectCategory;
  techStack?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProjectCategory;
  techStack: string[];
  thumbnailUrl?: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProjectDetail extends ProjectSummary {
  longDescription?: string;
  features: string[];
  isPurchased?: boolean;
}

// Dashboard types
export interface AdminDashboardStats {
  totalRevenue: number;
  totalSales: number;
  totalUsers: number;
  totalProjects: number;
  recentTransactions: Array<{
    id: string;
    buyerName: string;
    projectTitle: string;
    amount: number;
    date: string;
  }>;
}

export interface BuyerDashboardData {
  purchasedProjects: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    purchaseDate: string;
    amount: number;
  }>;
  totalSpent: number;
}
