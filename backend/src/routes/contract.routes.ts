import { Router } from 'express';
import { ContractController } from '../controllers/contract.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();
const contractController = new ContractController();

// Protezione di tutte le route con autenticazione
router.use(requireAuth);

// Route per i contratti
router.post('/', contractController.create.bind(contractController));
router.get('/', contractController.getAll.bind(contractController));
router.get('/:id', contractController.getById.bind(contractController));
router.put('/:id', contractController.update.bind(contractController));
router.delete('/:id', contractController.delete.bind(contractController));

// Route speciale per l'aggiornamento tramite codice pratica
router.post('/update-by-practice-code', contractController.updateByPracticeCode.bind(contractController));

export default router;