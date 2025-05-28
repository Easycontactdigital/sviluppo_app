import { Request, Response, NextFunction } from 'express';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { BaseController } from './base.controller';
import { db } from '../db';
import { transactions } from '../db/schema';
import { AppError } from '../middleware/errorHandler';

export class TransactionController extends BaseController {
  protected entityName = 'Transaction';

  async create(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const { type, amount, category, description, date, isRecurring, recurringPeriod } = req.body;
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const transaction = await db.insert(transactions).values({
        userId: parseInt(req.user.uid),
        type,
        amount,
        category,
        description,
        date: new Date(date),
        isRecurring: isRecurring || false,
        recurringPeriod
      }).returning();

      return transaction[0];
    });
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const { startDate, endDate, category, type } = req.query;
      const conditions = [
        eq(transactions.userId, parseInt(req.user.uid)),
      ];

      if (startDate) {
        conditions.push(gte(transactions.date, new Date(startDate as string)));
      }

      if (endDate) {
        conditions.push(lte(transactions.date, new Date(endDate as string)));
      }

      const transactionsList = await db.select().from(transactions).where(and(...conditions));
      if (category) {
        conditions.push(eq(transactions.category, category as string));
      }

      if (type) {
        conditions.push(eq(transactions.type, type as string));
      }

      const query = and(...conditions);

      const result = await db.select()
        .from(transactions)
        .where(query)
        .orderBy(desc(transactions.date));

      return result;
    });
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const transaction = await db.select()
        .from(transactions)
        .where(
          and(
            eq(transactions.id, id),
            eq(transactions.userId, parseInt(req.user.uid))
          )
        );

      if (!transaction.length) {
        throw new AppError('Transaction not found', 404);
      }

      return transaction[0];
    });
  }

  async update(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      const updates = req.body;
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const transaction = await db.update(transactions)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(transactions.id, id),
            eq(transactions.userId, parseInt(req.user.uid))
          )
        )
        .returning();

      if (!transaction.length) {
        throw new AppError('Transaction not found', 404);
      }

      return transaction[0];
    });
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const transaction = await db.delete(transactions)
        .where(
          and(
            eq(transactions.id, id),
            eq(transactions.userId, parseInt(req.user.uid))
          )
        )
        .returning();

      if (!transaction.length) {
        throw new AppError('Transaction not found', 404);
      }

      return { message: 'Transaction deleted successfully' };
    });
  }
}