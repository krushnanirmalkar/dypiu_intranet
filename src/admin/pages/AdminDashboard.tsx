import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Clock,
  Grid2X2,
  Megaphone,
  Plus,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import type { AdminNotice, AuditEvent, DashboardStats } from '../types/admin';
import type { UserProfile } from '../../types';
import { adminApi } from '../services/adminApi';
import type { AdminTab } from '../AdminLayout';

interface AdminDashboardProps {
  user?: UserProfile | null;
  onNavigateTab: (tab: AdminTab) => void;
  onOpenCreateNotice: () => void;
  onOpenCreateApplication: () => void;
  onOpenCreatePolicy: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onNavigateTab,
  onOpenCreateNotice,
  onOpenCreateApplication,
  onOpenCreatePolicy,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentNotices, setRecentNotices] = useState<AdminNotice[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canNotices = Boolean(user?.isSuperAdmin || user?.role === 'admin' || user?.permissions?.canManageNotices);
  const canApps = Boolean(user?.isSuperAdmin || user?.role === 'admin' || user?.permissions?.canManageApplications);
  const canPolicies = Boolean(user?.isSuperAdmin || user?.role === 'admin' || user?.permissions?.canManagePolicies);
  const canAudit = Boolean(user?.isSuperAdmin || user?.role === 'admin' || user?.permissions?.canManageAudit);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.fetchDashboard();
      setStats(data.stats);
      setRecentNotices(data.recentNotices || []);
      setRecentLogs(data.recentAuditLogs || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load admin dashboard data.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-navy-200 border-t-navy-800" />
          <p className="mt-3 text-xs font-semibold text-navy-600">Loading admin dashboard statistics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-xs">
        <p className="text-sm font-bold text-red-800">{error}</p>
        <button
          onClick={() => void loadDashboardData()}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-4 py-2 text-xs font-bold text-white hover:bg-red-800 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-950 p-6 text-white shadow-md border border-navy-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">DYPIU UniOne Administration</h1>
          <p className="mt-1 text-xs text-blue-200 font-medium">
            Central management portal for authorized university notices, applications, and policies.
          </p>
        </div>
        <button
          onClick={() => void loadDashboardData()}
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {canNotices && (
          <div
            onClick={() => onNavigateTab('notices')}
            className="group cursor-pointer rounded-2xl border border-navy-100 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-navy-500">Active Notices</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <Megaphone className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black text-navy-950">{stats?.activeNotices ?? 0}</p>
            <p className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <span>● Live on notice board</span>
            </p>
          </div>
        )}

        {canApps && (
          <div
            onClick={() => onNavigateTab('applications')}
            className="group cursor-pointer rounded-2xl border border-navy-100 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-navy-500">Published Applications</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                <Grid2X2 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black text-navy-950">{stats?.publishedApplications ?? 0}</p>
            <p className="mt-1 text-[11px] font-semibold text-navy-500">Available to campus roles</p>
          </div>
        )}

        {canPolicies && (
          <div
            onClick={() => onNavigateTab('policies')}
            className="group cursor-pointer rounded-2xl border border-navy-100 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-navy-500">Active Policies</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black text-navy-950">{stats?.activePolicies ?? 0}</p>
            <p className="mt-1 text-[11px] font-semibold text-navy-500">University guidelines & policies</p>
          </div>
        )}

        {canAudit && (
          <div
            onClick={() => onNavigateTab('audit')}
            className="group cursor-pointer rounded-2xl border border-navy-100 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-navy-500">Audit Events</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black text-navy-950">{stats?.recentActions ?? 0}</p>
            <p className="mt-1 text-[11px] font-semibold text-navy-500">Recorded audit history</p>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      {(canNotices || canApps || canPolicies) && (
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-navy-500 mb-3">Quick Administrative Actions</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {canNotices && (
              <button
                onClick={onOpenCreateNotice}
                className="flex items-center justify-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 text-xs font-bold text-blue-700 hover:bg-blue-100/70 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Notice</span>
              </button>
            )}

            {canApps && (
              <button
                onClick={onOpenCreateApplication}
                className="flex items-center justify-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs font-bold text-amber-700 hover:bg-amber-100/70 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Application</span>
              </button>
            )}

            {canPolicies && (
              <button
                onClick={onOpenCreatePolicy}
                className="flex items-center justify-center gap-2.5 rounded-xl border border-violet-200 bg-violet-50/60 p-3.5 text-xs font-bold text-violet-700 hover:bg-violet-100/70 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Create/Update Policy</span>
              </button>
            )}
          </div>
        </section>
      )}

      {/* Grid: Recent Notices + Recent Audit Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recently Published Notices */}
        {canNotices && (
          <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-navy-100 pb-3">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-black text-navy-950">Recently Published Notices</h3>
                </div>
                <button
                  onClick={() => onNavigateTab('notices')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View all →
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {recentNotices.length > 0 ? (
                  recentNotices.map((notice) => (
                    <div
                      key={notice.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-navy-50 bg-navy-50/30 p-3.5"
                    >
                      <div>
                        <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          {notice.category}
                        </span>
                        <h4 className="mt-1 text-xs font-extrabold text-navy-950">{notice.title}</h4>
                        <p className="mt-1 text-[11px] text-navy-600 line-clamp-2">{notice.content}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold text-navy-400">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-xs text-navy-500 font-medium">No recent notices found.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Recent Security & Admin Audit Log */}
        {canAudit && (
          <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-navy-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-black text-navy-950">Recent Audit Activity</h3>
                </div>
                <button
                  onClick={() => onNavigateTab('audit')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View full log →
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-navy-50 bg-navy-50/30 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-navy-800 bg-navy-100 px-1.5 py-0.5 rounded">
                            {log.action}
                          </span>
                          <span className="truncate text-xs font-bold text-navy-950">{log.summary}</span>
                        </div>
                        <p className="mt-1 text-[10px] text-navy-500 truncate">By {log.actorEmail}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold text-navy-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-xs text-navy-500 font-medium">No audit entries logged yet.</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
