import { notificationsRepository, NotificationsRepository } from './notifications.repository.ts';
import { Notification } from '../../../../shared/types/index.ts';

export class NotificationsService {
  constructor(private repo: NotificationsRepository = notificationsRepository) {}

  async getUserNotifications(userId: number): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const notifications = await this.repo.findByUserId(userId);
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    return { notifications, unreadCount };
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    await this.repo.markAsRead(id, userId);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.repo.markAllAsRead(userId);
  }
}

export const notificationsService = new NotificationsService();
