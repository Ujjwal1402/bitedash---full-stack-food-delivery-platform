import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './store/AuthContext.tsx';
import { CartProvider } from './store/CartContext.tsx';
import { CurrentView, Restaurant } from './types/index.ts';

// Layout & Common
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { RoleSwitcher } from './components/layout/RoleSwitcher.tsx';
import { ToastContainer } from './components/common/Toast.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { CartDrawer } from './components/cart/CartDrawer.tsx';
import { RestaurantConflictModal } from './components/cart/RestaurantConflictModal.tsx';

// Pages
import { HomePage } from './pages/customer/HomePage.tsx';
import { SearchPage } from './pages/customer/SearchPage.tsx';
import { RestaurantDetailPage } from './pages/customer/RestaurantDetailPage.tsx';
import { CheckoutPage } from './pages/customer/CheckoutPage.tsx';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage.tsx';
import { OrderHistoryPage } from './pages/customer/OrderHistoryPage.tsx';
import { AddressesPage } from './pages/customer/AddressesPage.tsx';
import { SupportPage } from './pages/customer/SupportPage.tsx';

import { PartnerDashboardPage } from './pages/restaurant/PartnerDashboardPage.tsx';
import { PartnerMenuPage } from './pages/restaurant/PartnerMenuPage.tsx';

import { DeliveryDashboardPage } from './pages/delivery/DeliveryDashboardPage.tsx';
import { ActiveDeliveryPage } from './pages/delivery/ActiveDeliveryPage.tsx';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';

function MainApp() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<CurrentView>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [supportInitialOrderId, setSupportInitialOrderId] = useState<number | undefined>(undefined);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Sync initial view when user switches role
  useEffect(() => {
    if (user?.role === 'RESTAURANT') {
      setCurrentView('partner-dashboard');
    } else if (user?.role === 'DELIVERY') {
      setCurrentView('delivery-dashboard');
    } else if (user?.role === 'ADMIN') {
      setCurrentView('admin-dashboard');
    } else {
      // Default customer view
      if (
        currentView === 'partner-dashboard' ||
        currentView === 'partner-menu' ||
        currentView === 'delivery-dashboard' ||
        currentView === 'delivery-active' ||
        currentView === 'admin-dashboard'
      ) {
        setCurrentView('home');
      }
    }
  }, [user?.role]);

  const handleNavigate = (view: CurrentView, data?: any) => {
    if (view === 'order-tracking' && data?.orderId) {
      setSelectedOrderId(data.orderId);
    }
    if (view === 'support' && data?.orderId) {
      setSupportInitialOrderId(data.orderId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('restaurant-detail');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* 1-Click Role Switcher banner across top */}
      <RoleSwitcher
        onNavigateHome={() => {
          if (user?.role === 'RESTAURANT') setCurrentView('partner-dashboard');
          else if (user?.role === 'DELIVERY') setCurrentView('delivery-dashboard');
          else if (user?.role === 'ADMIN') setCurrentView('admin-dashboard');
          else setCurrentView('home');
        }}
      />

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* CUSTOMER PORTAL VIEWS */}
        {currentView === 'home' && (
          <HomePage
            onSelectRestaurant={handleSelectRestaurant}
            onNavigateSearch={() => setCurrentView('search')}
            onOpenAuth={(mode) => {
              setAuthMode(mode);
              setAuthModalOpen(true);
            }}
          />
        )}

        {currentView === 'search' && (
          <SearchPage
            onBack={() => setCurrentView('home')}
            onSelectRestaurant={handleSelectRestaurant}
          />
        )}

        {currentView === 'restaurant-detail' && selectedRestaurant && (
          <RestaurantDetailPage
            restaurantIdOrSlug={selectedRestaurant.id}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBack={() => setCurrentView('home')}
            onOrderPlaced={(orderId) => {
              setSelectedOrderId(orderId);
              setCurrentView('order-tracking');
            }}
          />
        )}

        {currentView === 'order-tracking' && selectedOrderId && (
          <OrderTrackingPage
            orderId={selectedOrderId}
            onBack={() => setCurrentView('order-history')}
            onOpenSupport={(ordId) => {
              setSupportInitialOrderId(ordId);
              setCurrentView('support');
            }}
          />
        )}

        {currentView === 'order-history' && (
          <OrderHistoryPage
            onTrackOrder={(orderId) => {
              setSelectedOrderId(orderId);
              setCurrentView('order-tracking');
            }}
            onExplore={() => setCurrentView('home')}
          />
        )}

        {currentView === 'addresses' && <AddressesPage />}

        {currentView === 'support' && (
          <SupportPage initialOrderId={supportInitialOrderId} />
        )}

        {/* RESTAURANT PARTNER VIEWS */}
        {currentView === 'partner-dashboard' && <PartnerDashboardPage />}
        {currentView === 'partner-menu' && <PartnerMenuPage />}

        {/* DELIVERY PARTNER VIEWS */}
        {currentView === 'delivery-dashboard' && (
          <DeliveryDashboardPage
            onOpenActiveOrder={(orderId) => {
              setSelectedOrderId(orderId);
              setCurrentView('delivery-active');
            }}
          />
        )}

        {currentView === 'delivery-active' && selectedOrderId && (
          <ActiveDeliveryPage
            orderId={selectedOrderId}
            onBack={() => setCurrentView('delivery-dashboard')}
            onDelivered={() => setCurrentView('delivery-dashboard')}
          />
        )}

        {/* ADMIN PORTAL VIEW */}
        {currentView === 'admin-dashboard' && <AdminDashboardPage />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onProceedToCheckout={() => setCurrentView('checkout')}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
      />

      <RestaurantConflictModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
