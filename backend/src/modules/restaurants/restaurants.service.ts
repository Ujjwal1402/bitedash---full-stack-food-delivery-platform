import { restaurantsRepository, RestaurantsRepository } from './restaurants.repository.ts';
import { Restaurant } from '../../../../shared/types/index.ts';
import { AppError } from '../../middleware/error.middleware.ts';

export class RestaurantsService {
  constructor(private repo: RestaurantsRepository = restaurantsRepository) {}

  async getAllRestaurants(filters: {
    search?: string;
    cuisine?: string;
    is_pure_veg?: boolean;
    sort?: string;
  }): Promise<Restaurant[]> {
    return await this.repo.findAll(filters);
  }

  async getRestaurantDetails(idOrSlug: string | number): Promise<Restaurant> {
    let restaurant: Restaurant | null = null;
    const numId = Number(idOrSlug);

    if (!isNaN(numId) && numId > 0) {
      restaurant = await this.repo.findById(numId);
    } else {
      restaurant = await this.repo.findBySlug(String(idOrSlug));
    }

    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }

    const categories = await this.repo.getMenuCategories(restaurant.id);
    const items = await this.repo.getMenuItems(restaurant.id);

    // Group items into categories
    const categoriesWithItems = categories.map((cat) => ({
      ...cat,
      items: items.filter((item) => item.category_id === cat.id),
    }));

    return {
      ...restaurant,
      categories: categoriesWithItems,
    };
  }

  async getPartnerRestaurant(userId: number): Promise<Restaurant> {
    const restaurant = await this.repo.findByUserId(userId);
    if (!restaurant) {
      throw new AppError('No restaurant associated with this partner account', 404);
    }
    return restaurant;
  }

  async updatePartnerRestaurant(userId: number, data: Partial<Restaurant>): Promise<Restaurant> {
    const restaurant = await this.getPartnerRestaurant(userId);
    await this.repo.updateRestaurant(restaurant.id, data);
    return await this.getRestaurantDetails(restaurant.id);
  }

  async getPartnerAnalytics(userId: number) {
    const restaurant = await this.getPartnerRestaurant(userId);
    const analytics = await this.repo.getRestaurantAnalytics(restaurant.id);
    return {
      restaurant,
      analytics,
    };
  }
}

export const restaurantsService = new RestaurantsService();
