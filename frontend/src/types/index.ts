export * from '../../../shared/types/index.ts';
export * from '../../../shared/constants/index.ts';
export * from '../../../shared/schemas/index.ts';

export type CurrentView =
  | 'home'
  | 'search'
  | 'restaurant-detail'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'order-history'
  | 'addresses'
  | 'support'
  | 'partner-dashboard'
  | 'partner-menu'
  | 'delivery-dashboard'
  | 'delivery-active'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-restaurants'
  | 'admin-orders';
