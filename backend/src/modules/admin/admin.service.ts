import { adminRepository, AdminRepository } from './admin.repository.ts';
import { ordersRepository } from '../orders/orders.repository.ts';
import { restaurantsRepository } from '../restaurants/restaurants.repository.ts';
import { deliveryRepository } from '../delivery/delivery.repository.ts';
import { paymentsRepository } from '../payments/payments.repository.ts';

export class AdminService {
  constructor(private repo: AdminRepository = adminRepository) {}

  async getDashboardStats() {
    const stats = await this.repo.getPlatformStats();
    return stats;
  }

  async getAllUsers() {
    return await this.repo.getAllUsers();
  }

  async updateUserRole(userId: number, role: string) {
    await this.repo.updateUserRole(userId, role);
    return { success: true };
  }

  async getAllRestaurants() {
    return await restaurantsRepository.findAll({});
  }

  async toggleRestaurant(restaurantId: number, isOpen: boolean) {
    await this.repo.toggleRestaurantStatus(restaurantId, isOpen);
    return { success: true };
  }

  async getAllDeliveryPartners() {
    return await deliveryRepository.getAllPartners();
  }

  async getAllOrders() {
    return await ordersRepository.findAllOrders();
  }

  async getAllPayments() {
    return await paymentsRepository.getAllPayments();
  }
}

export const adminService = new AdminService();
