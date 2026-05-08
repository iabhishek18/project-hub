import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { UserRole } from '@project-hub/shared';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';

export async function signup(
  name: string,
  email: string,
  password: string,
  role: UserRole
) {
  if (role === UserRole.ADMIN) {
    throw new AppError(400, 'Cannot register as admin');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
    select: { id: true, name: true, email: true, role: true },
  });

  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return { user, accessToken, refreshToken };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
}

export async function adminLogin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new AppError(500, 'Admin credentials not configured');
  }

  if (email !== adminEmail || password !== adminPassword) {
    throw new AppError(401, 'Invalid admin credentials');
  }

  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });
  }

  const tokenPayload = { userId: admin.id, email: admin.email, role: admin.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    accessToken,
    refreshToken,
  };
}

export async function refreshToken(token: string) {
  const payload = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  if (!user) {
    throw new AppError(401, 'User not found');
  }

  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);

  return { accessToken };
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { message: 'If an account with that email exists, a reset link has been generated.' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  return {
    message: 'If an account with that email exists, a reset link has been generated.',
    resetToken,
  };
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError(400, 'Invalid or expired reset token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: 'Password has been reset successfully' };
}
