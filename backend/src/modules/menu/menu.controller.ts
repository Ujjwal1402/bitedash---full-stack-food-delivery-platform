import { Request, Response, NextFunction } from 'express';
import { menuService } from './menu.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class MenuController {
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string) || '';
      const veg = req.query.veg === 'true';
      const items = await menuService.searchItems(q, veg);
      res.status(200).json({ success: true, data: { items } });
    } catch (err) {
      next(err);
    }
  }

  async aiDiscover(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt } = req.body;
      const result = await menuService.aiDiscover(prompt);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async createItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await menuService.createMenuItem(req.user!.id, req.user!.role, req.body);
      res.status(201).json({
        success: true,
        message: 'Menu item created successfully',
        data: { item },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await menuService.updateMenuItem(req.user!.id, req.user!.role, id, req.body);
      res.status(200).json({
        success: true,
        message: 'Menu item updated successfully',
        data: { item },
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleAvailability(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await menuService.toggleAvailability(req.user!.id, req.user!.role, id);
      res.status(200).json({
        success: true,
        message: `Item marked as ${item.is_available ? 'available' : 'unavailable'}`,
        data: { item },
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await menuService.deleteMenuItem(req.user!.id, req.user!.role, id);
      res.status(200).json({
        success: true,
        message: 'Menu item deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async createCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { restaurant_id, name } = req.body;
      const categories = await menuService.createCategory(req.user!.id, req.user!.role, restaurant_id, name);
      res.status(201).json({
        success: true,
        message: 'Category created',
        data: { categories },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const menuController = new MenuController();
