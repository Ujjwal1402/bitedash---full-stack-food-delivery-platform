import { Router } from 'express';
import { reviewsController } from './reviews.controller.ts';
import { authenticateJWT } from '../../middleware/auth.middleware.ts';

const router = Router();

router.get('/restaurant/:restaurantId', (req, res, next) =>
  reviewsController.getByRestaurant(req, res, next)
);
router.post('/', authenticateJWT, (req, res, next) =>
  reviewsController.create(req, res, next)
);

export default router;
