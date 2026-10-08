import { Router } from 'express';
import { paymentsController } from './payments.controller.ts';
import { authenticateJWT } from '../../middleware/auth.middleware.ts';

const router = Router();

router.use(authenticateJWT);
router.get('/order/:orderId', (req, res, next) => paymentsController.getByOrderId(req, res, next));
router.post('/process', (req, res, next) => paymentsController.process(req, res, next));

export default router;
