import { Response, NextFunction } from 'express';
import { addressesService } from './addresses.service.ts';
import { AuthRequest } from '../../middleware/auth.middleware.ts';

export class AddressesController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const addresses = await addressesService.getUserAddresses(req.user!.id);
      res.status(200).json({ success: true, data: { addresses } });
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const address = await addressesService.addAddress(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Address added successfully',
        data: { address },
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const address = await addressesService.updateAddress(req.user!.id, id, req.body);
      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: { address },
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await addressesService.deleteAddress(req.user!.id, id);
      res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async setDefault(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const address = await addressesService.setDefault(req.user!.id, id);
      res.status(200).json({
        success: true,
        message: 'Default address updated',
        data: { address },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const addressesController = new AddressesController();
