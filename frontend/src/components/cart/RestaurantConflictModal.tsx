import React from 'react';
import { useCart } from '../../store/CartContext.tsx';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { AlertTriangle } from 'lucide-react';

export const RestaurantConflictModal: React.FC = () => {
  const { conflictModalOpen, currentRestaurant, pendingItem, resolveConflict } = useCart();

  if (!conflictModalOpen || !pendingItem) return null;

  return (
    <Modal
      isOpen={conflictModalOpen}
      onClose={() => resolveConflict(false)}
      maxWidth="sm"
    >
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900">Replace cart items?</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Your cart currently has items from{' '}
          <strong className="text-slate-800">{currentRestaurant?.name}</strong>. Would you like to
          clear your cart and add dishes from{' '}
          <strong className="text-slate-800">{pendingItem.restaurant.name}</strong>?
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="md"
            className="flex-1"
            onClick={() => resolveConflict(false)}
          >
            Keep Cart
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={() => resolveConflict(true)}
          >
            Start Fresh
          </Button>
        </div>
      </div>
    </Modal>
  );
};
