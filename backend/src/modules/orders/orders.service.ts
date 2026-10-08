import { ordersRepository, OrdersRepository } from './orders.repository.ts';
import { restaurantsRepository } from '../restaurants/restaurants.repository.ts';
import { menuRepository } from '../menu/menu.repository.ts';
import { couponsRepository } from '../coupons/coupons.repository.ts';
import { notificationsRepository } from '../notifications/notifications.repository.ts';
import { deliveryRepository } from '../delivery/delivery.repository.ts';
import { Order, OrderStatus, UserRole } from '../../../../shared/types/index.ts';
import { CreateOrderRequest } from '../../../../shared/schemas/index.ts';
import { AppError } from '../../middleware/error.middleware.ts';
import { TAX_PERCENTAGE } from '../../../../shared/constants/index.ts';

export class OrdersService {
  constructor(private repo: OrdersRepository = ordersRepository) {}

  async createOrder(userId: number, data: CreateOrderRequest): Promise<Order> {
    if (!data.restaurant_id || !data.delivery_address_id || !data.items || data.items.length === 0) {
      throw new AppError('Restaurant, delivery address, and at least one item are required', 400);
    }

    const restaurant = await restaurantsRepository.findById(data.restaurant_id);
    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }
    if (!restaurant.is_open) {
      throw new AppError('Restaurant is currently closed and not accepting orders', 400);
    }

    // Validate and calculate item prices from real database
    let subtotal = 0;
    const resolvedItems: Array<{
      menu_item_id: number;
      item_name: string;
      item_price: number;
      quantity: number;
      subtotal: number;
      customizations?: string;
    }> = [];

    for (const orderItem of data.items) {
      const dbItem = await menuRepository.findItemById(orderItem.menu_item_id);
      if (!dbItem) {
        throw new AppError(`Item with ID ${orderItem.menu_item_id} not found`, 404);
      }
      if (dbItem.restaurant_id !== restaurant.id) {
        throw new AppError(`Item "${dbItem.name}" does not belong to this restaurant`, 400);
      }
      if (!dbItem.is_available) {
        throw new AppError(`Item "${dbItem.name}" is currently unavailable`, 400);
      }

      const itemPrice = Number(dbItem.price);
      const itemSubtotal = itemPrice * orderItem.quantity;
      subtotal += itemSubtotal;

      resolvedItems.push({
        menu_item_id: dbItem.id,
        item_name: dbItem.name,
        item_price: itemPrice,
        quantity: orderItem.quantity,
        subtotal: itemSubtotal,
        customizations: orderItem.customizations,
      });
    }

    if (subtotal < Number(restaurant.min_order_amount)) {
      throw new AppError(`Minimum order amount for ${restaurant.name} is ₹${restaurant.min_order_amount}`, 400);
    }

    // Coupon discount calculation
    let discountAmount = 0;
    let appliedCouponCode: string | undefined = undefined;

    if (data.coupon_code) {
      const coupon = await couponsRepository.findByCode(data.coupon_code);
      if (coupon && coupon.is_active && subtotal >= Number(coupon.min_order_value)) {
        if (coupon.discount_type === 'PERCENTAGE') {
          discountAmount = (subtotal * Number(coupon.discount_value)) / 100;
          if (coupon.max_discount && discountAmount > Number(coupon.max_discount)) {
            discountAmount = Number(coupon.max_discount);
          }
        } else {
          discountAmount = Math.min(Number(coupon.discount_value), subtotal);
        }
        appliedCouponCode = coupon.code;
      }
    }

    const deliveryFee = Number(restaurant.delivery_fee) || 40;
    const taxAmount = Math.round((subtotal - discountAmount) * TAX_PERCENTAGE * 100) / 100;
    const totalAmount = Math.max(0, Math.round((subtotal - discountAmount + deliveryFee + taxAmount) * 100) / 100);

    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    const transactionId = `TXN-${data.payment_method}-${Date.now().toString().slice(-6)}`;
    const paymentStatus = data.payment_method === 'COD' ? 'PENDING' : 'SUCCESS';

