import { couponsRepository, CouponsRepository } from './coupons.repository.ts';
import { Coupon } from '../../../../shared/types/index.ts';
import { AppError } from '../../middleware/error.middleware.ts';

export class CouponsService {
  constructor(private repo: CouponsRepository = couponsRepository) {}

  async getActiveCoupons(): Promise<Coupon[]> {
    return await this.repo.getActiveCoupons();
  }

  async validateCoupon(code: string, subtotal: number): Promise<{
    valid: boolean;
    discountAmount: number;
    coupon: Coupon;
    message?: string;
  }> {
    if (!code) throw new AppError('Coupon code is required', 400);

    const coupon = await this.repo.findByCode(code.trim());
    if (!coupon) {
      throw new AppError('Invalid or expired coupon code', 400);
    }

    if (subtotal < Number(coupon.min_order_value)) {
      throw new AppError(
        `This coupon requires a minimum order value of ₹${coupon.min_order_value}`,
        400
      );
    }

    let discount = 0;
    if (coupon.discount_type === 'PERCENTAGE') {
      discount = (subtotal * Number(coupon.discount_value)) / 100;
      if (coupon.max_discount && discount > Number(coupon.max_discount)) {
        discount = Number(coupon.max_discount);
      }
    } else {
      discount = Math.min(Number(coupon.discount_value), subtotal);
    }

    discount = Math.round(discount * 100) / 100;

    return {
      valid: true,
      discountAmount: discount,
      coupon,
      message: `Coupon applied! You saved ₹${discount}`,
    };
  }
}

export const couponsService = new CouponsService();
