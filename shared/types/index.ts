// BiteDash Shared Types

export type UserRole = 'CUSTOMER' | 'RESTAURANT' | 'DELIVERY' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Address {
  id: number;
  user_id: number;
  label: 'Home' | 'Work' | 'Other' | string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_default: boolean;
  created_at?: string;
}

export interface Restaurant {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  description: string;
  banner_image: string;
  logo_image: string;
  cuisines: string;
  rating: number;
  rating_count: number;
  cost_for_two: number;
  delivery_time_min: number;
  delivery_fee: number;
  min_order_amount: number;
  is_pure_veg: boolean;
  is_open: boolean;
  address: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  updated_at?: string;
  categories?: MenuCategory[];
}

export interface MenuCategory {
  id: number;
  restaurant_id: number;
  name: string;
  display_order: number;
  is_active: boolean;
  items?: MenuItem[];
}

export interface MenuItem {
  id: number;
  restaurant_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  image_url: string;
  is_veg: boolean;
  is_available: boolean;
  is_best_seller: boolean;
  preparation_time_min: number;
  category_name?: string;
  restaurant_name?: string;
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'COD';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id?: number;
  order_id?: number;
  menu_item_id: number;
  item_name: string;
  item_price: number;
  quantity: number;
  subtotal: number;
  customizations?: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  restaurant_id: number;
  delivery_partner_id?: number | null;
  delivery_address_id: number;
  status: OrderStatus;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  discount_amount: number;
  coupon_code?: string | null;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  cancellation_reason?: string | null;
  special_instructions?: string | null;
  estimated_delivery_time?: string | null;
  placed_at: string;
  confirmed_at?: string | null;
  preparing_at?: string | null;
  ready_at?: string | null;
  picked_up_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  created_at?: string;
  updated_at?: string;
  // Joins
  customer_name?: string;
  customer_phone?: string;
  restaurant_name?: string;
  restaurant_address?: string;
  restaurant_banner?: string;
  delivery_partner_name?: string;
  delivery_partner_phone?: string;
  delivery_partner_vehicle?: string;
  delivery_partner_vehicle_number?: string;
  address_line1?: string;
  city?: string;
  items?: OrderItem[];
}

export interface DeliveryPartner {
  id: number;
  user_id: number;
  name?: string;
  phone?: string;
  email?: string;
  vehicle_type: 'BICYCLE' | 'BIKE' | 'SCOOTER' | 'EV';
  vehicle_number: string;
  license_number: string;
  is_online: boolean;
  current_latitude?: number | null;
  current_longitude?: number | null;
  total_earnings: number;
  rating: number;
  rating_count: number;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  min_order_value: number;
  max_discount?: number | null;
  is_active: boolean;
}

export interface Review {
  id: number;
  user_id: number;
  restaurant_id: number;
  order_id: number;
  rating: number;
  comment?: string | null;
  user_name?: string;
  user_avatar?: string | null;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'ORDER' | 'PROMO' | 'SYSTEM' | 'DELIVERY';
  is_read: boolean;
  link?: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: number;
  ticket_number: string;
  user_id: number;
  order_id?: number | null;
  subject: string;
  category: 'ORDER_ISSUE' | 'PAYMENT' | 'DELIVERY' | 'REFUND' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  message: string;
  resolution?: string | null;
  created_at: string;
  updated_at?: string;
  user_name?: string;
  user_email?: string;
}

export interface CartItem {
  menu_item_id: number;
  restaurant_id: number;
  name: string;
  price: number;
  image_url: string;
  is_veg: boolean;
  quantity: number;
  customizations?: string;
}