    const orderId = await this.repo.createOrderInTransaction(
      {
        order_number: orderNumber,
        user_id: userId,
        restaurant_id: restaurant.id,
        delivery_address_id: data.delivery_address_id,
        status: 'PLACED',
        subtotal,
        tax_amount: taxAmount,
        delivery_fee: deliveryFee,
        discount_amount: discountAmount,
        coupon_code: appliedCouponCode,
        total_amount: totalAmount,
        payment_method: data.payment_method,
        payment_status: paymentStatus,
        special_instructions: data.special_instructions,
        estimated_delivery_time: new Date(Date.now() + (restaurant.delivery_time_min + 15) * 60000).toISOString(),
      },
      resolvedItems,
      {
        transaction_id: transactionId,
        payment_method: data.payment_method,
        payment_status: paymentStatus,
      }
    );

    // Notify customer
    await notificationsRepository.createNotification({
      user_id: userId,
      title: 'Order Placed! 🍽️',
      message: `Your order #${orderNumber} at ${restaurant.name} has been placed. Waiting for restaurant confirmation.`,
      type: 'ORDER',
      link: `/orders/${orderId}`,
    });

    // Notify restaurant partner
    await notificationsRepository.createNotification({
      user_id: restaurant.user_id,
      title: 'New Order Received! 🔔',
      message: `New incoming order #${orderNumber} for ₹${totalAmount}. Please review and confirm.`,
      type: 'ORDER',
      link: '/restaurant/dashboard',
    });

    const fullOrder = await this.repo.findById(orderId);
    return fullOrder!;
  }

  async getOrderById(orderId: number, userId: number, userRole: UserRole): Promise<Order> {
    const order = await this.repo.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (userRole === 'CUSTOMER' && order.user_id !== userId) {
      throw new AppError('Forbidden. You cannot view this order.', 403);
    }

    if (userRole === 'RESTAURANT') {
      const restaurant = await restaurantsRepository.findByUserId(userId);
      if (!restaurant || order.restaurant_id !== restaurant.id) {
        throw new AppError('Forbidden. This order does not belong to your restaurant.', 403);
      }
    }

    return order;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await this.repo.findByUserId(userId);
  }

  async getRestaurantOrders(userId: number, status?: string): Promise<Order[]> {
    const restaurant = await restaurantsRepository.findByUserId(userId);
    if (!restaurant) {
      throw new AppError('No restaurant found for this account', 404);
    }
    return await this.repo.findByRestaurantId(restaurant.id, status);
  }

  async updateOrderStatus(
    orderId: number,
    newStatus: OrderStatus,
    userId: number,
    userRole: UserRole,
    cancellationReason?: string
  ): Promise<Order> {
    const order = await this.repo.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    let timestampField: string | undefined = undefined;

    // RBAC validation on who can transition what
    if (userRole === 'CUSTOMER') {
      if (newStatus !== 'CANCELLED') {
        throw new AppError('Customers can only cancel unconfirmed orders', 403);
      }
      if (order.status !== 'PLACED') {
        throw new AppError('Orders can only be cancelled while in PLACED status', 400);
      }
      timestampField = 'cancelled_at';
    } else if (userRole === 'RESTAURANT') {
      const restaurant = await restaurantsRepository.findByUserId(userId);
      if (!restaurant || order.restaurant_id !== restaurant.id) {
        throw new AppError('Forbidden. You do not manage this order', 403);
      }
      if (newStatus === 'CONFIRMED') timestampField = 'confirmed_at';
      else if (newStatus === 'PREPARING') timestampField = 'preparing_at';
      else if (newStatus === 'READY_FOR_PICKUP') timestampField = 'ready_at';
      else if (newStatus === 'CANCELLED') timestampField = 'cancelled_at';
      else {
        throw new AppError('Invalid status transition for restaurant partner', 400);
      }
    } else if (userRole === 'DELIVERY') {
      if (newStatus === 'PICKED_UP') timestampField = 'picked_up_at';
      else if (newStatus === 'OUT_FOR_DELIVERY') timestampField = 'picked_up_at';
      else if (newStatus === 'DELIVERED') {
        timestampField = 'delivered_at';
        // Credit delivery partner
        if (order.delivery_partner_id) {
          await deliveryRepository.addEarnings(order.delivery_partner_id, 50.0);
        }
      }
    }

    await this.repo.updateOrderStatus(orderId, newStatus, timestampField, cancellationReason);

    // Notify customer
    await notificationsRepository.createNotification({
      user_id: order.user_id,
      title: `Order Update: ${newStatus}`,
      message: `Your order #${order.order_number} is now ${newStatus.replace(/_/g, ' ')}.`,
      type: 'ORDER',
      link: `/orders/${orderId}`,
    });

    const updated = await this.repo.findById(orderId);
    return updated!;
  }
}

export const ordersService = new OrdersService();
