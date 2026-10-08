import { db } from '../../config/database.ts';
import { Order, OrderItem, OrderStatus } from '../../../../shared/types/index.ts';

export class OrdersRepository {
  async createOrderInTransaction(
    orderData: {
      order_number: string;
      user_id: number;
      restaurant_id: number;
      delivery_address_id: number;
      status: OrderStatus;
      subtotal: number;
      tax_amount: number;
      delivery_fee: number;
      discount_amount: number;
      coupon_code?: string;
      total_amount: number;
      payment_method: string;
      payment_status: string;
      special_instructions?: string;
      estimated_delivery_time?: string;
    },
    items: Array<{
      menu_item_id: number;
      item_name: string;
      item_price: number;
      quantity: number;
      subtotal: number;
      customizations?: string;
    }>,
    paymentData: {
      transaction_id: string;
      payment_method: string;
      payment_status: string;
    }
  ): Promise<number> {
    return await db.transaction(async (trx) => {
      // 1. Insert Order
      const orderInsert = await trx.execute(
        `INSERT INTO orders
          (order_number, user_id, restaurant_id, delivery_address_id, status, subtotal, tax_amount, delivery_fee, discount_amount, coupon_code, total_amount, payment_method, payment_status, special_instructions, estimated_delivery_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderData.order_number,
          orderData.user_id,
          orderData.restaurant_id,
          orderData.delivery_address_id,
          orderData.status,
          orderData.subtotal,
          orderData.tax_amount,
          orderData.delivery_fee,
          orderData.discount_amount,
          orderData.coupon_code || null,
          orderData.total_amount,
          orderData.payment_method,
          orderData.payment_status,
          orderData.special_instructions || null,
          orderData.estimated_delivery_time || null,
        ]
      );
      const orderId = orderInsert.insertId;

      // 2. Insert Order Items
      for (const item of items) {
        await trx.execute(
          `INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity, subtotal, customizations)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.menu_item_id,
            item.item_name,
            item.item_price,
            item.quantity,
            item.subtotal,
            item.customizations || null,
          ]
        );
      }

      // 3. Insert Payment record
      await trx.execute(
        `INSERT INTO payments (order_id, user_id, amount, payment_method, payment_status, transaction_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          orderData.user_id,
          orderData.total_amount,
          paymentData.payment_method,
          paymentData.payment_status,
          paymentData.transaction_id,
        ]
      );

      return orderId;
    });
  }

  async findById(orderId: number): Promise<Order | null> {
    const order = await db.queryOne<Order>(
      `SELECT o.*,
              u.name as customer_name, u.phone as customer_phone,
              r.name as restaurant_name, r.address as restaurant_address, r.banner_image as restaurant_banner,
              dp_user.name as delivery_partner_name, dp_user.phone as delivery_partner_phone,
              dp.vehicle_type as delivery_partner_vehicle, dp.vehicle_number as delivery_partner_vehicle_number,
              a.address_line1, a.city
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN restaurants r ON o.restaurant_id = r.id
       JOIN addresses a ON o.delivery_address_id = a.id
       LEFT JOIN delivery_partners dp ON o.delivery_partner_id = dp.id
       LEFT JOIN users dp_user ON dp.user_id = dp_user.id
       WHERE o.id = ?`,
      [orderId]
    );

    if (!order) return null;

    const items = await db.query<OrderItem>(
      'SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC',
      [orderId]
    );

    return {
      ...order,
      items,
    };
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const order = await db.queryOne<{ id: number }>('SELECT id FROM orders WHERE order_number = ?', [orderNumber]);
    if (!order) return null;
    return await this.findById(order.id);
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const orders = await db.query<Order>(
      `SELECT o.*, r.name as restaurant_name, r.banner_image as restaurant_banner
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.user_id = ?
       ORDER BY o.id DESC`,
      [userId]
    );

    for (const ord of orders) {
      ord.items = await db.query<OrderItem>(
        'SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC',
        [ord.id]
      );
    }

    return orders;
  }

  async findByRestaurantId(restaurantId: number, statusFilter?: string): Promise<Order[]> {
    let sql = `
      SELECT o.*, u.name as customer_name, u.phone as customer_phone, a.address_line1, a.city
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN addresses a ON o.delivery_address_id = a.id
      WHERE o.restaurant_id = ?
    `;
    const params: any[] = [restaurantId];

    if (statusFilter) {
      sql += ' AND o.status = ?';
      params.push(statusFilter);
    }
    sql += ' ORDER BY o.id DESC';

    const orders = await db.query<Order>(sql, params);
    for (const ord of orders) {
      ord.items = await db.query<OrderItem>(
        'SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC',
        [ord.id]
      );
    }

    return orders;
  }

  async findAllOrders(): Promise<Order[]> {
    const orders = await db.query<Order>(
      `SELECT o.*, u.name as customer_name, r.name as restaurant_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN restaurants r ON o.restaurant_id = r.id
       ORDER BY o.id DESC LIMIT 100`
    );
    return orders;
  }

  async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
    timestampField?: string,
    cancellationReason?: string
  ): Promise<void> {
    let sql = 'UPDATE orders SET status = ?';
    const params: any[] = [status];

    if (timestampField) {
      sql += `, ${timestampField} = CURRENT_TIMESTAMP`;
    }
    if (cancellationReason) {
      sql += ', cancellation_reason = ?';
      params.push(cancellationReason);
    }

    sql += ' WHERE id = ?';
    params.push(orderId);

    await db.execute(sql, params);
  }

  async assignDeliveryPartner(orderId: number, deliveryPartnerId: number): Promise<void> {
    await db.execute(
      'UPDATE orders SET delivery_partner_id = ? WHERE id = ?',
      [deliveryPartnerId, orderId]
    );
  }
}

export const ordersRepository = new OrdersRepository();
