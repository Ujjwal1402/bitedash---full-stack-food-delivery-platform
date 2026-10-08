import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { Button } from '../../components/common/Button.tsx';
import { showToast } from '../../components/common/Toast.tsx';
import {
  ShieldCheck,
  Users,
  Store,
  Bike,
  DollarSign,
  Package,
  RotateCw,
  HelpCircle,
  CreditCard,
  CheckCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [deliveryPartners, setDeliveryPartners] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'METRICS' | 'USERS' | 'RESTAURANTS' | 'FLEET' | 'ORDERS' | 'TICKETS'>('METRICS');

  const fetchAdminData = async () => {
    try {
      const sRes: any = await api.get('/admin/stats');
      if (sRes.data?.stats) setStats(sRes.data.stats);

      const uRes: any = await api.get('/admin/users');
      if (uRes.data?.users) setUsers(uRes.data.users);

      const rRes: any = await api.get('/admin/restaurants');
      if (rRes.data?.restaurants) setRestaurants(rRes.data.restaurants);

      const dpRes: any = await api.get('/admin/delivery-partners');
      if (dpRes.data?.partners) setDeliveryPartners(dpRes.data.partners);

      const oRes: any = await api.get('/admin/orders');
      if (oRes.data?.orders) setOrders(oRes.data.orders);

      const pRes: any = await api.get('/admin/payments');
      if (pRes.data?.payments) setPayments(pRes.data.payments);

      const tRes: any = await api.get('/support');
      if (tRes.data?.tickets) setTickets(tRes.data.tickets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId: number, nextRole: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: nextRole });
      showToast('User role updated', 'success');
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update role', 'error');
    }
  };

  const handleToggleRestaurant = async (restaurantId: number, currentOpen: boolean) => {
    try {
      await api.patch(`/admin/restaurants/${restaurantId}/toggle`, { is_open: !currentOpen });
      showToast(`Restaurant status updated`, 'success');
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle restaurant', 'error');
    }
  };

  const handleResolveTicket = async (ticketId: number) => {
    try {
      await api.patch(`/support/${ticketId}`, {
        status: 'RESOLVED',
        resolution: 'Issue resolved by Platform Admin via priority support desk.',
      });
      showToast('Ticket marked resolved', 'success');
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to resolve ticket', 'error');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading admin command center...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Admin Command Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Governance & Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">BiteDash Admin Control Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor system health, manage role permissions, moderate restaurant listings, and inspect order ledgers.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchAdminData} leftIcon={<RotateCw className="w-3.5 h-3.5" />}>
          Refresh All
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase">Platform GMV</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">₹{stats?.totalGMV || 0}</h3>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Real transactions</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Orders</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalOrders || 0}</h3>
          <span className="text-[11px] text-blue-600 font-bold mt-1 inline-block">
            {stats?.deliveredOrders || 0} delivered
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Users</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalUsers || 0}</h3>
          <span className="text-[11px] text-orange-600 font-bold mt-1 inline-block">
            {stats?.totalCustomers || 0} customers
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase">Open Tickets</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.pendingTickets || 0}</h3>
          <span className="text-[11px] text-purple-600 font-bold mt-1 inline-block">Customer support</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2">
        {[
          { id: 'METRICS', label: 'Platform Overview' },
          { id: 'USERS', label: `Users (${users.length})` },
          { id: 'RESTAURANTS', label: `Restaurants (${restaurants.length})` },
          { id: 'FLEET', label: `Delivery Fleet (${deliveryPartners.length})` },
          { id: 'ORDERS', label: `Orders Ledger (${orders.length})` },
          { id: 'TICKETS', label: `Support Tickets (${tickets.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: USERS MODERATION */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">User Accounts & RBAC Roles</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5 text-right">Modify Permission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono text-slate-400">#{u.id}</td>
                    <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3.5 text-slate-600">{u.email}</td>
                    <td className="p-3.5 text-slate-500">{u.phone}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="text-xs p-1 border border-slate-200 rounded-lg bg-white cursor-pointer font-medium"
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="RESTAURANT">RESTAURANT</option>
                        <option value="DELIVERY">DELIVERY</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RESTAURANTS MODERATION */}
      {activeTab === 'RESTAURANTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Partner Kitchens Moderation</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Restaurant</th>
                  <th className="p-3.5">Cuisines</th>
                  <th className="p-3.5">City</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {restaurants.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">{r.name}</td>
                    <td className="p-3.5 text-slate-500">{r.cuisines}</td>
                    <td className="p-3.5 text-slate-600">{r.city}</td>
                    <td className="p-3.5 font-bold text-amber-600">★ {r.rating} ({r.rating_count})</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.is_open ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {r.is_open ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant={r.is_open ? 'danger' : 'success'}
                        size="sm"
                        onClick={() => handleToggleRestaurant(r.id, r.is_open)}
                      >
                        {r.is_open ? 'Force Close' : 'Reopen'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FLEET OVERVIEW */}
      {activeTab === 'FLEET' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Delivery Fleet Partners</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Partner Name</th>
                  <th className="p-3.5">Vehicle</th>
                  <th className="p-3.5">License</th>
                  <th className="p-3.5">Total Earnings</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Duty Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveryPartners.map((dp) => (
                  <tr key={dp.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">{dp.name}</td>
                    <td className="p-3.5 text-slate-600">{dp.vehicle_type} ({dp.vehicle_number})</td>
                    <td className="p-3.5 font-mono text-slate-400">{dp.license_number}</td>
                    <td className="p-3.5 font-bold text-emerald-600">₹{dp.total_earnings}</td>
                    <td className="p-3.5 font-bold text-amber-600">★ {dp.rating}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          dp.is_online ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {dp.is_online ? 'Online' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS & PAYMENTS LEDGER */}
      {(activeTab === 'ORDERS' || activeTab === 'METRICS') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Platform Orders & Transactions Ledger</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Order #</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Restaurant</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono font-bold text-slate-800">#{o.order_number}</td>
                    <td className="p-3.5 font-bold text-slate-900">{o.customer_name}</td>
                    <td className="p-3.5 text-slate-700">{o.restaurant_name}</td>
                    <td className="p-3.5 font-black text-slate-900">₹{o.total_amount}</td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-700">{o.payment_method}</span>{' '}
                      <span className="text-[10px] text-emerald-600 font-bold">({o.payment_status})</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">{new Date(o.placed_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SUPPORT TICKETS MODERATION */}
      {activeTab === 'TICKETS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">Customer Support Tickets</h3>
          </div>
          {tickets.map((t) => (
            <div key={t.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-slate-400 font-bold">{t.ticket_number}</span>
                  <h4 className="font-bold text-sm text-slate-900">{t.subject}</h4>
                  <p className="text-xs text-slate-500">From {t.user_name} ({t.user_email})</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {t.status}
                  </span>
                  {t.status !== 'RESOLVED' && (
                    <Button variant="success" size="sm" onClick={() => handleResolveTicket(t.id)}>
                      Resolve Ticket
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">{t.message}</p>
              {t.resolution && (
                <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-2xl">
                  <strong>Resolution:</strong> {t.resolution}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
