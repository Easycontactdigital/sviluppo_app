import { Request, Response, NextFunction } from 'express';
import { eq, and } from 'drizzle-orm';
import { BaseController } from './base.controller';
import { db } from '../db';
import { savingsGoals } from '../db/schema';
import { AppError } from '../middleware/errorHandler';

type SavingsGoalStatus = 'active' | 'completed' | 'cancelled';

export class SavingsGoalController extends BaseController {
  protected entityName = 'Savings Goal';

  async create(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const { name, targetAmount, deadline, status } = req.body;
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const savingsGoal = await db.insert(savingsGoals).values({
        userId: parseInt(req.user.uid),
        name,
        targetAmount,
        currentAmount: '0',
        deadline: deadline ? new Date(deadline) : null,
        status
      }).returning();

      return savingsGoal[0];
    });
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const conditions = [
        eq(savingsGoals.userId, parseInt(req.user.uid)),
      ];

      if (req.query.status) {
        conditions.push(eq(savingsGoals.status, req.query.status as SavingsGoalStatus));
      }

      const goals = await db.select().from(savingsGoals).where(and(...conditions));

      const result = await db.select()
        .from(savingsGoals)
        .where(and(...conditions));

      return result;
    });
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const savingsGoal = await db.select()
        .from(savingsGoals)
        .where(
          and(
            eq(savingsGoals.id, id),
            eq(savingsGoals.userId, parseInt(req.user.uid))
          )
        );

      if (!savingsGoal.length) {
        throw new AppError('Savings goal not found', 404);
      }

      return savingsGoal[0];
    });
  }

  async update(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      const updates = req.body;
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const savingsGoal = await db.update(savingsGoals)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(savingsGoals.id, id),
            eq(savingsGoals.userId, parseInt(req.user.uid))
          )
        )
        .returning();

      if (!savingsGoal.length) {
        throw new AppError('Savings goal not found', 404);
      }

      return savingsGoal[0];
    });
  }

  async updateProgress(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      const { amount } = req.body;
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const currentGoal = await db.select()
        .from(savingsGoals)
        .where(
          and(
            eq(savingsGoals.id, id),
            eq(savingsGoals.userId, parseInt(req.user.uid))
          )
        );

      if (!currentGoal.length) {
        throw new AppError('Savings goal not found', 404);
      }

      const newAmount = parseFloat((currentGoal[0]?.currentAmount ?? 0).toString()) + parseFloat(amount);
      const targetAmount = parseFloat((currentGoal[0]?.targetAmount ?? 0).toString());

      const status = newAmount >= targetAmount ? 'completed' : 'active';

      const updatedGoal = await db.update(savingsGoals)
        .set({
          currentAmount: newAmount.toString(),
          status,
          updatedAt: new Date()
        })
        .where(eq(savingsGoals.id, id))
        .returning();

      return updatedGoal[0];
    });
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const savingsGoal = await db.delete(savingsGoals)
        .where(
          and(
            eq(savingsGoals.id, id),
            eq(savingsGoals.userId, parseInt(req.user.uid))
          )
        )
        .returning();

      if (!savingsGoal.length) {
        throw new AppError('Savings goal not found', 404);
      }

      return { message: 'Savings goal deleted successfully' };
    });
  }
}