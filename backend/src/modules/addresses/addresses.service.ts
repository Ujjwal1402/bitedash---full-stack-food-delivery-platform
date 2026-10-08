import { addressesRepository, AddressesRepository } from './addresses.repository.ts';
import { Address } from '../../../../shared/types/index.ts';
import { AppError } from '../../middleware/error.middleware.ts';

export class AddressesService {
  constructor(private repo: AddressesRepository = addressesRepository) {}

  async getUserAddresses(userId: number): Promise<Address[]> {
    return await this.repo.findByUserId(userId);
  }

  async addAddress(userId: number, data: any): Promise<Address> {
    if (!data.address_line1 || !data.city || !data.state || !data.postal_code) {
      throw new AppError('Address line, city, state, and postal code are required', 400);
    }

    const count = (await this.repo.findByUserId(userId)).length;
    const isDefault = data.is_default !== undefined ? data.is_default : count === 0;

    const insertId = await this.repo.createAddress({
      user_id: userId,
      label: data.label || 'Home',
      address_line1: data.address_line1.trim(),
      address_line2: data.address_line2 ? data.address_line2.trim() : null,
      city: data.city.trim(),
      state: data.state.trim(),
      postal_code: data.postal_code.trim(),
      landmark: data.landmark ? data.landmark.trim() : null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      is_default: isDefault,
    });

    const created = await this.repo.findById(insertId);
    return created!;
  }

  async updateAddress(userId: number, id: number, data: Partial<Address>): Promise<Address> {
    const existing = await this.repo.findById(id);
    if (!existing || existing.user_id !== userId) {
      throw new AppError('Address not found', 404);
    }

    await this.repo.updateAddress(id, userId, data);
    return (await this.repo.findById(id))!;
  }

  async deleteAddress(userId: number, id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing || existing.user_id !== userId) {
      throw new AppError('Address not found', 404);
    }
    await this.repo.deleteAddress(id, userId);
  }

  async setDefault(userId: number, id: number): Promise<Address> {
    const existing = await this.repo.findById(id);
    if (!existing || existing.user_id !== userId) {
      throw new AppError('Address not found', 404);
    }
    await this.repo.setDefaultAddress(id, userId);
    return (await this.repo.findById(id))!;
  }
}

export const addressesService = new AddressesService();
