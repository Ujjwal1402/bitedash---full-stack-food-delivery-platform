import React, { useState } from 'react';
import { useAuth } from '../../store/AuthContext.tsx';
import { useCart } from '../../store/CartContext.tsx';
import { CurrentView } from '../../types/index.ts';
import {
  ShoppingBag,
  Search,
  MapPin,
  Sparkles,
  LogOut,
  ChevronDown,
  Clock,
  HelpCircle,
  LayoutDashboard,
  UtensilsCrossed,
  Bike,
  Shield,
  User,
} from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell.tsx';

interface NavbarProps {
  currentView: CurrentView;
  onNavigate: (view: CurrentView, data?: any) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenCart,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, subtotal } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-xl tracking-tight">B</span>
              </div>
              <div>
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  BiteDash
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                  Food Platform
                </span>
              </div>
            </button>

            {/* Customer Delivery Location Indicator */}
            {user?.role === 'CUSTOMER' && (
              <button
                onClick={() => onNavigate('addresses')}
                className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span className="font-semibold text-slate-700">Metro City</span>
                <span className="text-slate-400 truncate max-w-[130px]">Emerald Heights</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>

          {/* Navigation Links based on Role */}
          <nav className="hidden lg:flex items-center gap-1">
            {(!user || user.role === 'CUSTOMER') && (
              <>
                <button
                  onClick={() => onNavigate('home')}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                    currentView === 'home'
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Explore Restaurants
                </button>
                <button
                  onClick={() => onNavigate('search')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                    currentView === 'search'
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Search & AI Sommelier</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                    AI
                  </span>
                </button>
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => onNavigate('order-history')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                        currentView === 'order-history' || currentView === 'order-tracking'
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => onNavigate('support')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                        currentView === 'support'
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Support</span>
                    </button>
                  </>
                )}
              </>
            )}

            {user?.role === 'RESTAURANT' && (
              <>
                <button
                  onClick={() => onNavigate('partner-dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                    currentView === 'partner-dashboard'
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Live Kitchen Queue</span>
                </button>
                <button
                  onClick={() => onNavigate('partner-menu')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                    currentView === 'partner-menu'
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Menu & Stock Manager</span>
                </button>
              </>
            )}

            {user?.role === 'DELIVERY' && (
              <>
                <button
                  onClick={() => onNavigate('delivery-dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                    currentView === 'delivery-dashboard'
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Delivery Console</span>
                </button>
              </>
            )}

            {user?.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors ${
                    currentView === 'admin-dashboard'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Platform Command Center</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Icons: Notifications, Cart, Profile */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <NotificationBell onNavigateOrder={(id) => onNavigate('order-tracking', { orderId: id })} />
            )}

            {/* Cart Button (For Customers) */}
            {(!user || user.role === 'CUSTOMER') && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 ? (
                  <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold ml-1">
                    {itemCount} · ₹{subtotal}
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">0</span>
                )}
              </button>
            )}

            {/* Auth Login / User Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover bg-slate-100"
                  />
                  <div className="hidden md:block text-left text-xs">
                    <p className="font-bold text-slate-800 leading-none">{user.name}</p>
                    <p className="text-[10px] text-orange-600 font-semibold tracking-wide uppercase mt-0.5">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{user.email}</p>
                    </div>

                    {user.role === 'CUSTOMER' && (
                      <>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('order-history');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Order History
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('addresses');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          Saved Addresses
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('support');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          Help & Support
                        </button>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                title="Login or Sign Up to BiteDash"
              >
                <User className="w-3.5 h-3.5 text-white" />
                <span>Login / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
