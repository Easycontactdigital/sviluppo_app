import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();
const transactionController = new TransactionController();

// Protezione di tutte le route con autenticazione
router.use(requireAuth);

// Route per le transazioni
router.post('/', transactionController.create.bind(transactionController));
router.get('/', transactionController.getAll.bind(transactionController));
router.get('/:id', transactionController.getById.bind(transactionController));
router.put('/:id', transactionController.update.bind(transactionController));
router.delete('/:id', transactionController.delete.bind(transactionController));

export default router;