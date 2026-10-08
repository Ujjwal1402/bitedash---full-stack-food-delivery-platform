import React from 'react';
import { Database, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-sm">
                B
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">BiteDash</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Complete full-stack food ordering & hyper-local delivery ecosystem. Built with clean Controller-Service-Repository architecture, real MySQL relational schema, and Gemini AI.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Architecture</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>MySQL 8.0 Relational DB</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>JWT RBAC Auth System</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Google Gemini AI Sommelier</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2">
              <li>Customer Discovery & Live Tracking</li>
              <li>Restaurant Partner Kitchen Queue</li>
              <li>Delivery Fleet Routing & Console</li>
              <li>Platform Administrator Center</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Payment Systems</h4>
            <p className="text-slate-400 text-xs mb-2">
              Enterprise payment gateway abstraction supporting UPI (Instant), Credit/Debit Cards, Net Banking, and Cash on Delivery with full state tracking.
            </p>
            <span className="inline-block bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md text-[10px] font-mono">
              Status: All Systems Operational
            </span>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500">
            © {new Date().getFullYear()} BiteDash Technologies Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-slate-400 font-medium">
            <span>Customer Portal</span>
            <span>·</span>
            <span>Partner Hub</span>
            <span>·</span>
            <span>Driver Connect</span>
            <span>·</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
