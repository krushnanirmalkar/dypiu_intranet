import React, { useState } from 'react';
import type { NotificationItem, UserRole } from '../types';
import { AnnouncementSection } from './AnnouncementSection';
import { NotificationPanel } from './NotificationPanel';
import { Megaphone, Bell, HelpCircle, Phone, BookMarked, Calendar } from 'lucide-react';

interface ActivityHubProps {
  notifications: NotificationItem[];
  currentRole: UserRole;
  onMarkAllRead: () => void;
}

export const ActivityHub: React.FC<ActivityHubProps> = ({
  notifications,
  currentRole,
  onMarkAllRead,
}) => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'notifications'>('announcements');

  const unreadCount = notifications.filter(
    (n) => n.targetRoles.includes(currentRole) && !n.isRead
  ).length;

  return (
    <div className="space-y-6">
      {/* Tabbed Activity Feed Card */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-navy-100 bg-navy-50/50 p-1 gap-1">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'announcements'
                ? 'bg-white text-navy-900 shadow-xs border border-navy-200'
                : 'text-navy-600 hover:text-navy-900 hover:bg-white/60'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-navy-800" />
            <span>Notices</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 relative ${
              activeTab === 'notifications'
                ? 'bg-white text-navy-900 shadow-xs border border-navy-200'
                : 'text-navy-600 hover:text-navy-900 hover:bg-white/60'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-navy-800" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-navy-800 text-white text-[10px] font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-1.5">
          {activeTab === 'announcements' ? (
            <AnnouncementSection currentRole={currentRole} />
          ) : (
            <NotificationPanel
              notifications={notifications}
              currentRole={currentRole}
              onMarkAllRead={onMarkAllRead}
            />
          )}
        </div>
      </div>

      {/* Quick Links & Contacts */}
      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm space-y-2.5">
        <h4 className="text-xs font-bold text-navy-900">
          Quick Links
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => alert("Campus IT Helpdesk: support@dypiu.ac.in | Ext: 4040")}
            className="p-2.5 rounded-lg bg-navy-50/70 hover:bg-navy-100 border border-navy-100 flex items-center space-x-2 text-navy-800 font-medium group text-left transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-navy-600 shrink-0" />
            <span className="truncate">IT Support</span>
          </button>

          <button
            onClick={() => alert("Academic Calendar 2026-27: Mid-term exams start March 15.")}
            className="p-2.5 rounded-lg bg-navy-50/70 hover:bg-navy-100 border border-navy-100 flex items-center space-x-2 text-navy-800 font-medium group text-left transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-navy-600 shrink-0" />
            <span className="truncate">Academic Cal.</span>
          </button>

          <button
            onClick={() => alert("Central Library Portal: 45,000+ E-books and IEEE Journals available.")}
            className="p-2.5 rounded-lg bg-navy-50/70 hover:bg-navy-100 border border-navy-100 flex items-center space-x-2 text-navy-800 font-medium group text-left transition-colors"
          >
            <BookMarked className="w-3.5 h-3.5 text-navy-600 shrink-0" />
            <span className="truncate">E-Library</span>
          </button>

          <button
            onClick={() => alert("DYPIU Student FAQs & Guidelines portal opened.")}
            className="p-2.5 rounded-lg bg-navy-50/70 hover:bg-navy-100 border border-navy-100 flex items-center space-x-2 text-navy-800 font-medium group text-left transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-navy-600 shrink-0" />
            <span className="truncate">Help & FAQs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
