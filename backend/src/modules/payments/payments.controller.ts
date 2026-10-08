import { Response, NextFunction } from 'express';
import { paymentsService } from './payments.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class PaymentsController {
  async getByOrderId(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      const payment = await paymentsService.getPaymentByOrderId(orderId, req.user!.id, req.user!.role);
      res.status(200).json({ success: true, data: { payment } });
    } catch (err) {
      next(err);
    }
  }

  async process(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { order_id, payment_method, simulate_failure } = req.body;
      const result = await paymentsService.processPayment(
        order_id,
        req.user!.id,
        payment_method,
        simulate_failure
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const paymentsController = new PaymentsController();
