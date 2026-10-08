import { db } from '../../config/database.ts';
import { Review } from '../../../../shared/types/index.ts';

export class ReviewsRepository {
  async findByRestaurantId(restaurantId: number): Promise<Review[]> {
    return await db.query<Review>(
      `SELECT r.*, u.name as user_name, u.avatar_url as user_avatar
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.restaurant_id = ?
       ORDER BY r.id DESC`,
      [restaurantId]
    );
  }

  async findByOrderAndUser(orderId: number, userId: number): Promise<Review | null> {
    return await db.queryOne<Review>(
      'SELECT * FROM reviews WHERE order_id = ? AND user_id = ?',
      [orderId, userId]
    );
  }

  async createReview(data: {
    user_id: number;
    restaurant_id: number;
    order_id: number;
    rating: number;
    comment?: string;
  }): Promise<number> {
    const res = await db.execute(
      'INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [data.user_id, data.restaurant_id, data.order_id, data.rating, data.comment || null]
    );

    // Recalculate restaurant rating
    const stats = await db.queryOne<{ avg_rating: number; total_count: number }>(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total_count FROM reviews WHERE restaurant_id = ?',
      [data.restaurant_id]
    );

    if (stats) {
      await db.execute(
        'UPDATE restaurants SET rating = ?, rating_count = ? WHERE id = ?',
        [Math.round(stats.avg_rating * 10) / 10, stats.total_count, data.restaurant_id]
      );
    }

    return res.insertId;
  }
}

export const reviewsRepository = new ReviewsRepository();
