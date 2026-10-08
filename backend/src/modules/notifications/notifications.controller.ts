import { Response, NextFunction } from 'express';
import { notificationsService } from './notifications.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class NotificationsController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await notificationsService.getUserNotifications(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async markRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await notificationsService.markAsRead(id, req.user!.id);
      res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (err) {
      next(err);
    }
  }

  async markAllRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationsService.markAllAsRead(req.user!.id);
      res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
      next(err);
    }
  }
}

export const notificationsController = new NotificationsController();
