import React, { useEffect, useState } from 'react';
import {
  Clock,
  Eye,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { AuditEvent } from '../types/admin';
import { adminApi } from '../services/adminApi';

export const AuditLogAdminPage: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [resourceFilter, setResourceFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.fetchAuditLogs();
      setEvents(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load security audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLogs();
  }, []);

  const filteredEvents = events.filter((e) => {
    if (resourceFilter !== 'ALL' && e.resourceType !== resourceFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.action.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.actorEmail.toLowerCase().includes(q) ||
        e.resourceId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy-950 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" /> Administrative Audit Trail
          </h1>
          <p className="mt-1 text-xs text-navy-500 font-medium">
            Immutable, append-only security log recording all administrative modifications, publication actions, and security events.
          </p>
        </div>

        <button
          onClick={() => void loadLogs()}
          className="flex items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-bold text-navy-800 hover:bg-navy-50 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Audit Trail
        </button>
      </div>

      {/* Filter and Search */}
      <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by action, summary, admin email..."
            className="w-full rounded-xl border border-navy-200 bg-navy-50/50 py-2 pl-9 pr-3 text-xs font-medium text-navy-950 focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-800 focus:outline-none"
        >
          <option value="ALL">All Resource Types</option>
          <option value="notice">Notices</option>
          <option value="application">Applications</option>
          <option value="policy">Policies</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs font-semibold text-navy-500">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-emerald-600 mb-2" />
            Loading security audit log...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs font-bold text-red-700">{error}</div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-navy-500">
            No audit records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-navy-100 bg-navy-50/70 text-navy-700 uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">Administrator</th>
                  <th className="px-4 py-3.5">Action Event</th>
                  <th className="px-4 py-3.5">Resource</th>
                  <th className="px-4 py-3.5">Summary</th>
                  <th className="px-4 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filteredEvents.map((e) => (
                  <tr key={e.id} className="hover:bg-navy-50/40 transition">
                    <td className="px-4 py-3.5 whitespace-nowrap text-navy-600 flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5 text-navy-400" />
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-navy-950">
                      {e.actorEmail || 'System'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {e.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-navy-700 capitalize">
                      {e.resourceType}
                    </td>
                    <td className="px-4 py-3.5 text-navy-900 font-medium max-w-xs truncate">
                      {e.summary}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedEvent(e)}
                        className="p-1.5 rounded-lg text-navy-600 hover:bg-navy-100 transition"
                        title="View request metadata"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-black text-navy-950">Audit Event Metadata</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-navy-50 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] font-bold uppercase text-navy-400">Event ID</span>
                  <p className="font-mono font-bold text-navy-950">{selectedEvent.id}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-navy-400">Timestamp</span>
                  <p className="font-semibold text-navy-950">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-navy-400">Actor Identity</span>
                <p className="font-bold text-navy-950">{selectedEvent.actorEmail} ({selectedEvent.actorSub})</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-navy-400">Action & Resource</span>
                <p className="font-mono text-emerald-700 font-bold">{selectedEvent.action} on {selectedEvent.resourceType}:{selectedEvent.resourceId}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-navy-400">Summary</span>
                <p className="font-medium text-navy-950">{selectedEvent.summary}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-navy-400">HTTP Request Metadata</span>
                <div className="mt-1 rounded-xl bg-navy-900 p-3 font-mono text-[11px] text-blue-200">
                  <p>Method: {selectedEvent.metadata?.method || 'N/A'}</p>
                  <p>Path: {selectedEvent.metadata?.path || 'N/A'}</p>
                  <p>IP Address: {selectedEvent.metadata?.ip || '127.0.0.1'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-navy-100">
              <button
                onClick={() => setSelectedEvent(null)}
                className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
