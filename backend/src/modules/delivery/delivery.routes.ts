import { Router } from 'express';
import { deliveryController } from './delivery.controller.ts';
import { authenticateJWT, requireRoles } from '../../middleware/auth.middleware.ts';

const router = Router();

router.use(authenticateJWT);
router.use(requireRoles('DELIVERY', 'ADMIN'));

router.get('/profile', (req, res, next) => deliveryController.getProfile(req, res, next));
router.patch('/toggle-online', (req, res, next) => deliveryController.toggleOnline(req, res, next));
router.get('/available', (req, res, next) => deliveryController.getAvailableOrders(req, res, next));
router.post('/accept/:orderId', (req, res, next) => deliveryController.acceptOrder(req, res, next));
router.get('/active', (req, res, next) => deliveryController.getActiveDeliveries(req, res, next));
router.patch('/:orderId/status', (req, res, next) => deliveryController.updateDeliveryStatus(req, res, next));
router.get('/history', (req, res, next) => deliveryController.getHistory(req, res, next));

export default router;
