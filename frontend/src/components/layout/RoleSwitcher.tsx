import React from 'react';
import { useAuth } from '../../store/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';
import { ShieldCheck, Utensils, Bike, User } from 'lucide-react';
import { showToast } from '../common/Toast.tsx';

interface RoleSwitcherProps {
  onNavigateHome: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onNavigateHome }) => {
  const { user, switchDemoRole, isLoading } = useAuth();

  const roles: Array<{ role: UserRole; label: string; icon: React.ReactNode; color: string }> = [
    { role: 'CUSTOMER', label: 'Customer', icon: <User className="w-3.5 h-3.5" />, color: 'bg-emerald-500' },
    { role: 'RESTAURANT', label: 'Restaurant Partner', icon: <Utensils className="w-3.5 h-3.5" />, color: 'bg-orange-500' },
    { role: 'DELIVERY', label: 'Delivery Partner', icon: <Bike className="w-3.5 h-3.5" />, color: 'bg-cyan-500' },
    { role: 'ADMIN', label: 'Platform Admin', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'bg-indigo-500' },
  ];

  const handleSwitch = async (role: UserRole) => {
    if (user?.role === role) return;
    try {
      await switchDemoRole(role);
      showToast(`Switched view to ${role} role`, 'info');
      onNavigateHome();
    } catch {
      showToast('Failed to switch role', 'error');
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-300">Live Role Preview:</span>
        <span className="text-slate-400 hidden sm:inline">Switch persona to test full end-to-end workflow:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0">
        {roles.map((r) => {
          const isActive = user?.role === r.role;
          return (
            <button
              key={r.role}
              disabled={isLoading}
              onClick={() => handleSwitch(r.role)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${r.color}`} />
              {r.icon}
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
