import { Request, Response, NextFunction } from 'express';
import { couponsService } from './coupons.service.ts';

export class CouponsController {
  async getActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupons = await couponsService.getActiveCoupons();
      res.status(200).json({ success: true, data: { coupons } });
    } catch (err) {
      next(err);
    }
  }

  async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, subtotal } = req.body;
      const result = await couponsService.validateCoupon(code, Number(subtotal) || 0);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const couponsController = new CouponsController();
