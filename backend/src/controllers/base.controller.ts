import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

export abstract class BaseController {
  protected abstract entityName: string;

  protected async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    action: () => Promise<any>
  ) {
    try {
      const result = await action();
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  protected handleError(error: any): never {
    if (error.code === '23505') { // Unique violation in PostgreSQL
      throw new AppError(`${this.entityName} already exists`, 400);
    }
    if (error.code === '23503') { // Foreign key violation
      throw new AppError(`Referenced ${this.entityName} not found`, 400);
    }
    throw new AppError(
      error.message || `Error processing ${this.entityName}`,
      error.statusCode || 500
    );
  }

  protected validateId(id: string): number {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new AppError(`Invalid ${this.entityName} ID`, 400);
    }
    return parsedId;
  }

  protected checkOwnership(userId: number, resourceUserId: number): void {
    if (userId !== resourceUserId) {
      throw new AppError('You are not authorized to access this resource', 403);
    }
  }
}