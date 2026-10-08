import { Response, NextFunction } from 'express';
import { ordersService } from './orders.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class OrdersController {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await ordersService.createOrder(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: { order },
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = parseInt(req.params.id, 10);
      const order = await ordersService.getOrderById(orderId, req.user!.id, req.user!.role);
      res.status(200).json({ success: true, data: { order } });
    } catch (err) {
      next(err);
    }
  }

  async getMyOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await ordersService.getUserOrders(req.user!.id);
      res.status(200).json({ success: true, data: { orders } });
    } catch (err) {
      next(err);
    }
  }

  async getRestaurantOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = req.query.status as string;
      const orders = await ordersService.getRestaurantOrders(req.user!.id, status);
      res.status(200).json({ success: true, data: { orders } });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = parseInt(req.params.id, 10);
      const { status, cancellation_reason } = req.body;
      const order = await ordersService.updateOrderStatus(
        orderId,
        status,
        req.user!.id,
        req.user!.role,
        cancellation_reason
      );
      res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        data: { order },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const ordersController = new OrdersController();
