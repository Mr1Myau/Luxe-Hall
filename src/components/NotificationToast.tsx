import React, { useState, useEffect } from 'react';
import { notificationService, InAppNotification } from '../services/notificationService';
import { Bell, X, CheckCircle, Info } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notice) => {
      setNotifications((prev) => [notice, ...prev.slice(0, 2)]);

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notice.id));
      }, 6000);
    });

    return unsubscribe;
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((notice) => (
        <div
          key={notice.id}
          className="pointer-events-auto bg-[#181B26]/95 border border-[#D4AF37]/50 rounded-xl p-4 shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-in text-white"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/20 text-[#F3D57A] shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-xs font-bold text-white truncate">{notice.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{notice.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">{notice.body}</p>
            </div>

            <button
              onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notice.id))}
              className="text-slate-400 hover:text-white p-1 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
