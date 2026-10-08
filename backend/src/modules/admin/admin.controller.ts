import { Response, NextFunction } from 'express';
import { adminService } from './admin.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class AdminController {
  async getDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json({ success: true, data: { stats } });
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await adminService.getAllUsers();
      res.status(200).json({ success: true, data: { users } });
    } catch (err) {
      next(err);
    }
  }

  async updateUserRole(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const { role } = req.body;
      const result = await adminService.updateUserRole(userId, role);
      res.status(200).json({ success: true, message: 'User role updated', data: result });
    } catch (err) {
      next(err);
    }
  }

  async getRestaurants(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurants = await adminService.getAllRestaurants();
      res.status(200).json({ success: true, data: { restaurants } });
    } catch (err) {
      next(err);
    }
  }

  async toggleRestaurant(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const { is_open } = req.body;
      const result = await adminService.toggleRestaurant(id, is_open);
      res.status(200).json({ success: true, message: 'Restaurant updated', data: result });
    } catch (err) {
      next(err);
    }
  }

  async getDeliveryPartners(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const partners = await adminService.getAllDeliveryPartners();
      res.status(200).json({ success: true, data: { partners } });
    } catch (err) {
      next(err);
    }
  }

  async getOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await adminService.getAllOrders();
      res.status(200).json({ success: true, data: { orders } });
    } catch (err) {
      next(err);
    }
  }

  async getPayments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payments = await adminService.getAllPayments();
      res.status(200).json({ success: true, data: { payments } });
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
