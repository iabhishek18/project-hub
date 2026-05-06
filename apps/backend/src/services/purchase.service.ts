import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { razorpay } from '../config/razorpay';
import { AppError } from '../middleware/error.middleware';
import { getPresignedDownloadUrl } from './s3.service';

export async function createOrder(userId: string, projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || !project.isActive) {
    throw new AppError(404, 'Project not found');
  }

  const existingPurchase = await prisma.purchase.findFirst({
    where: { userId, projectId, status: 'COMPLETED' },
  });
  if (existingPurchase) {
    throw new AppError(400, 'You have already purchased this project');
  }

  const amountInPaise = Number(project.price) * 100;

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      projectId,
      amount: project.price,
      status: 'PENDING',
    },
  });

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: purchase.id,
  });

  await prisma.purchase.update({
    where: { id: purchase.id },
    data: { razorpayOrderId: order.id },
  });

  return {
    orderId: order.id,
    amount: amountInPaise,
    currency: 'INR',
    purchaseId: purchase.id,
    projectTitle: project.title,
  };
}

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new AppError(400, 'Payment verification failed');
  }

  const purchase = await prisma.purchase.findUnique({
    where: { razorpayOrderId },
  });

  if (!purchase) {
    throw new AppError(404, 'Purchase not found');
  }

  const updatedPurchase = await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      razorpayPaymentId,
      razorpaySignature,
      status: 'COMPLETED',
    },
    include: { project: { select: { title: true } } },
  });

  return updatedPurchase;
}

export async function getDownloadUrl(userId: string, projectId: string) {
  const purchase = await prisma.purchase.findFirst({
    where: { userId, projectId, status: 'COMPLETED' },
  });

  if (!purchase) {
    throw new AppError(403, 'You have not purchased this project');
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new AppError(404, 'Project not found');
  }

  const downloadUrl = await getPresignedDownloadUrl(project.fileKey);
  return { downloadUrl, fileName: project.title };
}

export async function getUserPurchases(userId: string) {
  return prisma.purchase.findMany({
    where: { userId, status: 'COMPLETED' },
    include: {
      project: {
        select: { id: true, title: true, thumbnailUrl: true, category: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
