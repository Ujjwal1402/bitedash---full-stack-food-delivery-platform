import { paymentsRepository, PaymentsRepository } from './payments.repository.ts';
import { ordersRepository } from '../orders/orders.repository.ts';
import { PaymentMethod, PaymentStatus } from '../../../../shared/types/index.ts';
import { AppError } from '../../middleware/error.middleware.ts';

export class PaymentsService {
  constructor(private repo: PaymentsRepository = paymentsRepository) {}

  async getPaymentByOrderId(orderId: number, userId: number, userRole: string) {
    const order = await ordersRepository.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    if (userRole === 'CUSTOMER' && order.user_id !== userId) {
      throw new AppError('Forbidden', 403);
    }

    const payment = await this.repo.findByOrderId(orderId);
    return payment;
  }

  async processPayment(
    orderId: number,
    userId: number,
    paymentMethod: PaymentMethod,
    simulateFailure = false
  ) {
    const order = await ordersRepository.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    if (order.user_id !== userId) throw new AppError('Forbidden', 403);

    const status: PaymentStatus = simulateFailure ? 'FAILED' : 'SUCCESS';
    const gatewayResponse = JSON.stringify({
      provider: paymentMethod === 'UPI' ? 'NPCI_BiteUPI' : 'BitePay_Gateway',
      method: paymentMethod,
      timestamp: new Date().toISOString(),
      code: simulateFailure ? 'ERR_AUTH_DECLINED' : 'AUTH_SUCCESS_200',
    });

    await this.repo.updatePaymentStatus(orderId, status, gatewayResponse);

    return {
      orderId,
      status,
      paymentMethod,
      gatewayResponse,
    };
  }

  async refundPayment(orderId: number) {
    const payment = await this.repo.findByOrderId(orderId);
    if (!payment) throw new AppError('Payment not found for order', 404);

    await this.repo.updatePaymentStatus(
      orderId,
      'REFUNDED',
      JSON.stringify({ refund_id: `REF-${Date.now()}`, refunded_at: new Date().toISOString() })
    );

    return { success: true, message: 'Refund processed successfully' };
  }
}

export const paymentsService = new PaymentsService();
