import { Request, Response, NextFunction } from 'express';
import { eq, and, desc } from 'drizzle-orm';
import { BaseController } from './base.controller';
import { db } from '../db';
import { notifications } from '../db/schema';
import { AppError } from '../middleware/errorHandler';

export class NotificationController extends BaseController {
  protected entityName = 'Notification';

  async create(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const { type, title, message } = req.body;
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const notification = await db.insert(notifications).values({
        userId: parseInt(req.user.uid),
        type,
        title,
        message,
        isRead: false
      }).returning();

      return notification[0];
    });
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const { type, isRead } = req.query;
      const conditions = [eq(notifications.userId, parseInt(req.user.uid))];

      if (type) {
        conditions.push(eq(notifications.type, type as string));
      }

      if (isRead !== undefined) {
        conditions.push(eq(notifications.isRead, isRead === 'true'));
      }

      const query = and(...conditions);

      const result = await db.select()
        .from(notifications)
        .where(query)
        .orderBy(desc(notifications.createdAt));

      return result;
    });
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const notification = await db.update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.id, id),
            eq(notifications.userId, parseInt(req.user.uid))
          )
        )
        .returning();

      if (!notification.length) {
        throw new AppError('Notification not found', 404);
      }

      return notification[0];
    });
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, parseInt(req.user.uid)));

      return { message: 'All notifications marked as read' };
    });
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const notification = await db.delete(notifications)
        .where(
          and(
            eq(notifications.id, id),
            eq(notifications.userId, parseInt(req.user.uid))
          )
        )
        .returning();

      if (!notification.length) {
        throw new AppError('Notification not found', 404);
      }

      return { message: 'Notification deleted successfully' };
    });
  }

  async deleteAll(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      await db.delete(notifications)
        .where(eq(notifications.userId, parseInt(req.user.uid)));

      return { message: 'All notifications deleted successfully' };
    });
  }
}