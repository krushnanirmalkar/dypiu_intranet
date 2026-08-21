import React from 'react';
import type { NotificationItem, UserRole } from '../types';
import { Bell, BookOpen, FileCheck, Calendar, Award, ShieldAlert, Check } from 'lucide-react';

interface NotificationPanelProps {
  notifications: NotificationItem[];
  currentRole: UserRole;
  onMarkAllRead: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  currentRole,
  onMarkAllRead,
}) => {
  const roleNotifs = notifications.filter((n) =>
    n.targetRoles.includes(currentRole)
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Academic': return <BookOpen className="w-4 h-4 text-navy-800" />;
      case 'Examination': return <FileCheck className="w-4 h-4 text-navy-800" />;
      case 'Event': return <Calendar className="w-4 h-4 text-navy-800" />;
      case 'Achievement': return <Award className="w-4 h-4 text-navy-800" />;
      default: return <ShieldAlert className="w-4 h-4 text-navy-800" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-navy-800 text-white">
            <Bell className="w-4 h-4" />
          </div>
          <h3 className="text-base font-extrabold text-navy-900">Recent Notifications</h3>
        </div>

        <button
          onClick={onMarkAllRead}
          className="text-xs font-semibold text-navy-700 hover:text-navy-900 flex items-center space-x-1"
        >
          <Check className="w-3 h-3 mr-0.5" />
          <span>Mark read</span>
        </button>
      </div>

      <div className="space-y-3">
        {roleNotifs.map((notif) => (
          <div
            key={notif.id}
            className={`p-3.5 rounded-xl border transition-all ${
              !notif.isRead 
                ? 'bg-navy-50/80 border-navy-300' 
                : 'bg-white border-navy-100'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-white border border-navy-200 shadow-xs mt-0.5">
                {getCategoryIcon(notif.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs font-extrabold text-navy-900">{notif.title}</h4>
                  <span className="text-[10px] text-navy-400 font-medium">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-navy-600 leading-normal">{notif.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
