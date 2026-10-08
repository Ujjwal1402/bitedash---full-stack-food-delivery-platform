import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

let toastListeners: Array<(toasts: ToastItem[]) => void> = [];
let toastState: ToastItem[] = [];

export const showToast = (message: string, type: ToastType = 'info') => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastItem = { id, message, type };
  toastState = [...toastState, newToast];
  toastListeners.forEach((fn) => fn(toastState));

  setTimeout(() => {
    toastState = toastState.filter((t) => t.id !== id);
    toastListeners.forEach((fn) => fn(toastState));
  }, 4000);
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>(toastState);

  useEffect(() => {
    const listener = (newToasts: ToastItem[]) => setToasts(newToasts);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
        };

        const bg = {
          success: 'bg-white border-emerald-200 text-slate-800',
          error: 'bg-white border-rose-200 text-slate-800',
          info: 'bg-white border-blue-200 text-slate-800',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-lg ${bg[toast.type]} transition-all animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className="flex items-center gap-3">
              {icons[toast.type]}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => {
                toastState = toastState.filter((t) => t.id !== toast.id);
                toastListeners.forEach((fn) => fn(toastState));
              }}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
