import { Router } from 'express';
import { notificationsController } from './notifications.controller.ts';
import { authenticateJWT } from '../../middleware/auth.middleware.ts';

const router = Router();

router.use(authenticateJWT);
router.get('/', (req, res, next) => notificationsController.getAll(req, res, next));
router.patch('/:id/read', (req, res, next) => notificationsController.markRead(req, res, next));
router.post('/mark-all-read', (req, res, next) => notificationsController.markAllRead(req, res, next));

export default router;
