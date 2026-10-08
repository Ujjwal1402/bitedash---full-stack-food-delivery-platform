import { db } from '../../config/database.ts';
import { DeliveryPartner, Order } from '../../../../shared/types/index.ts';

export class DeliveryRepository {
  async findByUserId(userId: number): Promise<DeliveryPartner | null> {
    return await db.queryOne<DeliveryPartner>(
      `SELECT dp.*, u.name, u.phone, u.email
       FROM delivery_partners dp
       JOIN users u ON dp.user_id = u.id
       WHERE dp.user_id = ?`,
      [userId]
    );
  }

  async findById(partnerId: number): Promise<DeliveryPartner | null> {
    return await db.queryOne<DeliveryPartner>(
      `SELECT dp.*, u.name, u.phone, u.email
       FROM delivery_partners dp
       JOIN users u ON dp.user_id = u.id
       WHERE dp.id = ?`,
      [partnerId]
    );
  }

  async toggleOnlineStatus(partnerId: number, isOnline: boolean): Promise<void> {
    await db.execute('UPDATE delivery_partners SET is_online = ? WHERE id = ?', [isOnline ? 1 : 0, partnerId]);
  }

  async updateLocation(partnerId: number, lat: number, lng: number): Promise<void> {
    await db.execute('UPDATE delivery_partners SET current_latitude = ?, current_longitude = ? WHERE id = ?', [lat, lng, partnerId]);
  }

  async addEarnings(partnerId: number, amount: number): Promise<void> {
    await db.execute('UPDATE delivery_partners SET total_earnings = total_earnings + ? WHERE id = ?', [amount, partnerId]);
  }

  async getAvailableOrders(): Promise<Order[]> {
    return await db.query<Order>(
      `SELECT o.*,
              r.name as restaurant_name, r.address as restaurant_address,
              u.name as customer_name, u.phone as customer_phone,
              a.address_line1, a.city
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       JOIN users u ON o.user_id = u.id
       JOIN addresses a ON o.delivery_address_id = a.id
       WHERE o.delivery_partner_id IS NULL
         AND o.status IN ('CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP')
       ORDER BY o.id ASC`
    );
  }

  async getActiveOrdersForPartner(partnerId: number): Promise<Order[]> {
    return await db.query<Order>(
      `SELECT o.*,
              r.name as restaurant_name, r.address as restaurant_address, r.banner_image as restaurant_banner,
              u.name as customer_name, u.phone as customer_phone,
              a.address_line1, a.address_line2, a.city, a.landmark
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       JOIN users u ON o.user_id = u.id
       JOIN addresses a ON o.delivery_address_id = a.id
       WHERE o.delivery_partner_id = ?
         AND o.status IN ('CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY')
       ORDER BY o.id DESC`,
      [partnerId]
    );
  }

  async getDeliveryHistory(partnerId: number): Promise<Order[]> {
    return await db.query<Order>(
      `SELECT o.*,
              r.name as restaurant_name,
              u.name as customer_name,
              a.address_line1, a.city
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       JOIN users u ON o.user_id = u.id
       JOIN addresses a ON o.delivery_address_id = a.id
       WHERE o.delivery_partner_id = ?
         AND o.status = 'DELIVERED'
       ORDER BY o.id DESC LIMIT 50`,
      [partnerId]
    );
  }

  async getAllPartners(): Promise<DeliveryPartner[]> {
    return await db.query<DeliveryPartner>(
      `SELECT dp.*, u.name, u.email, u.phone
       FROM delivery_partners dp
       JOIN users u ON dp.user_id = u.id
       ORDER BY dp.id DESC`
    );
  }
}

export const deliveryRepository = new DeliveryRepository();
