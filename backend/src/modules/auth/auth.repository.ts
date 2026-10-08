import { db } from '../../config/database.ts';
import { User } from '../../../../shared/types/index.ts';

export class AuthRepository {
  async findByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
    const user = await db.queryOne<(User & { password_hash: string })>(
      'SELECT id, name, email, password_hash, phone, role, avatar_url, created_at FROM users WHERE LOWER(email) = LOWER(?)',
      [email]
    );
    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await db.queryOne<User>(
      'SELECT id, name, email, phone, role, avatar_url, created_at FROM users WHERE id = ?',
      [id]
    );
    return user;
  }

  async createUser(data: {
    name: string;
    email: string;
    password_hash: string;
    phone: string;
    role: string;
    avatar_url?: string;
  }): Promise<number> {
    const res = await db.execute(
      'INSERT INTO users (name, email, password_hash, phone, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
      [data.name, data.email.toLowerCase(), data.password_hash, data.phone, data.role, data.avatar_url || null]
    );
    return res.insertId;
  }
}

export const authRepository = new AuthRepository();
