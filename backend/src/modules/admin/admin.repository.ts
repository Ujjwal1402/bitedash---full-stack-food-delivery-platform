import { db } from '../../config/database.ts';

export class AdminRepository {
  async getPlatformStats() {
    const totalUsers = await db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM users');
    const totalCustomers = await db.queryOne<{ count: number }>("SELECT COUNT(*) as count FROM users WHERE role = 'CUSTOMER'");
    const totalRestaurants = await db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM restaurants');
    const totalDeliveryPartners = await db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM delivery_partners');
    const totalOrders = await db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM orders');
    const deliveredOrders = await db.queryOne<{ count: number }>("SELECT COUNT(*) as count FROM orders WHERE status = 'DELIVERED'");
    const totalGMV = await db.queryOne<{ sum: number }>("SELECT SUM(total_amount) as sum FROM orders WHERE status != 'CANCELLED'");
    const pendingTickets = await db.queryOne<{ count: number }>("SELECT COUNT(*) as count FROM support_tickets WHERE status = 'OPEN'");

    return {
      totalUsers: totalUsers?.count || 0,
      totalCustomers: totalCustomers?.count || 0,
      totalRestaurants: totalRestaurants?.count || 0,
      totalDeliveryPartners: totalDeliveryPartners?.count || 0,
      totalOrders: totalOrders?.count || 0,
      deliveredOrders: deliveredOrders?.count || 0,
      totalGMV: totalGMV?.sum || 0,
      pendingTickets: pendingTickets?.count || 0,
    };
  }

  async getAllUsers() {
    return await db.query(
      'SELECT id, name, email, phone, role, avatar_url, created_at FROM users ORDER BY id DESC'
    );
  }

  async updateUserRole(userId: number, role: string) {
    await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
  }

  async toggleRestaurantStatus(restaurantId: number, isOpen: boolean) {
    await db.execute('UPDATE restaurants SET is_open = ? WHERE id = ?', [isOpen ? 1 : 0, restaurantId]);
  }
}

export const adminRepository = new AdminRepository();
