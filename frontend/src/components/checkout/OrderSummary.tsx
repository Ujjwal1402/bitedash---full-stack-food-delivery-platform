import React from 'react';
import { CartItem } from '../../types/index.ts';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  discountAmount: number;
  platformFee: number;
  totalAmount: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  deliveryFee,
  taxAmount,
  discountAmount,
  platformFee,
  totalAmount,
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-2 border-b border-slate-100 pb-3 max-h-52 overflow-y-auto">
        {items.map((item) => (
          <div key={item.menu_item_id} className="flex justify-between items-center text-xs">
            <span className="text-slate-700">
              <span className="font-bold text-slate-900">{item.quantity}x</span> {item.name}
            </span>
            <span className="font-semibold text-slate-900">
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Item Total</span>
          <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Partner Fee</span>
          <span className="font-semibold text-slate-900">
            {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Platform Fee</span>
          <span className="font-semibold text-slate-900">₹{platformFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Govt Taxes & Charges</span>
          <span className="font-semibold text-slate-900">₹{taxAmount.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Coupon Discount</span>
            <span>-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-extrabold text-slate-900">
        <span>To Pay</span>
        <span className="text-base text-orange-600">₹{totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
};
