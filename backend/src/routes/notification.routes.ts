import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();
const notificationController = new NotificationController();

// Protezione di tutte le route con autenticazione
router.use(requireAuth);

// Route per le notifiche
router.post('/', notificationController.create.bind(notificationController));
router.get('/', notificationController.getAll.bind(notificationController));

// Route per la gestione dello stato di lettura
router.put('/:id/read', notificationController.markAsRead.bind(notificationController));
router.put('/mark-all-read', notificationController.markAllAsRead.bind(notificationController));

// Route per l'eliminazione
router.delete('/:id', notificationController.delete.bind(notificationController));
router.delete('/', notificationController.deleteAll.bind(notificationController));

export default router;