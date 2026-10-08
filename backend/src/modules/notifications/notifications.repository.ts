import { db } from '../../config/database.ts';
import { Notification } from '../../../../shared/types/index.ts';

export class NotificationsRepository {
  async findByUserId(userId: number): Promise<Notification[]> {
    return await db.query<Notification>(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 50',
      [userId]
    );
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    await db.execute('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, userId]);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await db.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
  }

  async createNotification(data: {
    user_id: number;
    title: string;
    message: string;
    type: string;
    link?: string;
  }): Promise<number> {
    const res = await db.execute(
      'INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?)',
      [data.user_id, data.title, data.message, data.type, data.link || null]
    );
    return res.insertId;
  }
}

export const notificationsRepository = new NotificationsRepository();
