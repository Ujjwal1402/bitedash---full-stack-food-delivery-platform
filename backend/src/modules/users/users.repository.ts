import { db } from '../../config/database.ts';
import { User } from '../../../../shared/types/index.ts';

export class UsersRepository {
  async findById(id: number): Promise<User | null> {
    return await db.queryOne<User>(
      'SELECT id, name, email, phone, role, avatar_url, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
  }

  async updateUser(id: number, data: { name?: string; phone?: string; avatar_url?: string }): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.phone !== undefined) {
      fields.push('phone = ?');
      values.push(data.phone);
    }
    if (data.avatar_url !== undefined) {
      fields.push('avatar_url = ?');
      values.push(data.avatar_url);
    }

    if (fields.length === 0) return;

    values.push(id);
    await db.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  async getAllUsers(): Promise<User[]> {
    return await db.query<User>(
      'SELECT id, name, email, phone, role, avatar_url, created_at, updated_at FROM users ORDER BY id DESC'
    );
  }
}

export const usersRepository = new UsersRepository();
