import { supportRepository, SupportRepository } from './support.repository.ts';
import { ordersRepository } from '../orders/orders.repository.ts';
import { geminiService } from '../../integrations/gemini/gemini.service.ts';
import { SupportTicket } from '../../../../shared/types/index.ts';
import { AppError } from '../../middleware/error.middleware.ts';

export class SupportService {
  constructor(private repo: SupportRepository = supportRepository) {}

  async getUserTickets(userId: number): Promise<SupportTicket[]> {
    return await this.repo.findByUserId(userId);
  }

  async getAllTickets(): Promise<SupportTicket[]> {
    return await this.repo.findAll();
  }

  async createTicket(userId: number, data: {
    order_id?: number;
    subject: string;
    category: string;
    priority?: string;
    message: string;
  }): Promise<{ ticket: SupportTicket; aiAssistance?: any }> {
    if (!data.subject || !data.category || !data.message) {
      throw new AppError('Subject, category, and message are required', 400);
    }

    let orderContext = '';
    if (data.order_id) {
      const order = await ordersRepository.findById(data.order_id);
      if (order) {
        orderContext = `Order #${order.order_number} (${order.status}) from ${order.restaurant_name}, Total: ₹${order.total_amount}`;
      }
    }

    // AI support guidance
    const aiGuidance = await geminiService.generateSupportAdvice(data.message, orderContext);

    const ticketNumber = `TCK-${Date.now().toString().slice(-6)}`;
    const insertId = await this.repo.createTicket({
      ticket_number: ticketNumber,
      user_id: userId,
      order_id: data.order_id,
      subject: data.subject,
      category: data.category,
      priority: data.priority || 'MEDIUM',
      message: data.message,
      resolution: aiGuidance.customerResponse, // Initial automated polite acknowledgment
    });

    const ticket = await this.repo.findById(insertId);
    return {
      ticket: ticket!,
      aiAssistance: aiGuidance,
    };
  }

  async updateTicketStatus(id: number, status: string, resolution?: string): Promise<SupportTicket> {
    await this.repo.updateTicket(id, status, resolution);
    const updated = await this.repo.findById(id);
    if (!updated) throw new AppError('Ticket not found', 404);
    return updated;
  }
}

export const supportService = new SupportService();
