import { Router } from 'express';
import { ordersController } from './orders.controller.ts';
import { authenticateJWT, requireRoles } from '../../middleware/auth.middleware.ts';

const router = Router();

router.use(authenticateJWT);

router.post('/', (req, res, next) => ordersController.create(req, res, next));
router.get('/my-orders', (req, res, next) => ordersController.getMyOrders(req, res, next));
router.get('/restaurant-orders', requireRoles('RESTAURANT', 'ADMIN'), (req, res, next) =>
  ordersController.getRestaurantOrders(req, res, next)
);
router.get('/:id', (req, res, next) => ordersController.getById(req, res, next));
router.patch('/:id/status', (req, res, next) => ordersController.updateStatus(req, res, next));

export default router;
