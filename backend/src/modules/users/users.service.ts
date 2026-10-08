import { usersRepository, UsersRepository } from './users.repository.ts';
import { User } from '../../../../shared/types/index.ts';
import { AppError } from '../../middleware/error.middleware.ts';

export class UsersService {
  constructor(private repo: UsersRepository = usersRepository) {}

  async getProfile(userId: number): Promise<User> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new AppError('User profile not found', 404);
    }
    return user;
  }

  async updateProfile(userId: number, data: { name?: string; phone?: string; avatar_url?: string }): Promise<User> {
    await this.repo.updateUser(userId, data);
    return await this.getProfile(userId);
  }
}

export const usersService = new UsersService();
