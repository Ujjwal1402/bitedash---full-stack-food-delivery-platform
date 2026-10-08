// BiteDash Shared Request Validators & Schemas

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: 'CUSTOMER' | 'RESTAURANT' | 'DELIVERY';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateOrderRequest {
  restaurant_id: number;
  delivery_address_id: number;
  items: Array<{
    menu_item_id: number;
    quantity: number;
    customizations?: string;
  }>;
  payment_method: 'UPI' | 'CARD' | 'NET_BANKING' | 'COD';
  coupon_code?: string;
  special_instructions?: string;
}

export interface UpdateOrderStatusRequest {
  status:
    | 'PLACED'
    | 'CONFIRMED'
    | 'PREPARING'
    | 'READY_FOR_PICKUP'
    | 'PICKED_UP'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED';
  cancellation_reason?: string;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return phone.trim().length >= 7;
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}
