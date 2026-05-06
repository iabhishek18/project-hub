import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export async function sendMessage(userId: string, subject: string, content: string) {
  return prisma.message.create({
    data: { userId, subject, content },
  });
}

export async function getUserMessages(userId: string) {
  return prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllMessages() {
  return prisma.message.findMany({
    include: { user: { select: { name: true, email: true, role: true } } },
    orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function markAsRead(messageId: string) {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) {
    throw new AppError(404, 'Message not found');
  }

  return prisma.message.update({
    where: { id: messageId },
    data: { isRead: true },
  });
}

export async function replyToMessage(messageId: string, reply: string) {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) {
    throw new AppError(404, 'Message not found');
  }

  return prisma.message.update({
    where: { id: messageId },
    data: { reply, isRead: true },
  });
}
