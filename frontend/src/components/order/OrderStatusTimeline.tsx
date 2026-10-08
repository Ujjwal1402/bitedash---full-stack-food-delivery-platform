import React from 'react';
import { OrderStatus } from '../../types/index.ts';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from '../../types/index.ts';
import { Check, Clock, AlertCircle } from 'lucide-react';

export const OrderStatusTimeline: React.FC<{ status: OrderStatus }> = ({ status }) => {
  if (status === 'CANCELLED' || status === 'REFUNDED') {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <h4 className="font-bold text-sm">Order {status}</h4>
          <p className="text-xs text-rose-600">
            {status === 'CANCELLED'
              ? 'This order was cancelled. Any paid amount has been initiated for refund.'
              : 'The amount for this order has been refunded to your original payment method.'}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status as any);

  return (
    <div className="py-2">
      <div className="relative flex items-center justify-between">
        {/* Connecting progress line */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentIndex) / (ORDER_STATUS_FLOW.length - 1)) * 100}%`,
            }}
          />
        </div>

        {ORDER_STATUS_FLOW.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-orange-500 text-white ring-4 ring-orange-100 shadow-md animate-pulse'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>

              <span
                className={`text-[10px] sm:text-xs font-semibold mt-2 text-center max-w-[70px] sm:max-w-[85px] leading-tight ${
                  isCurrent
                    ? 'text-orange-600 font-extrabold'
                    : isDone
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
