import { Request, Response, NextFunction } from 'express';
import { reviewsService } from './reviews.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class ReviewsController {
  async getByRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurantId = parseInt(req.params.restaurantId, 10);
      const reviews = await reviewsService.getRestaurantReviews(restaurantId);
      res.status(200).json({ success: true, data: { reviews } });
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { order_id, rating, comment } = req.body;
      const review = await reviewsService.addReview(
        req.user!.id,
        order_id,
        Number(rating),
        comment
      );
      res.status(201).json({
        success: true,
        message: 'Thank you for your review!',
        data: { review },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const reviewsController = new ReviewsController();
