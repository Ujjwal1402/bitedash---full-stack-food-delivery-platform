import { Response, NextFunction } from 'express';
import { supportService } from './support.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class SupportController {
  async getMyTickets(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tickets = await supportService.getUserTickets(req.user!.id);
      res.status(200).json({ success: true, data: { tickets } });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tickets = await supportService.getAllTickets();
      res.status(200).json({ success: true, data: { tickets } });
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await supportService.createTicket(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Support ticket submitted successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const { status, resolution } = req.body;
      const ticket = await supportService.updateTicketStatus(id, status, resolution);
      res.status(200).json({
        success: true,
        message: 'Ticket updated successfully',
        data: { ticket },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const supportController = new SupportController();
