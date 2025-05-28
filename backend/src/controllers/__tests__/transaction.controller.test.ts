import { Request, Response } from 'express';
import { TransactionController } from '../transaction.controller';
import { db } from '../../db';
import { transactions } from '../../db/schema';

// Mock di Express Request e Response
const mockRequest = (data?: any) => {
  return {
    body: data,
    params: {},
    query: {},
    user: { uid: '1' },
    ...data
  } as Request;
};

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Mock di Drizzle ORM
jest.mock('../../db', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

describe('TransactionController', () => {
  let controller: TransactionController;
  let mockNext: jest.Mock;

  beforeEach(() => {
    controller = new TransactionController();
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const transactionData = {
        type: 'expense',
        amount: 100,
        category: 'food',
        description: 'Grocery shopping',
        date: new Date().toISOString()
      };

      const mockInsertResult = [{
        id: 1,
        userId: 1,
        ...transactionData,
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue(mockInsertResult)
        })
      });

      const req = mockRequest({ body: transactionData });
      const res = mockResponse();

      await controller.create(req, res, mockNext);

      expect(db.insert).toHaveBeenCalledWith(transactions);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockInsertResult[0]
      });
    });

    it('should handle unauthorized request', async () => {
      const req = mockRequest({ user: null });
      const res = mockResponse();

      await controller.create(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
      expect(mockNext.mock.calls[0][0].message).toBe('User not authenticated');
    });
  });

  describe('getAll', () => {
    it('should return all transactions for user', async () => {
      const mockTransactions = [
        {
          id: 1,
          userId: 1,
          type: 'expense',
          amount: 100,
          category: 'food',
          description: 'Grocery shopping',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockResolvedValue(mockTransactions)
          })
        })
      });

      const req = mockRequest();
      const res = mockResponse();

      await controller.getAll(req, res, mockNext);

      expect(db.select).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockTransactions
      });
    });
  });
});