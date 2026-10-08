import React from 'react';
import { Order } from '../../types/index.ts';
import { Phone, Bike, MapPin, Store, Shield } from 'lucide-react';

export const LiveTrackingMap: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
      {/* Route Graphic Simulation */}
      <div className="relative h-56 sm:h-64 bg-slate-900 overflow-hidden flex items-center justify-center p-6">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#f97316 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Simulated Road Route SVG */}
        <svg
          className="w-full h-full absolute inset-0 text-slate-800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 60 180 Q 180 80, 260 140 T 460 70"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 60 180 Q 180 80, 260 140 T 460 70"
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        </svg>

        {/* Origin: Restaurant */}
        <div className="absolute left-8 bottom-12 flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-orange-600 border-2 border-white text-white flex items-center justify-center shadow-lg">
            <Store className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-white bg-slate-800/90 px-2 py-0.5 rounded-md mt-1 border border-slate-700 truncate max-w-[120px]">
            {order.restaurant_name}
          </span>
        </div>

        {/* Moving / Active Rider Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
          <div className="w-12 h-12 rounded-full bg-cyan-500 border-3 border-white text-white flex items-center justify-center shadow-xl ring-8 ring-cyan-500/20">
            <Bike className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold text-slate-900 bg-white px-2 py-0.5 rounded-full mt-1.5 shadow-md">
            {order.delivery_partner_name || 'Delivery Partner'}
          </span>
        </div>

        {/* Destination: Customer Address */}
        <div className="absolute right-8 top-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-white bg-slate-800/90 px-2 py-0.5 rounded-md mt-1 border border-slate-700 truncate max-w-[120px]">
            Your Location
          </span>
        </div>

        {/* Live Status Overlay */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">Live GPS Simulation Active</span>
        </div>
      </div>

      {/* Driver & Delivery Information Card */}
      <div className="p-4 sm:p-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80`}
                alt="Delivery Partner"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  {order.delivery_partner_name || 'Carlos Mendez (Partner)'}
                </h4>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                  ★ 4.9
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {order.delivery_partner_vehicle || 'Motorcycle'} ·{' '}
                {order.delivery_partner_vehicle_number || 'CA-BD-9021'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${order.delivery_partner_phone || '+15550301'}`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>Call Rider</span>
            </a>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
              <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Contactless Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
