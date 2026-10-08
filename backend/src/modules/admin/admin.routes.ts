import { Router } from 'express';
import { adminController } from './admin.controller.ts';
import { authenticateJWT, requireRoles } from '../../middleware/auth.middleware.ts';

const router = Router();

router.use(authenticateJWT);
router.use(requireRoles('ADMIN'));

router.get('/stats', (req, res, next) => adminController.getDashboard(req, res, next));
router.get('/users', (req, res, next) => adminController.getUsers(req, res, next));
router.patch('/users/:id/role', (req, res, next) => adminController.updateUserRole(req, res, next));
router.get('/restaurants', (req, res, next) => adminController.getRestaurants(req, res, next));
router.patch('/restaurants/:id/toggle', (req, res, next) => adminController.toggleRestaurant(req, res, next));
router.get('/delivery-partners', (req, res, next) => adminController.getDeliveryPartners(req, res, next));
router.get('/orders', (req, res, next) => adminController.getOrders(req, res, next));
router.get('/payments', (req, res, next) => adminController.getPayments(req, res, next));

export default router;
