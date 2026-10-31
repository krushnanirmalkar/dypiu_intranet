import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  ArrowLeft,
  Calendar,
  AlertCircle,
  GraduationCap,
  Info,
  Check,
  X
} from 'lucide-react';
import type { NotificationItem } from '../types';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onBack?: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkAllRead,
  onBack
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'academic' | 'campus'>('all');
  const [localItems, setLocalItems] = useState<NotificationItem[]>(notifications);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const getCategoryBadgeStyle = (category?: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('urgent') || cat.includes('exam')) {
      return 'bg-[#f16136]/10 text-[#f16136] border-[#f16136]/25';
    }
    if (cat.includes('acad')) {
      return 'bg-[#00afef]/10 text-[#00afef] border-[#00afef]/25';
    }
    if (cat.includes('event')) {
      return 'bg-[#faa831]/15 text-[#faa831] border-[#faa831]/30';
    }
    if (cat.includes('achieve')) {
      return 'bg-[#1bb470]/15 text-[#1bb470] border-[#1bb470]/30';
    }
    return 'bg-[#393678]/10 text-[#393678] border-[#393678]/25';
  };

  // Sync if prop updates
  React.useEffect(() => {
    setLocalItems(notifications);
  }, [notifications]);

  const handleMarkItemRead = (id: string) => {
    setLocalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const handleMarkAll = () => {
    setLocalItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    onMarkAllRead?.();
  };

  const filteredItems = localItems.filter((item) => {
    if (filter === 'unread') return !item.isRead;
    if (filter === 'academic') {
      const cat = (item.category || '').toLowerCase();
      return cat.includes('acad') || cat.includes('exam');
    }
    if (filter === 'campus') {
      const cat = (item.category || '').toLowerCase();
      return cat.includes('campus') || cat.includes('admin') || cat.includes('event');
    }
    return true;
  });

  const unreadCount = localItems.filter((item) => !item.isRead).length;

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#393678] hover:text-[#00afef] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#00afef] bg-[#00afef]/10 px-2 py-0.5 rounded-full border border-[#00afef]/20">
              <Bell className="w-3 h-3" />
              Portal Alerts
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#393678] font-serif-custom tracking-tight">
            Notifications & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Stay updated with your latest academic deadlines, administrative advisories, and campus communications.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#00afef]/10 hover:bg-[#00afef]/20 text-[#00afef] border border-[#00afef]/30 px-3.5 py-2 text-xs font-bold transition-all cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-xl bg-[#0A1328] hover:bg-[#152347] text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer"
            >
              Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Stats Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { id: 'all', label: 'All Notifications', count: localItems.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'academic', label: 'Academic', count: localItems.filter((i) => (i.category || '').toLowerCase().includes('acad')).length },
            { id: 'campus', label: 'Campus & Admin', count: localItems.filter((i) => !(i.category || '').toLowerCase().includes('acad')).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-[#393678] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    filter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden md:inline shrink-0">
          Showing {filteredItems.length} items
        </span>
      </div>

      {/* Notifications Cards List */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#393678]">All caught up!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You have no {filter === 'unread' ? 'unread notifications' : 'notifications matching this filter'} at the moment.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isAcademic = (item.category || '').toLowerCase().includes('acad');
            const isUrgent = (item.category || '').toLowerCase().includes('urgent') || (item.category || '').toLowerCase().includes('exam');

            return (
              <div
                key={item.id}
                onClick={() => {
                  handleMarkItemRead(item.id);
                  setSelectedNotification(item);
                }}
                className={`p-4 rounded-2xl border transition-all duration-150 flex items-start gap-3.5 cursor-pointer ${
                  !item.isRead
                    ? 'bg-white border-[#00afef]/30 shadow-xs ring-1 ring-[#00afef]/20'
                    : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-2xs'
                }`}
              >
                {/* Notification Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                    isUrgent
                      ? 'bg-[#f16136]/15 text-[#f16136]'
                      : isAcademic
                      ? 'bg-[#00afef]/15 text-[#00afef]'
                      : 'bg-[#393678]/10 text-[#393678]'
                  }`}
                >
                  {isUrgent ? (
                    <AlertCircle className="w-5 h-5 stroke-[2]" />
                  ) : isAcademic ? (
                    <GraduationCap className="w-5 h-5 stroke-[2]" />
                  ) : (
                    <Info className="w-5 h-5 stroke-[2]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-xs sm:text-sm font-bold leading-snug ${
                          !item.isRead ? 'text-[#393678]' : 'text-slate-700'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#f16136] shrink-0" title="Unread" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.timestamp || 'Recent'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                    <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#F1F1F7] text-slate-600 border border-slate-200">
                      {item.category || 'General'}
                    </span>
                    {!item.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkItemRead(item.id);
                        }}
                        className="text-[10px] font-bold text-[#00afef] hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Detail Modal Popup */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs select-none">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header with category badge & close */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider border ${getCategoryBadgeStyle(selectedNotification.category)}`}>
                  {selectedNotification.category || 'Notification'}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {selectedNotification.timestamp || 'Recent'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Notification Title & Meta */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-[#393678] font-serif-custom leading-snug">
                {selectedNotification.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Official Campus Alert · DYPIU Intranet Portal
              </p>
            </div>

            {/* Notification Message Body */}
            <div className="rounded-2xl bg-[#F8F9FC] border border-slate-200/80 p-4 text-xs sm:text-sm font-medium leading-relaxed text-slate-700 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedNotification.message}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="rounded-xl bg-[#0A1328] hover:bg-[#152347] px-5 py-2.5 text-xs font-bold text-white transition cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
