import { db } from '../../config/database.ts';
import { PaymentMethod, PaymentStatus } from '../../../../shared/types/index.ts';

export interface PaymentRecord {
  id: number;
  order_id: number;
  user_id: number;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id: string;
  gateway_response?: string;
  created_at: string;
}

export class PaymentsRepository {
  async findByOrderId(orderId: number): Promise<PaymentRecord | null> {
    return await db.queryOne<PaymentRecord>('SELECT * FROM payments WHERE order_id = ?', [orderId]);
  }

  async updatePaymentStatus(orderId: number, status: PaymentStatus, gatewayResponse?: string): Promise<void> {
    await db.execute(
      'UPDATE payments SET payment_status = ?, gateway_response = ? WHERE order_id = ?',
      [status, gatewayResponse || null, orderId]
    );
    await db.execute(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      [status, orderId]
    );
  }

  async getAllPayments(): Promise<PaymentRecord[]> {
    return await db.query<PaymentRecord>(
      'SELECT p.*, o.order_number, u.name as customer_name FROM payments p JOIN orders o ON p.order_id = o.id JOIN users u ON p.user_id = u.id ORDER BY p.id DESC LIMIT 100'
    );
  }
}

export const paymentsRepository = new PaymentsRepository();
