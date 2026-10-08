import { Response, NextFunction } from 'express';
import { usersService } from './users.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class UsersController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.getProfile(req.user!.id);
      res.status(200).json({ success: true, data: { user } });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedUser = await usersService.updateProfile(req.user!.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const usersController = new UsersController();
