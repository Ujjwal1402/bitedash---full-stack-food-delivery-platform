import { Response, NextFunction } from 'express';
import { deliveryService } from './delivery.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class DeliveryController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const partner = await deliveryService.getPartnerByUserId(req.user!.id);
      res.status(200).json({ success: true, data: { partner } });
    } catch (err) {
      next(err);
    }
  }

  async toggleOnline(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { is_online } = req.body;
      const partner = await deliveryService.toggleStatus(req.user!.id, is_online);
      res.status(200).json({
        success: true,
        message: `Status updated to ${is_online ? 'online' : 'offline'}`,
        data: { partner },
      });
    } catch (err) {
      next(err);
    }
  }

  async getAvailableOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await deliveryService.getAvailableDeliveries(req.user!.id);
      res.status(200).json({ success: true, data: { orders } });
    } catch (err) {
      next(err);
    }
  }

  async acceptOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      const order = await deliveryService.acceptOrder(req.user!.id, orderId);
      res.status(200).json({
        success: true,
        message: 'Order accepted for delivery',
        data: { order },
      });
    } catch (err) {
      next(err);
    }
  }

  async getActiveDeliveries(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await deliveryService.getActiveDeliveries(req.user!.id);
      res.status(200).json({ success: true, data: { orders } });
    } catch (err) {
      next(err);
    }
  }

  async updateDeliveryStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      const { status } = req.body;
      const order = await deliveryService.updateDeliveryStatus(req.user!.id, orderId, status);
      res.status(200).json({
        success: true,
        message: `Delivery status updated to ${status}`,
        data: { order },
      });
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await deliveryService.getHistory(req.user!.id);
      res.status(200).json({ success: true, data: { orders } });
    } catch (err) {
      next(err);
    }
  }
}

export const deliveryController = new DeliveryController();
