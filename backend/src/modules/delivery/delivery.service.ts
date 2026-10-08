import { deliveryRepository, DeliveryRepository } from './delivery.repository.ts';
import { ordersRepository } from '../orders/orders.repository.ts';
import { notificationsRepository } from '../notifications/notifications.repository.ts';
import { DeliveryPartner, Order, OrderStatus } from '../../../../shared/types/index.ts';
import { AppError } from '../../middleware/error.middleware.ts';

export class DeliveryService {
  constructor(private repo: DeliveryRepository = deliveryRepository) {}

  async getPartnerByUserId(userId: number): Promise<DeliveryPartner> {
    const partner = await this.repo.findByUserId(userId);
    if (!partner) {
      throw new AppError('Delivery partner account not found', 404);
    }
    return partner;
  }

  async toggleStatus(userId: number, isOnline: boolean): Promise<DeliveryPartner> {
    const partner = await this.getPartnerByUserId(userId);
    await this.repo.toggleOnlineStatus(partner.id, isOnline);
    return await this.getPartnerByUserId(userId);
  }

  async getAvailableDeliveries(userId: number): Promise<Order[]> {
    const partner = await this.getPartnerByUserId(userId);
    if (!partner.is_online) {
      throw new AppError('You must be online to view available delivery tasks', 400);
    }
    return await this.repo.getAvailableOrders();
  }

  async acceptOrder(userId: number, orderId: number): Promise<Order> {
    const partner = await this.getPartnerByUserId(userId);
    const order = await ordersRepository.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.delivery_partner_id) {
      throw new AppError('Order has already been assigned to another delivery partner', 400);
    }

    await ordersRepository.assignDeliveryPartner(orderId, partner.id);

    // Notify customer
    await notificationsRepository.createNotification({
      user_id: order.user_id,
      title: 'Delivery Partner Assigned 🛵',
      message: `${partner.name || 'Your rider'} has accepted your order #${order.order_number} and is heading to the restaurant.`,
      type: 'DELIVERY',
      link: `/orders/${orderId}`,
    });

    return (await ordersRepository.findById(orderId))!;
  }

  async getActiveDeliveries(userId: number): Promise<Order[]> {
    const partner = await this.getPartnerByUserId(userId);
    return await this.repo.getActiveOrdersForPartner(partner.id);
  }

  async updateDeliveryStatus(userId: number, orderId: number, status: OrderStatus): Promise<Order> {
    const partner = await this.getPartnerByUserId(userId);
    const order = await ordersRepository.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.delivery_partner_id !== partner.id) {
      throw new AppError('You are not assigned to this order', 403);
    }

    let timestampField: string | undefined = undefined;
    if (status === 'PICKED_UP') timestampField = 'picked_up_at';
    if (status === 'OUT_FOR_DELIVERY') timestampField = 'picked_up_at';
    if (status === 'DELIVERED') {
      timestampField = 'delivered_at';
      await this.repo.addEarnings(partner.id, 50.0);
    }

    await ordersRepository.updateOrderStatus(orderId, status, timestampField);

    await notificationsRepository.createNotification({
      user_id: order.user_id,
      title: status === 'DELIVERED' ? 'Order Delivered! 🎉' : `Order ${status.replace(/_/g, ' ')}`,
      message:
        status === 'DELIVERED'
          ? `Your meal from ${order.restaurant_name} has arrived. Enjoy your food!`
          : `Delivery update: Order #${order.order_number} is now ${status.replace(/_/g, ' ').toLowerCase()}.`,
      type: 'DELIVERY',
      link: `/orders/${orderId}`,
    });

    return (await ordersRepository.findById(orderId))!;
  }

  async getHistory(userId: number): Promise<Order[]> {
    const partner = await this.getPartnerByUserId(userId);
    return await this.repo.getDeliveryHistory(partner.id);
  }
}

export const deliveryService = new DeliveryService();
