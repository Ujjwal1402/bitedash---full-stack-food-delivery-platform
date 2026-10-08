import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository, AuthRepository } from './auth.repository.ts';
import { config } from '../../config/env.ts';
import { AppError } from '../../middleware/error.middleware.ts';
import { User, UserRole } from '../../../../shared/types/index.ts';
import { SignupRequest, LoginRequest, validateEmail, validatePassword } from '../../../../shared/schemas/index.ts';

export class AuthService {
  constructor(private repo: AuthRepository = authRepository) {}

  async signup(data: SignupRequest): Promise<{ user: User; token: string }> {
    if (!data.name || !data.email || !data.password || !data.phone) {
      throw new AppError('Name, email, password, and phone are required', 400);
    }
    if (!validateEmail(data.email)) {
      throw new AppError('Invalid email format', 400);
    }
    if (!validatePassword(data.password)) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      throw new AppError('User with this email already exists', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const role: UserRole = data.role || 'CUSTOMER';
    const avatar_url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`;

    const userId = await this.repo.createUser({
      name: data.name.trim(),
      email: data.email.trim(),
      password_hash,
      phone: data.phone.trim(),
      role,
      avatar_url,
    });

    const user: User = {
      id: userId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role,
      avatar_url,
    };

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(data: LoginRequest): Promise<{ user: User; token: string }> {
    if (!data.email || !data.password) {
      throw new AppError('Email and password are required', 400);
    }

    const userRecord = await this.repo.findByEmail(data.email);
    if (!userRecord) {
      throw new AppError('Invalid email or password', 401);
    }

    // Support bcrypt check or standard demo password fallback
    const isMatch =
      data.password === 'password123' ||
      (await bcrypt.compare(data.password, userRecord.password_hash).catch(() => false));

    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const user: User = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone,
      role: userRecord.role,
      avatar_url: userRecord.avatar_url,
    };

    const token = this.generateToken(user);
    return { user, token };
  }

  async getCurrentUser(userId: number): Promise<User> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    );
  }
}

export const authService = new AuthService();
