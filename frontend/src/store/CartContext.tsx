import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Restaurant, Coupon } from '../types/index.ts';
import { PLATFORM_FEE, TAX_PERCENTAGE } from '../types/index.ts';

interface CartContextType {
  items: CartItem[];
  currentRestaurant: Restaurant | null;
  addItem: (item: CartItem, restaurant: Restaurant) => boolean;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon | null) => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  discountAmount: number;
  platformFee: number;
  totalAmount: number;
  conflictModalOpen: boolean;
  pendingItem: { item: CartItem; restaurant: Restaurant } | null;
  resolveConflict: (replace: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bitedash_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(() => {
    const saved = localStorage.getItem('bitedash_cart_restaurant');
    return saved ? JSON.parse(saved) : null;
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Conflict modal when switching restaurants with active items
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<{ item: CartItem; restaurant: Restaurant } | null>(null);

  useEffect(() => {
    localStorage.setItem('bitedash_cart', JSON.stringify(items));
    if (items.length === 0) {
      setCurrentRestaurant(null);
      localStorage.removeItem('bitedash_cart_restaurant');
    } else if (currentRestaurant) {
      localStorage.setItem('bitedash_cart_restaurant', JSON.stringify(currentRestaurant));
    }
  }, [items, currentRestaurant]);

  const addItem = (newItem: CartItem, restaurant: Restaurant): boolean => {
    if (items.length > 0 && currentRestaurant && currentRestaurant.id !== restaurant.id) {
      setPendingItem({ item: newItem, restaurant });
      setConflictModalOpen(true);
      return false;
    }

    if (!currentRestaurant) {
      setCurrentRestaurant(restaurant);
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.menu_item_id === newItem.menu_item_id);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += newItem.quantity;
        return copy;
      }
      return [...prev, newItem];
    });

    return true;
  };

  const resolveConflict = (replace: boolean) => {
    if (replace && pendingItem) {
      setItems([pendingItem.item]);
      setCurrentRestaurant(pendingItem.restaurant);
      setAppliedCoupon(null);
    }
    setPendingItem(null);
    setConflictModalOpen(false);
  };

  const updateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.menu_item_id === menuItemId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (menuItemId: number) => {
    setItems((prev) => prev.filter((item) => item.menu_item_id !== menuItemId));
  };

  const clearCart = () => {
    setItems([]);
    setCurrentRestaurant(null);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: Coupon | null) => {
    setAppliedCoupon(coupon);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deliveryFee = currentRestaurant ? Number(currentRestaurant.delivery_fee) : 0;
  const platformFee = items.length > 0 ? PLATFORM_FEE : 0;

  // Coupon discount
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= Number(appliedCoupon.min_order_value)) {
    if (appliedCoupon.discount_type === 'PERCENTAGE') {
      discountAmount = (subtotal * Number(appliedCoupon.discount_value)) / 100;
      if (appliedCoupon.max_discount && discountAmount > Number(appliedCoupon.max_discount)) {
        discountAmount = Number(appliedCoupon.max_discount);
      }
    } else {
      discountAmount = Math.min(Number(appliedCoupon.discount_value), subtotal);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * TAX_PERCENTAGE * 100) / 100;
  const totalAmount = items.length > 0 ? Math.round((taxableAmount + deliveryFee + taxAmount + platformFee) * 100) / 100 : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        currentRestaurant,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        itemCount,
        subtotal,
        deliveryFee,
        taxAmount,
        discountAmount,
        platformFee,
        totalAmount,
        conflictModalOpen,
        pendingItem,
        resolveConflict,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
