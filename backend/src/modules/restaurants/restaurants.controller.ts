import { Request, Response, NextFunction } from 'express';
import { restaurantsService } from './restaurants.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class RestaurantsController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string,
        cuisine: req.query.cuisine as string,
        is_pure_veg: req.query.is_pure_veg !== undefined ? req.query.is_pure_veg === 'true' : undefined,
        sort: req.query.sort as string,
      };
      const restaurants = await restaurantsService.getAllRestaurants(filters);
      res.status(200).json({ success: true, data: { restaurants } });
    } catch (err) {
      next(err);
    }
  }

  async getByIdOrSlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrSlug = req.params.idOrSlug;
      const restaurant = await restaurantsService.getRestaurantDetails(idOrSlug);
      res.status(200).json({ success: true, data: { restaurant } });
    } catch (err) {
      next(err);
    }
  }

  async getPartnerProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurant = await restaurantsService.getPartnerRestaurant(req.user!.id);
      res.status(200).json({ success: true, data: { restaurant } });
    } catch (err) {
      next(err);
    }
  }

  async updatePartnerProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await restaurantsService.updatePartnerRestaurant(req.user!.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Restaurant profile updated successfully',
        data: { restaurant: updated },
      });
    } catch (err) {
      next(err);
    }
  }

  async getPartnerAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await restaurantsService.getPartnerAnalytics(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

export const restaurantsController = new RestaurantsController();
