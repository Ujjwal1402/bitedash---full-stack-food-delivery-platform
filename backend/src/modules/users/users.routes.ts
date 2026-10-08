import { Router } from 'express';
import { usersController } from './users.controller.ts';
import { authenticateJWT } from '../../middleware/auth.middleware.ts';

const router = Router();

router.use(authenticateJWT);
router.get('/profile', (req, res, next) => usersController.getProfile(req, res, next));
router.put('/profile', (req, res, next) => usersController.updateProfile(req, res, next));

export default router;
