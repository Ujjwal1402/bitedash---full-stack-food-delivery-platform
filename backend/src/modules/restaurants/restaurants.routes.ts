import { Router } from 'express';
import { restaurantsController } from './restaurants.controller.ts';
import { authenticateJWT, requireRoles } from '../../middleware/auth.middleware.ts';

const router = Router();

// Public restaurant routes
router.get('/', (req, res, next) => restaurantsController.getAll(req, res, next));
router.get('/partner/profile', authenticateJWT, requireRoles('RESTAURANT', 'ADMIN'), (req, res, next) =>
  restaurantsController.getPartnerProfile(req, res, next)
);
router.put('/partner/profile', authenticateJWT, requireRoles('RESTAURANT', 'ADMIN'), (req, res, next) =>
  restaurantsController.updatePartnerProfile(req, res, next)
);
router.get('/partner/analytics', authenticateJWT, requireRoles('RESTAURANT', 'ADMIN'), (req, res, next) =>
  restaurantsController.getPartnerAnalytics(req, res, next)
);
router.get('/:idOrSlug', (req, res, next) => restaurantsController.getByIdOrSlug(req, res, next));

export default router;
