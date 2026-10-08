import { db } from '../../config/database.ts';
import { Restaurant, MenuCategory, MenuItem } from '../../../../shared/types/index.ts';

export class RestaurantsRepository {
  async findAll(filters: {
    search?: string;
    cuisine?: string;
    is_pure_veg?: boolean;
    sort?: string;
  }): Promise<Restaurant[]> {
    let sql = 'SELECT * FROM restaurants WHERE 1=1';
    const params: any[] = [];

    if (filters.search) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(cuisines) LIKE ? OR LOWER(description) LIKE ?)';
      const term = `%${filters.search.toLowerCase()}%`;
      params.push(term, term, term);
    }

    if (filters.cuisine) {
      sql += ' AND LOWER(cuisines) LIKE ?';
      params.push(`%${filters.cuisine.toLowerCase()}%`);
    }

    if (filters.is_pure_veg !== undefined) {
      sql += ' AND is_pure_veg = ?';
      params.push(filters.is_pure_veg ? 1 : 0);
    }

    // Sorting
    if (filters.sort === 'rating') {
      sql += ' ORDER BY rating DESC';
    } else if (filters.sort === 'delivery_time') {
      sql += ' ORDER BY delivery_time_min ASC';
    } else if (filters.sort === 'cost_low') {
      sql += ' ORDER BY cost_for_two ASC';
    } else if (filters.sort === 'cost_high') {
      sql += ' ORDER BY cost_for_two DESC';
    } else {
      sql += ' ORDER BY rating DESC, id ASC';
    }

    return await db.query<Restaurant>(sql, params);
  }

  async findById(id: number): Promise<Restaurant | null> {
    return await db.queryOne<Restaurant>('SELECT * FROM restaurants WHERE id = ?', [id]);
  }

  async findBySlug(slug: string): Promise<Restaurant | null> {
    return await db.queryOne<Restaurant>('SELECT * FROM restaurants WHERE slug = ?', [slug]);
  }

  async findByUserId(userId: number): Promise<Restaurant | null> {
    return await db.queryOne<Restaurant>('SELECT * FROM restaurants WHERE user_id = ?', [userId]);
  }

  async getMenuCategories(restaurantId: number): Promise<MenuCategory[]> {
    return await db.query<MenuCategory>(
      'SELECT * FROM menu_categories WHERE restaurant_id = ? AND is_active = 1 ORDER BY display_order ASC',
      [restaurantId]
    );
  }

  async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
    return await db.query<MenuItem>(
      'SELECT m.*, c.name as category_name FROM menu_items m JOIN menu_categories c ON m.category_id = c.id WHERE m.restaurant_id = ? ORDER BY c.display_order ASC, m.id ASC',
      [restaurantId]
    );
  }

  async updateRestaurant(id: number, data: Partial<Restaurant>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    const allowed = [
      'name',
      'description',
      'banner_image',
      'logo_image',
      'cuisines',
      'cost_for_two',
      'delivery_time_min',
      'delivery_fee',
      'min_order_amount',
      'is_pure_veg',
      'is_open',
      'address',
      'city',
    ] as const;

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return;

    values.push(id);
    await db.execute(`UPDATE restaurants SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  async getRestaurantAnalytics(restaurantId: number) {
    const totalOrders = await db.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM orders WHERE restaurant_id = ?',
      [restaurantId]
    );

    const revenueResult = await db.queryOne<{ total: number }>(
      "SELECT SUM(total_amount) as total FROM orders WHERE restaurant_id = ? AND status != 'CANCELLED'",
      [restaurantId]
    );

    const activeOrders = await db.queryOne<{ count: number }>(
      "SELECT COUNT(*) as count FROM orders WHERE restaurant_id = ? AND status IN ('PLACED', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP')",
      [restaurantId]
    );

    return {
      totalOrders: totalOrders?.count || 0,
      totalRevenue: revenueResult?.total || 0,
      activeOrders: activeOrders?.count || 0,
    };
  }
}

export const restaurantsRepository = new RestaurantsRepository();
