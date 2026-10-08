import { db } from '../../config/database.ts';
import { MenuItem, MenuCategory } from '../../../../shared/types/index.ts';

export class MenuRepository {
  async searchItems(query: string, vegOnly?: boolean): Promise<MenuItem[]> {
    let sql = `
      SELECT m.*, r.name as restaurant_name, r.slug as restaurant_slug, r.delivery_time_min, r.delivery_fee, r.rating as restaurant_rating
      FROM menu_items m
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE (LOWER(m.name) LIKE ? OR LOWER(m.description) LIKE ?)
    `;
    const params: any[] = [`%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`];

    if (vegOnly) {
      sql += ' AND m.is_veg = 1';
    }
    sql += ' ORDER BY m.is_best_seller DESC, r.rating DESC LIMIT 30';

    return await db.query<MenuItem>(sql, params);
  }

  async getAllAvailableItems(): Promise<MenuItem[]> {
    return await db.query<MenuItem>(`
      SELECT m.*, r.name as restaurant_name
      FROM menu_items m
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE m.is_available = 1 AND r.is_open = 1
      LIMIT 100
    `);
  }

  async findItemById(id: number): Promise<MenuItem | null> {
    return await db.queryOne<MenuItem>('SELECT * FROM menu_items WHERE id = ?', [id]);
  }

  async createItem(data: {
    restaurant_id: number;
    category_id: number;
    name: string;
    description: string;
    price: number;
    original_price?: number;
    image_url: string;
    is_veg: boolean;
    is_available?: boolean;
    is_best_seller?: boolean;
    preparation_time_min?: number;
  }): Promise<number> {
    const res = await db.execute(
      `INSERT INTO menu_items
        (restaurant_id, category_id, name, description, price, original_price, image_url, is_veg, is_available, is_best_seller, preparation_time_min)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.restaurant_id,
        data.category_id,
        data.name,
        data.description,
        data.price,
        data.original_price || null,
        data.image_url,
        data.is_veg ? 1 : 0,
        data.is_available !== undefined ? (data.is_available ? 1 : 0) : 1,
        data.is_best_seller ? 1 : 0,
        data.preparation_time_min || 15,
      ]
    );
    return res.insertId;
  }

  async updateItem(id: number, data: Partial<MenuItem>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    const allowed = [
      'category_id',
      'name',
      'description',
      'price',
      'original_price',
      'image_url',
      'is_veg',
      'is_available',
      'is_best_seller',
      'preparation_time_min',
    ] as const;

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (typeof data[key] === 'boolean') {
          values.push(data[key] ? 1 : 0);
        } else {
          values.push(data[key]);
        }
      }
    }

    if (fields.length === 0) return;

    values.push(id);
    await db.execute(`UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  async deleteItem(id: number): Promise<void> {
    await db.execute('DELETE FROM menu_items WHERE id = ?', [id]);
  }

  async createCategory(restaurantId: number, name: string, displayOrder = 0): Promise<number> {
    const res = await db.execute(
      'INSERT INTO menu_categories (restaurant_id, name, display_order) VALUES (?, ?, ?)',
      [restaurantId, name, displayOrder]
    );
    return res.insertId;
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await db.execute('DELETE FROM menu_categories WHERE id = ?', [categoryId]);
  }

  async getCategories(restaurantId: number): Promise<MenuCategory[]> {
    return await db.query<MenuCategory>(
      'SELECT * FROM menu_categories WHERE restaurant_id = ? ORDER BY display_order ASC',
      [restaurantId]
    );
  }
}

export const menuRepository = new MenuRepository();
