import { menuRepository, MenuRepository } from './menu.repository.ts';
import { restaurantsRepository } from '../restaurants/restaurants.repository.ts';
import { geminiService } from '../../integrations/gemini/gemini.service.ts';
import { MenuItem, MenuCategory } from '../../../../shared/types/index.ts';
import { AppError } from '../../middleware/error.middleware.ts';

export class MenuService {
  constructor(private repo: MenuRepository = menuRepository) {}

  async searchItems(query: string, vegOnly?: boolean): Promise<MenuItem[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return await this.repo.searchItems(query.trim(), vegOnly);
  }

  async aiDiscover(cravingPrompt: string) {
    if (!cravingPrompt || cravingPrompt.trim().length === 0) {
      throw new AppError('Craving prompt is required for AI discovery', 400);
    }

    const allItems = await this.repo.getAllAvailableItems();
    const aiResult = await geminiService.discoverDishes(cravingPrompt, allItems as any);

    // Fetch the full details of recommended items
    const recommendedItemDetails = allItems.filter((item) =>
      aiResult.recommended_items.includes(item.id)
    );

    return {
      explanation: aiResult.explanation,
      pairing: aiResult.suggested_drink_or_pairing,
      items: recommendedItemDetails.length > 0 ? recommendedItemDetails : allItems.slice(0, 3),
    };
  }

  async verifyRestaurantOwnership(userId: number, restaurantId: number): Promise<void> {
    const restaurant = await restaurantsRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }
    if (restaurant.user_id !== userId) {
      throw new AppError('Forbidden. You do not manage this restaurant.', 403);
    }
  }

  async createMenuItem(userId: number, userRole: string, data: any): Promise<MenuItem> {
    if (userRole !== 'ADMIN') {
      await this.verifyRestaurantOwnership(userId, data.restaurant_id);
    }

    const insertId = await this.repo.createItem(data);
    const item = await this.repo.findItemById(insertId);
    return item!;
  }

  async updateMenuItem(userId: number, userRole: string, itemId: number, data: Partial<MenuItem>): Promise<MenuItem> {
    const existing = await this.repo.findItemById(itemId);
    if (!existing) {
      throw new AppError('Menu item not found', 404);
    }

    if (userRole !== 'ADMIN') {
      await this.verifyRestaurantOwnership(userId, existing.restaurant_id);
    }

    await this.repo.updateItem(itemId, data);
    const updated = await this.repo.findItemById(itemId);
    return updated!;
  }

  async toggleAvailability(userId: number, userRole: string, itemId: number): Promise<MenuItem> {
    const existing = await this.repo.findItemById(itemId);
    if (!existing) {
      throw new AppError('Menu item not found', 404);
    }

    if (userRole !== 'ADMIN') {
      await this.verifyRestaurantOwnership(userId, existing.restaurant_id);
    }

    const nextState = !existing.is_available;
    await this.repo.updateItem(itemId, { is_available: nextState });
    const updated = await this.repo.findItemById(itemId);
    return updated!;
  }

  async deleteMenuItem(userId: number, userRole: string, itemId: number): Promise<void> {
    const existing = await this.repo.findItemById(itemId);
    if (!existing) {
      throw new AppError('Menu item not found', 404);
    }

    if (userRole !== 'ADMIN') {
      await this.verifyRestaurantOwnership(userId, existing.restaurant_id);
    }

    await this.repo.deleteItem(itemId);
  }

  async getCategories(restaurantId: number): Promise<MenuCategory[]> {
    return await this.repo.getCategories(restaurantId);
  }

  async createCategory(userId: number, userRole: string, restaurantId: number, name: string): Promise<MenuCategory[]> {
    if (userRole !== 'ADMIN') {
      await this.verifyRestaurantOwnership(userId, restaurantId);
    }
    await this.repo.createCategory(restaurantId, name);
    return await this.repo.getCategories(restaurantId);
  }
}

export const menuService = new MenuService();
