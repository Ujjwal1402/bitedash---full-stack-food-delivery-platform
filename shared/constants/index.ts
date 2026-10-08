// BiteDash Shared Constants

export const APP_NAME = 'BiteDash';

export const ORDER_STATUS_FLOW = [
  'PLACED',
  'CONFIRMED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PLACED: 'Order Placed',
  CONFIRMED: 'Restaurant Confirmed',
  PREPARING: 'Food is Being Prepared',
  READY_FOR_PICKUP: 'Ready for Pickup',
  PICKED_UP: 'Order Picked Up',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered Successfully',
  CANCELLED: 'Order Cancelled',
  REFUNDED: 'Order Refunded',
};

export const ORDER_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PLACED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  CONFIRMED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  PREPARING: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  READY_FOR_PICKUP: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  PICKED_UP: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  OUT_FOR_DELIVERY: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  DELIVERED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  REFUNDED: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
};

export const TAX_PERCENTAGE = 0.05; // 5% GST/VAT
export const DEFAULT_DELIVERY_FEE = 40.0;
export const PLATFORM_FEE = 5.0;

export const DEMO_CREDENTIALS = [
  { role: 'CUSTOMER', email: 'customer@bitedash.com', password: 'password123', label: 'Customer (Alex)' },
  { role: 'RESTAURANT', email: 'partner@pizzaslice.com', password: 'password123', label: 'Restaurant Partner (Marco - Pizza)' },
  { role: 'DELIVERY', email: 'delivery@bitedash.com', password: 'password123', label: 'Delivery Partner (Carlos)' },
  { role: 'ADMIN', email: 'admin@bitedash.com', password: 'password123', label: 'Platform Admin (Elena)' },
];
