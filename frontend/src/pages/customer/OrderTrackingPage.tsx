import React, { useState, useEffect } from 'react';
import { Order } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { OrderStatusTimeline } from '../../components/order/OrderStatusTimeline.tsx';
import { LiveTrackingMap } from '../../components/order/LiveTrackingMap.tsx';
import { Button } from '../../components/common/Button.tsx';
import { showToast } from '../../components/common/Toast.tsx';
import { ArrowLeft, Clock, MapPin, Receipt, HelpCircle, XCircle, CheckCircle } from 'lucide-react';

interface OrderTrackingPageProps {
  orderId: number;
  onBack: () => void;
  onOpenSupport: (orderId: number) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orderId,
  onBack,
  onOpenSupport,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const res: any = await api.get(`/orders/${orderId}`);
      if (res.data?.order) {
        setOrder(res.data.order);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Auto poll every 6 seconds to show realistic order progress
    const timer = setInterval(fetchOrder, 6000);
    return () => clearInterval(timer);
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await api.patch(`/orders/${orderId}/status`, {
        status: 'CANCELLED',
        cancellation_reason: 'Cancelled by customer before restaurant confirmation',
      });
      showToast('Order cancelled. Refund initiated.', 'info');
      await fetchOrder();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">Order not found</h3>
        <Button variant="primary" size="sm" className="mt-4" onClick={onBack}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenSupport(order.id)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
            <span>Need Help?</span>
          </button>

          {order.status === 'PLACED' && (
            <Button
              variant="danger"
              size="sm"
              isLoading={cancelling}
              onClick={handleCancelOrder}
              leftIcon={<XCircle className="w-3.5 h-3.5" />}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Primary Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Order #{order.order_number}
              </h2>
              <span className="bg-orange-50 text-orange-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-200">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {new Date(order.placed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} from{' '}
              <strong className="text-slate-700">{order.restaurant_name}</strong>
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6">
            <span className="text-xs text-slate-400 font-medium">Estimated Delivery</span>
            <div className="text-lg font-black text-emerald-600 flex items-center sm:justify-end gap-1.5">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>~25-30 Mins</span>
            </div>
          </div>
        </div>

        {/* Step Timeline */}
        <OrderStatusTimeline status={order.status} />
      </div>

      {/* Live Driver Tracking Map (Active during pickup/delivery) */}
      {(order.status === 'PREPARING' ||
        order.status === 'READY_FOR_PICKUP' ||
        order.status === 'PICKED_UP' ||
        order.status === 'OUT_FOR_DELIVERY') && <LiveTrackingMap order={order} />}

      {/* Delivered Success Banner */}
      {order.status === 'DELIVERED' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-emerald-950 text-base">Order Delivered!</h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                We hope you enjoyed your meal from {order.restaurant_name}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Details & Bill Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <Receipt className="w-4 h-4 text-orange-500" />
          <span>Receipt & Items Breakdown</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {order.items?.map((item) => (
            <div key={item.id} className="py-2.5 flex justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800">
                  {item.quantity}x {item.item_name}
                </span>
                {item.customizations && (
                  <span className="block text-[11px] text-slate-400">{item.customizations}</span>
                )}
              </div>
              <span className="font-bold text-slate-900">₹{item.subtotal}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Item Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>

          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Coupon Discount ({order.coupon_code})</span>
              <span>-₹{order.discount_amount}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>₹{order.delivery_fee}</span>
          </div>

          <div className="flex justify-between">
            <span>Taxes & Platform Fees</span>
            <span>₹{order.tax_amount}</span>
          </div>

          <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-900 text-sm">
            <span>Total Paid ({order.payment_method})</span>
            <span className="text-orange-600">₹{order.total_amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
