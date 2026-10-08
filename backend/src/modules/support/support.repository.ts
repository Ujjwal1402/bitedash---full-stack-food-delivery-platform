import { db } from '../../config/database.ts';
import { SupportTicket } from '../../../../shared/types/index.ts';

export class SupportRepository {
  async findByUserId(userId: number): Promise<SupportTicket[]> {
    return await db.query<SupportTicket>(
      `SELECT t.*, u.name as user_name, u.email as user_email
       FROM support_tickets t
       JOIN users u ON t.user_id = u.id
       WHERE t.user_id = ?
       ORDER BY t.id DESC`,
      [userId]
    );
  }

  async findById(ticketId: number): Promise<SupportTicket | null> {
    return await db.queryOne<SupportTicket>(
      `SELECT t.*, u.name as user_name, u.email as user_email
       FROM support_tickets t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [ticketId]
    );
  }

  async findAll(): Promise<SupportTicket[]> {
    return await db.query<SupportTicket>(
      `SELECT t.*, u.name as user_name, u.email as user_email
       FROM support_tickets t
       JOIN users u ON t.user_id = u.id
       ORDER BY t.id DESC`
    );
  }

  async createTicket(data: {
    ticket_number: string;
    user_id: number;
    order_id?: number;
    subject: string;
    category: string;
    priority: string;
    message: string;
    resolution?: string;
  }): Promise<number> {
    const res = await db.execute(
      `INSERT INTO support_tickets
        (ticket_number, user_id, order_id, subject, category, priority, status, message, resolution)
       VALUES (?, ?, ?, ?, ?, ?, 'OPEN', ?, ?)`,
      [
        data.ticket_number,
        data.user_id,
        data.order_id || null,
        data.subject,
        data.category,
        data.priority,
        data.message,
        data.resolution || null,
      ]
    );
    return res.insertId;
  }

  async updateTicket(id: number, status: string, resolution?: string): Promise<void> {
    await db.execute(
      'UPDATE support_tickets SET status = ?, resolution = COALESCE(?, resolution) WHERE id = ?',
      [status, resolution || null, id]
    );
  }
}

export const supportRepository = new SupportRepository();
