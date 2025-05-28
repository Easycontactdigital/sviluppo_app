import { Request, Response, NextFunction } from 'express';
import { eq, and } from 'drizzle-orm';
import { BaseController } from './base.controller';
import { db } from '../db';
import { contracts } from '../db/schema';
import { AppError } from '../middleware/errorHandler';

export class ContractController extends BaseController {
  protected entityName = 'Contract';

  async create(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const { provider, contractNumber, startDate, endDate, amount, frequency, status, documentUrl } = req.body;
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const contract = await db.insert(contracts).values({
        userId: parseInt(req.user.uid),
        provider,
        contractNumber,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        amount,
        frequency,
        status,
        documentUrl
      }).returning();

      return contract[0];
    });
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const { status, provider } = req.query;
      const conditions = [eq(contracts.userId, parseInt(req.user.uid))];

      if (status) {
        conditions.push(eq(contracts.status, status as string));
      }

      if (provider) {
        conditions.push(eq(contracts.provider, provider as string));
      }

      const query = and(...conditions);

      const result = await db.select()
        .from(contracts)
        .where(query);

      return result;
    });
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const contract = await db.select()
        .from(contracts)
        .where(
          and(
            eq(contracts.id, id),
            eq(contracts.userId, parseInt(req.user.uid))
          )
        );

      if (!contract.length) {
        throw new AppError('Contract not found', 404);
      }

      return contract[0];
    });
  }

  async update(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      const updates = req.body;
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const contract = await db.update(contracts)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(contracts.id, id),
            eq(contracts.userId, parseInt(req.user.uid))
          )
        )
        .returning();

      if (!contract.length) {
        throw new AppError('Contract not found', 404);
      }

      return contract[0];
    });
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const id = this.validateId(req.params.id);
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      const contract = await db.delete(contracts)
        .where(
          and(
            eq(contracts.id, id),
            eq(contracts.userId, parseInt(req.user.uid))
          )
        )
        .returning();

      if (!contract.length) {
        throw new AppError('Contract not found', 404);
      }

      return { message: 'Contract deleted successfully' };
    });
  }

  // Metodo per aggiornare il contratto tramite codice pratica
  async updateByPracticeCode(req: Request, res: Response, next: NextFunction) {
    return this.handleRequest(req, res, next, async () => {
      const { practiceCode } = req.body;
      
      if (!req.user?.uid) {
        throw new AppError('User not authenticated', 401);
      }

      // TODO: Implementare la chiamata API per ottenere i dati aggiornati del contratto
      // const updatedContractData = await fetchContractDataByPracticeCode(practiceCode);

      // Per ora restituiamo un messaggio di esempio
      return { message: 'Contract update by practice code not implemented yet' };
    });
  }
}