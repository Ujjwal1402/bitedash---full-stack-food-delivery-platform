import { db } from '../../config/database.ts';
import { Address } from '../../../../shared/types/index.ts';

export class AddressesRepository {
  async findByUserId(userId: number): Promise<Address[]> {
    return await db.query<Address>(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC',
      [userId]
    );
  }

  async findById(id: number): Promise<Address | null> {
    return await db.queryOne<Address>('SELECT * FROM addresses WHERE id = ?', [id]);
  }

  async createAddress(data: Omit<Address, 'id' | 'created_at'>): Promise<number> {
    if (data.is_default) {
      await db.execute('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [data.user_id]);
    }

    const res = await db.execute(
      `INSERT INTO addresses
        (user_id, label, address_line1, address_line2, city, state, postal_code, landmark, latitude, longitude, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.label,
        data.address_line1,
        data.address_line2 || null,
        data.city,
        data.state,
        data.postal_code,
        data.landmark || null,
        data.latitude || null,
        data.longitude || null,
        data.is_default ? 1 : 0,
      ]
    );
    return res.insertId;
  }

  async updateAddress(id: number, userId: number, data: Partial<Address>): Promise<void> {
    if (data.is_default) {
      await db.execute('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    }

    const fields: string[] = [];
    const values: any[] = [];

    const allowed = [
      'label',
      'address_line1',
      'address_line2',
      'city',
      'state',
      'postal_code',
      'landmark',
      'latitude',
      'longitude',
      'is_default',
    ] as const;

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (typeof data[key] === 'boolean') {
          values.push(data[key] ? 1 : 0);
        } else {
          values.push(data[key]);
        }
      }
    }

    if (fields.length === 0) return;

    values.push(id, userId);
    await db.execute(`UPDATE addresses SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values);
  }

  async deleteAddress(id: number, userId: number): Promise<void> {
    await db.execute('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
  }

  async setDefaultAddress(id: number, userId: number): Promise<void> {
    await db.execute('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    await db.execute('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?', [id, userId]);
  }
}

export const addressesRepository = new AddressesRepository();
