import React, { useState, useEffect } from 'react';
import { Order, Restaurant } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { Button } from '../../components/common/Button.tsx';
import { showToast } from '../../components/common/Toast.tsx';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle,
  AlertTriangle,
  RotateCw,
  TrendingUp,
  DollarSign,
  Package,
} from 'lucide-react';

export const PartnerDashboardPage: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'ALL'>('ACTIVE');

  const fetchData = async () => {
    try {
      const pRes: any = await api.get('/restaurants/partner/profile');
      if (pRes.data?.restaurant) {
        setRestaurant(pRes.data.restaurant);
      }

      const ordRes: any = await api.get('/orders/restaurant-orders');
      if (ordRes.data?.orders) {
        setOrders(ordRes.data.orders);
      }

      const analRes: any = await api.get('/restaurants/partner/analytics');
      if (analRes.data?.analytics) {
        setAnalytics(analRes.data.analytics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: number, nextStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: nextStatus });
      showToast(`Order status updated to ${nextStatus}`, 'success');
      await fetchData();
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStoreOpen = async () => {
    if (!restaurant) return;
    try {
      const nextOpen = !restaurant.is_open;
      await api.put('/restaurants/partner/profile', { is_open: nextOpen });
      setRestaurant({ ...restaurant, is_open: nextOpen });
      showToast(`Kitchen is now ${nextOpen ? 'OPEN and accepting orders' : 'CLOSED'}`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to update store status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Loading restaurant partner dashboard...
      </div>
    );
  }

  const activeOrders = orders.filter(
    (o) =>
      o.status === 'PLACED' ||
      o.status === 'CONFIRMED' ||
      o.status === 'PREPARING' ||
      o.status === 'READY_FOR_PICKUP'
  );

  const displayedOrders = activeTab === 'ACTIVE' ? activeOrders : orders;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Restaurant Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">{restaurant?.name}</h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                restaurant?.is_open
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {restaurant?.is_open ? 'Kitchen Open' : 'Kitchen Closed'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Partner Control Center · {restaurant?.address}, {restaurant?.city}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={restaurant?.is_open ? 'outline' : 'success'}
            size="sm"
            onClick={handleToggleStoreOpen}
          >
            {restaurant?.is_open ? 'Pause Incoming Orders' : 'Go Live / Open Kitchen'}
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchData} leftIcon={<RotateCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Queue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{activeOrders.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{analytics?.totalOrders || orders.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Revenue Earned</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">₹{analytics?.totalRevenue || 0}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'ACTIVE'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Live Kitchen Queue ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Orders ({orders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
            <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No orders in this queue.</p>
            <p className="text-xs text-slate-400 mt-0.5">Incoming orders will appear here in real-time.</p>
          </div>
        ) : (
          displayedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      Order #{order.order_number}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Customer: <strong className="text-slate-800">{order.customer_name}</strong> ({order.customer_phone}) · {order.address_line1}, {order.city}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Bill</span>
                  <p className="text-base font-black text-slate-900">₹{order.total_amount}</p>
                </div>
              </div>

              {/* Items in order */}
              <div className="bg-slate-50 rounded-2xl p-4 divide-y divide-slate-200/60 text-xs">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-2 first:pt-0 last:pb-0 flex justify-between">
                    <div>
                      <span className="font-bold text-slate-800">
                        {item.quantity}x {item.item_name}
                      </span>
                      {item.customizations && (
                        <span className="block text-[11px] text-slate-500 italic">
                          Instructions: {item.customizations}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-700">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              {order.special_instructions && (
                <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <strong>Customer Note:</strong> {order.special_instructions}
                </div>
              )}

              {/* Action Buttons for Kitchen Partner */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  Placed at {new Date(order.placed_at).toLocaleTimeString()}
                </span>

                <div className="flex items-center gap-2">
                  {order.status === 'PLACED' && (
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        isLoading={updatingId === order.id}
                        onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={updatingId === order.id}
                        onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                      >
                        Accept Order
                      </Button>
                    </>
                  )}

                  {order.status === 'CONFIRMED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={updatingId === order.id}
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                    >
                      Start Food Preparation 🍳
                    </Button>
                  )}

                  {order.status === 'PREPARING' && (
                    <Button
                      variant="success"
                      size="sm"
                      isLoading={updatingId === order.id}
                      onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                    >
                      Mark Ready for Pickup 📦
                    </Button>
                  )}

                  {order.status === 'READY_FOR_PICKUP' && (
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl">
                      Waiting for Delivery Partner to pick up
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
