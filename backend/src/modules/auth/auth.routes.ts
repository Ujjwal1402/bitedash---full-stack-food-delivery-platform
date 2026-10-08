import { Router } from 'express';
import { authController } from './auth.controller.ts';
import { authenticateJWT } from '../../middleware/auth.middleware.ts';

const router = Router();

router.post('/signup', (req, res, next) => authController.signup(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.get('/me', authenticateJWT, (req, res, next) => authController.me(req, res, next));

export default router;
