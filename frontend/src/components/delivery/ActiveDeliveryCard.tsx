import React from 'react';
import { Order } from '../../types/index.ts';
import { Bike, MapPin, Store, ArrowRight } from 'lucide-react';

interface ActiveDeliveryCardProps {
  order: Order;
  onSelect: (orderId: number) => void;
}

export const ActiveDeliveryCard: React.FC<ActiveDeliveryCardProps> = ({ order, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(order.id)}
      className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-slate-800">#{order.order_number}</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 uppercase">
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <Store className="w-3.5 h-3.5 text-orange-500" />
          <span className="font-bold text-slate-900">{order.restaurant_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-slate-600">{order.customer_name} ({order.city})</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600">
        <span>Open Navigation Route</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
