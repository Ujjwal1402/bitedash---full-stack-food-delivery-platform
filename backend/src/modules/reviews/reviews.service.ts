import { reviewsRepository, ReviewsRepository } from './reviews.repository.ts';
import { ordersRepository } from '../orders/orders.repository.ts';
import { Review } from '../../../../shared/types/index.ts';
import { AppError } from '../../middleware/error.middleware.ts';

export class ReviewsService {
  constructor(private repo: ReviewsRepository = reviewsRepository) {}

  async getRestaurantReviews(restaurantId: number): Promise<Review[]> {
    return await this.repo.findByRestaurantId(restaurantId);
  }

  async addReview(
    userId: number,
    orderId: number,
    rating: number,
    comment?: string
  ): Promise<Review> {
    if (!rating || rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    const order = await ordersRepository.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    if (order.user_id !== userId) {
      throw new AppError('You can only review your own orders', 403);
    }
    if (order.status !== 'DELIVERED') {
      throw new AppError('You can only review delivered orders', 400);
    }

    const existing = await this.repo.findByOrderAndUser(orderId, userId);
    if (existing) {
      throw new AppError('You have already reviewed this order', 400);
    }

    const insertId = await this.repo.createReview({
      user_id: userId,
      restaurant_id: order.restaurant_id,
      order_id: orderId,
      rating,
      comment: comment?.trim(),
    });

    const reviews = await this.repo.findByRestaurantId(order.restaurant_id);
    const created = reviews.find((r) => r.id === insertId);
    return created!;
  }
}

export const reviewsService = new ReviewsService();
