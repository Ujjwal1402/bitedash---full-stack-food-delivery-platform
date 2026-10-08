import React, { useState, useEffect } from 'react';
import { DeliveryPartner, Order } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { Button } from '../../components/common/Button.tsx';
import { showToast } from '../../components/common/Toast.tsx';
import {
  Bike,
  Power,
  MapPin,
  Store,
  DollarSign,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface DeliveryDashboardProps {
  onOpenActiveOrder: (orderId: number) => void;
}

export const DeliveryDashboardPage: React.FC<DeliveryDashboardProps> = ({
  onOpenActiveOrder,
}) => {
  const [partner, setPartner] = useState<DeliveryPartner | null>(null);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [history, setHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  const fetchDeliveryData = async () => {
    try {
      const pRes: any = await api.get('/delivery/profile');
      if (pRes.data?.partner) {
        setPartner(pRes.data.partner);
      }

      const actRes: any = await api.get('/delivery/active');
      if (actRes.data?.orders) {
        setActiveOrders(actRes.data.orders);
      }

      const avRes: any = await api.get('/delivery/available');
      if (avRes.data?.orders) {
        setAvailableOrders(avRes.data.orders);
      }

      const histRes: any = await api.get('/delivery/history');
      if (histRes.data?.orders) {
        setHistory(histRes.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryData();
    const interval = setInterval(fetchDeliveryData, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleOnline = async () => {
    if (!partner) return;
    try {
      const nextOnline = !partner.is_online;
      const res: any = await api.patch('/delivery/toggle-online', { is_online: nextOnline });
      setPartner(res.data?.partner);
      showToast(`You are now ${nextOnline ? 'ONLINE and receiving delivery requests' : 'OFFLINE'}`, 'info');
      fetchDeliveryData();
    } catch (err: any) {
      showToast(err.message || 'Status toggle failed', 'error');
    }
  };

  const handleAcceptOrder = async (orderId: number) => {
    setAcceptingId(orderId);
    try {
      await api.post(`/delivery/accept/${orderId}`);
      showToast('Order accepted! Navigating to pickup...', 'success');
      onOpenActiveOrder(orderId);
    } catch (err: any) {
      showToast(err.message || 'Failed to accept order', 'error');
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading delivery partner console...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Partner Header & Duty Switch */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Bike className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{partner?.name}</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                ★ {partner?.rating} ({partner?.rating_count} deliveries)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Vehicle: {partner?.vehicle_type} · {partner?.vehicle_number}
            </p>
          </div>
        </div>

        {/* Online / Offline Button */}
        <button
          onClick={handleToggleOnline}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-xs ${
            partner?.is_online
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{partner?.is_online ? 'Duty: ONLINE' : 'Duty: OFFLINE'}</span>
        </button>
      </div>

      {/* Earnings & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Earnings</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">₹{partner?.total_earnings}</h3>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
            +₹50 per delivery completed
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-400 font-semibold uppercase">Active Orders</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{activeOrders.length}</h3>
          <span className="text-[11px] text-cyan-600 font-bold mt-1 inline-block">
            In progress right now
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-400 font-semibold uppercase">Available Tasks</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{availableOrders.length}</h3>
          <span className="text-[11px] text-orange-600 font-bold mt-1 inline-block">
            Ready in your radius
          </span>
        </div>
      </div>

      {/* Ongoing Assigned Delivery Banner */}
      {activeOrders.length > 0 && (
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-3xl p-6 shadow-lg shadow-cyan-600/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Assigned Active Order
            </span>
            <h3 className="text-xl font-black mt-2">
              Deliver to {activeOrders[0].customer_name} (#{activeOrders[0].order_number})
            </h3>
            <p className="text-xs text-cyan-100 mt-1">
              Pick up from: {activeOrders[0].restaurant_name} · Status: {activeOrders[0].status.replace(/_/g, ' ')}
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            className="bg-white text-cyan-900 hover:bg-slate-100"
            onClick={() => onOpenActiveOrder(activeOrders[0].id)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Open Active Route
          </Button>
        </div>
      )}

      {/* Available Orders Pool */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">
            Available Orders for Pickup ({availableOrders.length})
          </h3>
          {!partner?.is_online && (
            <span className="text-xs text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Turn Duty Online to Accept
            </span>
          )}
        </div>

        {availableOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No unassigned orders right now.</p>
            <p className="text-xs text-slate-400 mt-0.5">As soon as customers order, trips will show up here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="font-mono font-bold text-xs text-slate-800">
                      #{order.order_number}
                    </span>
                    <span className="font-extrabold text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Payout: ₹50.00
                    </span>
                  </div>

                  {/* Pickup & Drop Points */}
                  <div className="space-y-2 mt-3 text-xs">
                    <div className="flex items-start gap-2">
                      <Store className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">{order.restaurant_name}</span>
                        <span className="text-slate-500 text-[11px]">{order.restaurant_address}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">{order.customer_name}</span>
                        <span className="text-slate-500 text-[11px]">
                          {order.address_line1}, {order.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  disabled={!partner?.is_online}
                  isLoading={acceptingId === order.id}
                  onClick={() => handleAcceptOrder(order.id)}
                  className="w-full"
                >
                  Accept Delivery Task
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Trip History */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900">
          Completed Trips History ({history.length})
        </h3>
        {history.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {history.map((h) => (
              <div key={h.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">Order #{h.order_number}</span>
                  <p className="text-slate-500 text-[11px]">
                    Delivered from {h.restaurant_name} to {h.customer_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 block">+₹50.00</span>
                  <span className="text-[10px] text-slate-400">Delivered</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
