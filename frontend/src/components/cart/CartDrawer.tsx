import React from 'react';
import { useCart } from '../../store/CartContext.tsx';
import { useAuth } from '../../store/AuthContext.tsx';
import { DietaryTag } from '../restaurant/DietaryTag.tsx';
import { Button } from '../common/Button.tsx';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onOpenAuth: (mode: 'login') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  onOpenAuth,
}) => {
  const {
    items,
    currentRestaurant,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    taxAmount,
    discountAmount,
    platformFee,
    totalAmount,
    appliedCoupon,
  } = useCart();

  const { isAuthenticated } = useAuth();

  if (!isOpen) return null;

  const minOrder = Number(currentRestaurant?.min_order_amount || 0);
  const isMinOrderMet = subtotal >= minOrder;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Cart</h3>
                {currentRestaurant && (
                  <p className="text-xs text-slate-500 line-clamp-1">{currentRestaurant.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  title="Clear Cart"
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Discover delicious dishes from top restaurants and add them to your cart.
                </p>
                <Button variant="primary" size="sm" className="mt-5" onClick={onClose}>
                  Explore Restaurants
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.menu_item_id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <DietaryTag isVeg={item.is_veg} />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">₹{item.price} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Stepper */}
                    <div className="flex items-center bg-slate-100 rounded-lg text-slate-700 font-bold text-xs">
                      <button
                        onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-slate-200 rounded-l-lg transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-slate-200 rounded-r-lg transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold text-xs text-slate-900 w-14 text-right">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bill Calculation & Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 p-4 sm:p-5 bg-slate-50/70 space-y-3">
              {/* Minimum Order Notice */}
              {!isMinOrderMet && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-xl">
                  Add items worth <strong>₹{minOrder - subtotal}</strong> more to meet the minimum
                  order amount (₹{minOrder}) for this restaurant.
                </div>
              )}

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Savings ({appliedCoupon?.code})</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{platformFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-900 text-sm">
                  <span>To Pay</span>
                  <span className="text-orange-600">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  disabled={!isMinOrderMet}
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Checkout · ₹{totalAmount.toFixed(2)}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  onClick={() => {
                    onClose();
                    onOpenAuth('login');
                  }}
                >
                  Login to Checkout
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
