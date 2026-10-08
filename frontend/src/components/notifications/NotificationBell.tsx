import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Notification } from '../../types/index.ts';

export const NotificationBell: React.FC<{ onNavigateOrder?: (orderId: number) => void }> = ({
  onNavigateOrder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res: any = await api.get('/notifications');
      if (res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // ignore when not authenticated
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const markAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.is_read) {
      await api.patch(`/notifications/${notif.id}/read`).catch(() => {});
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setIsOpen(false);

    if (notif.link && onNavigateOrder) {
      const match = notif.link.match(/\/orders\/(\d+)/);
      if (match) {
        onNavigateOrder(parseInt(match[1], 10));
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No notifications yet.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                    !n.is_read ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-xs text-slate-900">{n.title}</p>
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
