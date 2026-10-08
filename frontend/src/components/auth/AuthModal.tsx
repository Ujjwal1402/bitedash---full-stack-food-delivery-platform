import React, { useState } from 'react';
import { useAuth } from '../../store/AuthContext.tsx';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { showToast } from '../common/Toast.tsx';
import { DEMO_CREDENTIALS } from '../../types/index.ts';
import { UserRole } from '../../types/index.ts';
import { KeyRound, Mail, Lock, Phone, User, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        showToast('Welcome back to BiteDash!', 'success');
      } else {
        await signup({ name, email, password, phone, role });
        showToast('Account created successfully!', 'success');
      }
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async (demo: (typeof DEMO_CREDENTIALS)[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setLoading(true);
    try {
      await login(demo.email, demo.password);
      showToast(`Logged in as ${demo.label}`, 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Sign in to BiteDash' : 'Create an Account'}
      description={
        mode === 'login'
          ? 'Access your orders, saved addresses, or partner console'
          : 'Join BiteDash as a customer, restaurant partner, or rider'
      }
      maxWidth="md"
    >
      {/* Combined Auth Segmented Tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === 'login'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === 'signup'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Create Account / Sign Up
        </button>
      </div>

      {/* 1-Click Demo Accounts Selector */}
      <div className="mb-6 p-3.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
        <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Quick 1-Click Demo Logins:</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_CREDENTIALS.map((demo) => (
            <button
              key={demo.email}
              type="button"
              onClick={() => handleDemoFill(demo)}
              className="text-left p-2 rounded-lg bg-white hover:bg-orange-100/70 border border-orange-200/80 text-xs transition-colors"
            >
              <span className="font-bold text-slate-800 block truncate">{demo.label}</span>
              <span className="text-[10px] text-slate-400 block truncate">{demo.email}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="+1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="CUSTOMER">Customer (Order Food)</option>
                <option value="RESTAURANT">Restaurant Partner (Manage Kitchen)</option>
                <option value="DELIVERY">Delivery Partner (Deliver Orders)</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="md" className="w-full mt-2" isLoading={loading}>
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-5 text-center text-xs text-slate-500">
        {mode === 'login' ? (
          <span>
            Don't have an account?{' '}
            <button
              onClick={() => setMode('signup')}
              className="font-bold text-orange-600 hover:text-orange-700 underline"
            >
              Sign up
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="font-bold text-orange-600 hover:text-orange-700 underline"
            >
              Sign in
            </button>
          </span>
        )}
      </div>
    </Modal>
  );
};
