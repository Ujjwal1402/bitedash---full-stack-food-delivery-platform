import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const user = await authService.getCurrentUser(req.user.id);
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
