import React, { useState, useEffect } from 'react';
import { Order } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { Button } from '../../components/common/Button.tsx';
import { showToast } from '../../components/common/Toast.tsx';
import {
  ArrowLeft,
  MapPin,
  Store,
  Phone,
  CheckCircle2,
  Navigation,
  Bike,
  PackageCheck,
  Shield,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveDeliveryPageProps {
  orderId: number;
  onBack: () => void;
  onDelivered: () => void;
}

export const ActiveDeliveryPage: React.FC<ActiveDeliveryPageProps> = ({
  orderId,
  onBack,
  onDelivered,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res: any = await api.get(`/orders/${orderId}`);
      if (res.data?.order) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async (nextStatus: string) => {
    setUpdating(true);
    try {
      await api.patch(`/delivery/${orderId}/status`, { status: nextStatus });
      showToast(`Status updated: ${nextStatus.replace(/_/g, ' ')}`, 'success');

      if (nextStatus === 'DELIVERED') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        showToast('Trip completed! ₹50.00 credited to your wallet.', 'success');
        setTimeout(onDelivered, 1500);
      } else {
        await fetchOrder();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update delivery status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading active task route...</div>;
  }

  if (!order) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <h3 className="font-bold text-slate-800 text-sm">Order not found</h3>
        <Button variant="primary" size="sm" className="mt-4" onClick={onBack}>
          Back to Tasks
        </Button>
      </div>
    );
  }

  const isPickedUp =
    order.status === 'PICKED_UP' ||
    order.status === 'OUT_FOR_DELIVERY' ||
    order.status === 'DELIVERED';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Console</span>
        </button>

        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
          Order #{order.order_number}
        </span>
      </div>

      {/* Main Delivery Workflow Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Live Delivery Route</h2>
              <p className="text-xs text-cyan-600 font-bold uppercase tracking-wider">
                Status: {order.status.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          <span className="font-extrabold text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
            Trip Payout: ₹50.00
          </span>
        </div>

        {/* Step 1: Restaurant Pickup */}
        <div
          className={`p-5 rounded-2xl border-2 transition-all ${
            !isPickedUp ? 'border-orange-500 bg-orange-50/30' : 'border-slate-200 bg-slate-50 opacity-80'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  !isPickedUp ? 'bg-orange-500 text-white' : 'bg-slate-300 text-white'
                }`}
              >
                1
              </div>
              <div>
                <span className="text-[11px] font-bold text-orange-600 uppercase">Pickup Stop</span>
                <h4 className="font-extrabold text-slate-900 text-base">{order.restaurant_name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{order.restaurant_address}</p>
              </div>
            </div>

            <a
              href="tel:+15550201"
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-orange-500" />
            </a>
          </div>

          {/* Action to confirm pickup */}
          {!isPickedUp && (
            <div className="mt-4 pt-3 border-t border-orange-200/80 flex items-center justify-between">
              <span className="text-xs text-slate-500">Verify packages with kitchen staff</span>
              <Button
                variant="primary"
                size="md"
                isLoading={updating}
                onClick={() => handleUpdateStatus('PICKED_UP')}
                leftIcon={<PackageCheck className="w-4 h-4" />}
              >
                Confirm Pickup from Restaurant
              </Button>
            </div>
          )}
        </div>

        {/* Step 2: Customer Delivery Dropoff */}
        <div
          className={`p-5 rounded-2xl border-2 transition-all ${
            isPickedUp && order.status !== 'DELIVERED'
              ? 'border-emerald-500 bg-emerald-50/30'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  isPickedUp ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-white'
                }`}
              >
                2
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase">Dropoff Stop</span>
                <h4 className="font-extrabold text-slate-900 text-base">{order.customer_name}</h4>
                <p className="text-xs text-slate-700 font-semibold mt-0.5">{order.address_line1}</p>
                <p className="text-xs text-slate-500">{order.city}</p>
              </div>
            </div>

            <a
              href={`tel:${order.customer_phone || '+15550199'}`}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
            </a>
          </div>

          {order.special_instructions && (
            <div className="mt-3 text-xs bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-200 font-medium">
              Note from customer: {order.special_instructions}
            </div>
          )}

          {/* Action buttons during delivery */}
          {isPickedUp && order.status !== 'DELIVERED' && (
            <div className="mt-4 pt-3 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-2">
              {order.status === 'PICKED_UP' ? (
                <Button
                  variant="primary"
                  size="md"
                  isLoading={updating}
                  onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
                  leftIcon={<Navigation className="w-4 h-4" />}
                >
                  Start Driving to Customer
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="md"
                  isLoading={updating}
                  onClick={() => handleUpdateStatus('DELIVERED')}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Mark Order as Delivered 🎉
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
