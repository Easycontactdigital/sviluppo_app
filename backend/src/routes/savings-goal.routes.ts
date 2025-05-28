import { Router } from 'express';
import { SavingsGoalController } from '../controllers/savings-goal.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();
const savingsGoalController = new SavingsGoalController();

// Protezione di tutte le route con autenticazione
router.use(requireAuth);

// Route per gli obiettivi di risparmio
router.post('/', savingsGoalController.create.bind(savingsGoalController));
router.get('/', savingsGoalController.getAll.bind(savingsGoalController));
router.get('/:id', savingsGoalController.getById.bind(savingsGoalController));
router.put('/:id', savingsGoalController.update.bind(savingsGoalController));
router.delete('/:id', savingsGoalController.delete.bind(savingsGoalController));

// Route speciale per l'aggiornamento del progresso
router.post('/:id/progress', savingsGoalController.updateProgress.bind(savingsGoalController));

export default router;