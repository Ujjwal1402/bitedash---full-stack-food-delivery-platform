import React, { useState } from 'react';
import { useCart } from '../../store/CartContext.tsx';
import { useAuth } from '../../store/AuthContext.tsx';
import { Address, PaymentMethod, Coupon } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { AddressSelector } from '../../components/address/AddressSelector.tsx';
import { PaymentMethodPicker } from '../../components/payment/PaymentMethodPicker.tsx';
import { Button } from '../../components/common/Button.tsx';
import { showToast } from '../../components/common/Toast.tsx';
import { ArrowLeft, Tag, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderPlaced: (orderId: number) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onOrderPlaced }) => {
  const {
    items,
    currentRestaurant,
    subtotal,
    deliveryFee,
    taxAmount,
    discountAmount,
    platformFee,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    clearCart,
  } = useCart();

  const { isAuthenticated } = useAuth();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('UPI');
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleApplyCoupon = async (codeToApply = couponCode) => {
    if (!codeToApply.trim()) return;
    setCouponLoading(true);
    try {
      const res: any = await api.post('/coupons/validate', {
        code: codeToApply.trim(),
        subtotal,
      });
      if (res.data?.coupon) {
        applyCoupon(res.data.coupon);
        showToast(res.data.message || 'Coupon applied!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Invalid coupon code', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentRestaurant) {
      showToast('No restaurant selected', 'error');
      return;
    }
    if (!selectedAddress) {
      showToast('Please select a delivery address', 'error');
      return;
    }
    if (items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderPayload = {
        restaurant_id: currentRestaurant.id,
        delivery_address_id: selectedAddress.id,
        items: items.map((i) => ({
          menu_item_id: i.menu_item_id,
          quantity: i.quantity,
          customizations: i.customizations,
        })),
        payment_method: selectedPayment,
        coupon_code: appliedCoupon ? appliedCoupon.code : undefined,
        special_instructions: specialInstructions.trim() || undefined,
      };

      const res: any = await api.post('/orders', orderPayload);
      const createdOrder = res.data?.order;

      if (createdOrder) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        clearCart();
        showToast('Order placed successfully!', 'success');
        onOrderPlaced(createdOrder.id);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h3 className="text-lg font-bold text-slate-800">Your cart is empty</h3>
        <p className="text-xs text-slate-400 mt-1">Please add items from restaurants to proceed.</p>
        <Button variant="primary" size="sm" className="mt-4" onClick={onBack}>
          Explore Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Secure Checkout</h1>
          <p className="text-xs text-slate-500">Ordering from {currentRestaurant?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Address, Payment, Instructions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Address Selection */}
          <AddressSelector
            selectedAddressId={selectedAddress?.id || null}
            onSelectAddress={(addr) => setSelectedAddress(addr)}
          />

          {/* Payment Method */}
          <PaymentMethodPicker
            selectedMethod={selectedPayment}
            onSelectMethod={(m) => setSelectedPayment(m)}
          />

          {/* Cooking & Delivery Instructions */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-2">
              Delivery & Cooking Instructions
            </h3>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Ring doorbell, leave at door, please make it extra crispy..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Code Section */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-500" />
              <h3 className="font-extrabold text-slate-900 text-sm">Apply Coupon</h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="WELCOME50 / BITELOVE"
                className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl uppercase font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
              <Button
                variant="outline"
                size="sm"
                isLoading={couponLoading}
                onClick={() => handleApplyCoupon()}
              >
                Apply
              </Button>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200">
                <span className="font-bold">Code '{appliedCoupon.code}' applied</span>
                <button
                  onClick={() => applyCoupon(null)}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['WELCOME50', 'BITELOVE', 'FEAST100'].map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setCouponCode(code);
                      handleApplyCoupon(code);
                    }}
                    className="text-[11px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-md"
                  >
                    {code}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
              Order Summary ({items.length} items)
            </h3>

            {/* Items list */}
            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1">
              {items.map((i) => (
                <div key={i.menu_item_id} className="pt-2 first:pt-0 flex justify-between text-xs">
                  <span className="text-slate-800 font-medium">
                    {i.quantity}x {i.name}
                  </span>
                  <span className="font-bold text-slate-900">₹{i.price * i.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
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

              <div className="border-t border-slate-200 pt-3 flex justify-between font-black text-slate-900 text-base">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={placingOrder}
              disabled={!selectedAddress}
              onClick={handlePlaceOrder}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Pay & Place Order · ₹{totalAmount.toFixed(2)}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Safe & Encrypted 256-bit Transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
