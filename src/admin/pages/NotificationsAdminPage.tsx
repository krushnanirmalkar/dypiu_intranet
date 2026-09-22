import React, { useEffect, useState } from 'react';
import {
  Bell,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  AlertTriangle,
  Info,
  Megaphone,
  ShieldAlert,
  Send,
} from 'lucide-react';
import type { AdminNotification, NotificationType } from '../types/admin';
import { adminApi } from '../services/adminApi';

export const NotificationsAdminPage: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formType, setFormType] = useState<NotificationType>('info');
  const [formAudience, setFormAudience] = useState<'All' | 'Students' | 'Staff'>('All');
  const [formLinkUrl, setFormLinkUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.fetchNotifications();
      setNotifications(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMessage.trim()) return;

    setSubmitting(true);
    try {
      await adminApi.createNotification({
        title: formTitle.trim(),
        message: formMessage.trim(),
        type: formType,
        targetAudience: formAudience,
        linkUrl: formLinkUrl.trim() || null,
      });

      setFormTitle('');
      setFormMessage('');
      setFormLinkUrl('');
      setFormType('info');
      setFormAudience('All');
      setIsCreateOpen(false);
      await loadNotifications();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create notification.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete notification "${title}"?`)) return;
    try {
      await adminApi.deleteNotification(id);
      await loadNotifications();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete notification.');
    }
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const filteredNotifications = safeNotifications.filter((item) => {
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (item.title || '').toLowerCase().includes(q) ||
        (item.message || '').toLowerCase().includes(q) ||
        (item.createdBy || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case 'urgent':
      case 'alert':
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-extrabold text-red-800 border border-red-200"><AlertTriangle className="h-3 w-3" /> Urgent</span>;
      case 'notice':
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800 border border-amber-200"><Megaphone className="h-3 w-3" /> Notice</span>;
      case 'system':
        return <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-800 border border-purple-200"><ShieldAlert className="h-3 w-3" /> System</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-800 border border-blue-200"><Info className="h-3 w-3" /> Info</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy-950 flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" /> Notifications Manager
          </h1>
          <p className="mt-1 text-xs text-navy-500 font-medium">
            Broadcast custom notifications to students, staff, or the entire campus community. Automatic notifications are also generated when notices are published.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => void loadNotifications()}
            className="flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-bold text-navy-800 hover:bg-navy-50 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" /> Send Notification
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications by title, content, or author..."
            className="w-full rounded-xl border border-navy-200 bg-navy-50/50 py-2 pl-9 pr-3 text-xs font-medium text-navy-950 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-800 focus:outline-none"
        >
          <option value="ALL">All Types</option>
          <option value="info">Info</option>
          <option value="notice">Notice Auto-Broadcast</option>
          <option value="urgent">Urgent</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Notifications Table */}
      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs font-semibold text-navy-500">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-blue-600 mb-2" />
            Loading notifications...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs font-bold text-red-700">{error}</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-navy-500">
            No notifications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-navy-100 bg-navy-50/70 text-navy-700 uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Notification Title</th>
                  <th className="px-4 py-3.5">Category Type</th>
                  <th className="px-4 py-3.5">Target Audience</th>
                  <th className="px-4 py-3.5">Message Content</th>
                  <th className="px-4 py-3.5">Created At</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filteredNotifications.map((notif) => (
                  <tr key={notif.id} className="hover:bg-navy-50/40 transition">
                    <td className="px-4 py-3.5 font-bold text-navy-950 max-w-xs truncate">
                      {notif.title}
                    </td>
                    <td className="px-4 py-3.5">
                      {getTypeBadge(notif.type)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-navy-700">
                      <span className="rounded bg-navy-100 px-2 py-0.5 text-[10px] font-bold text-navy-800">
                        {notif.targetAudience}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-navy-800 font-medium max-w-md truncate">
                      {notif.message}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-navy-500 font-medium text-[11px]">
                      {new Date(notif.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => void handleDelete(notif.id, notif.title)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-black text-navy-950">Send Campus Notification</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={(e) => void handleCreate(e)} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Campus Network Maintenance Alert"
                  className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-semibold text-navy-950 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
                    Notification Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as NotificationType)}
                    className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                  >
                    <option value="info">Info / Announcement</option>
                    <option value="notice">Notice Alert</option>
                    <option value="urgent">Urgent Priority</option>
                    <option value="system">System Notification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
                    Target Audience
                  </label>
                  <select
                    value={formAudience}
                    onChange={(e) => setFormAudience(e.target.value as 'All' | 'Students' | 'Staff')}
                    className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                  >
                    <option value="All">All Community</option>
                    <option value="Students">Students Only</option>
                    <option value="Staff">Staff Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Write the detailed broadcast notification body here..."
                  className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-semibold text-navy-950 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-navy-800 uppercase mb-1">
                  Optional Target Link URL
                </label>
                <input
                  type="url"
                  value={formLinkUrl}
                  onChange={(e) => setFormLinkUrl(e.target.value)}
                  placeholder="https://intranet.dypiu.ac.in/notice/123"
                  className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-semibold text-navy-950 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-navy-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-navy-200 bg-white px-4 py-2 text-xs font-bold text-navy-700 hover:bg-navy-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? 'Sending...' : 'Broadcast Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
