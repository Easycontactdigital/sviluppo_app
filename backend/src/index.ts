import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import transactionRoutes from './routes/transaction.routes';
import contractRoutes from './routes/contract.routes';
import savingsGoalRoutes from './routes/savings-goal.routes';
import notificationRoutes from './routes/notification.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});