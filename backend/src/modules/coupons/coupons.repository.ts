import { db } from '../../config/database.ts';
import { Coupon } from '../../../../shared/types/index.ts';

export class CouponsRepository {
  async getActiveCoupons(): Promise<Coupon[]> {
    return await db.query<Coupon>('SELECT * FROM coupons WHERE is_active = 1 ORDER BY id ASC');
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return await db.queryOne<Coupon>('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1', [code]);
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return await db.query<Coupon>('SELECT * FROM coupons ORDER BY id DESC');
  }

  async createCoupon(data: {
    code: string;
    description: string;
    discount_type: string;
    discount_value: number;
    min_order_value: number;
    max_discount?: number;
  }): Promise<number> {
    const res = await db.execute(
      `INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, max_discount, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [
        data.code.toUpperCase(),
        data.description,
        data.discount_type,
        data.discount_value,
        data.min_order_value,
        data.max_discount || null,
      ]
    );
    return res.insertId;
  }
}

export const couponsRepository = new CouponsRepository();
