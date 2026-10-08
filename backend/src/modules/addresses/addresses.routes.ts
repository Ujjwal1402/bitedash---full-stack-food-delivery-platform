import { Router } from 'express';
import { addressesController } from './addresses.controller.ts';
import { authenticateJWT } from '../../middleware/auth.middleware.ts';

const router = Router();

router.use(authenticateJWT);

router.get('/', (req, res, next) => addressesController.getAll(req, res, next));
router.post('/', (req, res, next) => addressesController.create(req, res, next));
router.put('/:id', (req, res, next) => addressesController.update(req, res, next));
router.delete('/:id', (req, res, next) => addressesController.delete(req, res, next));
router.patch('/:id/default', (req, res, next) => addressesController.setDefault(req, res, next));

export default router;
