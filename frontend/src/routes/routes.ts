import { CurrentView } from '../types/index.ts';

export interface RouteConfig {
  id: CurrentView;
  label: string;
  path: string;
  roleRequired?: 'CUSTOMER' | 'RESTAURANT' | 'DELIVERY' | 'ADMIN';
}

export const APP_ROUTES: RouteConfig[] = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'search', label: 'Search & AI Sommelier', path: '/search' },
  { id: 'restaurant-detail', label: 'Restaurant Menu', path: '/restaurant/:id' },
  { id: 'cart', label: 'Cart', path: '/cart' },
  { id: 'checkout', label: 'Checkout', path: '/checkout', roleRequired: 'CUSTOMER' },
  { id: 'order-tracking', label: 'Live Order Tracking', path: '/orders/:id', roleRequired: 'CUSTOMER' },
  { id: 'order-history', label: 'My Orders', path: '/my-orders', roleRequired: 'CUSTOMER' },
  { id: 'addresses', label: 'Saved Addresses', path: '/addresses', roleRequired: 'CUSTOMER' },
  { id: 'support', label: 'Customer Support', path: '/support' },
  { id: 'partner-dashboard', label: 'Kitchen Queue', path: '/partner/dashboard', roleRequired: 'RESTAURANT' },
  { id: 'partner-menu', label: 'Menu & Stock Manager', path: '/partner/menu', roleRequired: 'RESTAURANT' },
  { id: 'delivery-dashboard', label: 'Delivery Console', path: '/delivery/dashboard', roleRequired: 'DELIVERY' },
  { id: 'delivery-active', label: 'Active Delivery Route', path: '/delivery/active/:id', roleRequired: 'DELIVERY' },
  { id: 'admin-dashboard', label: 'Admin Command Center', path: '/admin', roleRequired: 'ADMIN' },
];
