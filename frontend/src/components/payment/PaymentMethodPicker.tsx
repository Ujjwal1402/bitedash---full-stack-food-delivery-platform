import React from 'react';
import { PaymentMethod } from '../../types/index.ts';
import { Smartphone, CreditCard, Landmark, Banknote, Check } from 'lucide-react';

interface PaymentMethodPickerProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PaymentMethodPicker: React.FC<PaymentMethodPickerProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const methods: Array<{
    id: PaymentMethod;
    name: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: 'UPI',
      name: 'UPI / QR Payment',
      description: 'Google Pay, PhonePe, Paytm, BHIM UPI',
      icon: <Smartphone className="w-5 h-5 text-orange-500" />,
      badge: 'Fastest',
    },
    {
      id: 'CARD',
      name: 'Credit & Debit Cards',
      description: 'Visa, MasterCard, RuPay, Amex',
      icon: <CreditCard className="w-5 h-5 text-blue-500" />,
    },
    {
      id: 'NET_BANKING',
      name: 'Net Banking',
      description: 'All Major Indian Banks & Instant Auth',
      icon: <Landmark className="w-5 h-5 text-purple-500" />,
    },
    {
      id: 'COD',
      name: 'Cash on Delivery',
      description: 'Pay cash or UPI upon delivery at your door',
      icon: <Banknote className="w-5 h-5 text-emerald-500" />,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-4">
        Choose Payment Method
      </h3>

      <div className="space-y-2.5">
        {methods.map((m) => {
          const isSelected = selectedMethod === m.id;
          return (
            <div
              key={m.id}
              onClick={() => onSelectMethod(m.id)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {m.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{m.name}</span>
                    {m.badge && (
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
