import { Router } from 'express';
import { supportController } from './support.controller.ts';
import { authenticateJWT, requireRoles } from '../../middleware/auth.middleware.ts';

const router = Router();

router.use(authenticateJWT);

router.get('/my-tickets', (req, res, next) => supportController.getMyTickets(req, res, next));
router.post('/', (req, res, next) => supportController.create(req, res, next));

// Admin ticket management
router.get('/', requireRoles('ADMIN'), (req, res, next) => supportController.getAll(req, res, next));
router.patch('/:id', requireRoles('ADMIN'), (req, res, next) => supportController.update(req, res, next));

export default router;
