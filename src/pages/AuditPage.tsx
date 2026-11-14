import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { adminApi } from '../admin/services/adminApi';

interface AuditEvent {
  timestamp: string | null;
  user: string | null;
  application: string | null;
  action: string | null;
  result: string | null;
  metadata: {
    ip: string | null;
    method: string | null;
    path: string | null;
    reason: string | null;
    userRoles: string[] | null;
    requiredRoles: string[] | null;
  };
}

// The audit service records the actor as actorEmail/actorSub and the affected
// area as resourceType, while this table reads user/application. Accept either.
interface RawAuditEvent {
  timestamp?: string | null;
  user?: string | null;
  application?: string | null;
  action?: string | null;
  result?: string | null;
  actorEmail?: string;
  actorSub?: string;
  resourceType?: string;
  metadata?: {
    ip?: string | null;
    method?: string | null;
    path?: string | null;
    reason?: string | null;
    userRoles?: string[] | null;
    requiredRoles?: string[] | null;
  };
}

const toAuditRow = (raw: RawAuditEvent): AuditEvent => ({
  timestamp: typeof raw.timestamp === 'string' ? raw.timestamp : null,
  user: raw.user ?? raw.actorEmail ?? raw.actorSub ?? null,
  application: raw.application ?? raw.resourceType ?? null,
  action: raw.action ?? null,
  result: raw.result ?? null,
  metadata: {
    ip: raw.metadata?.ip ?? null,
    method: raw.metadata?.method ?? null,
    path: raw.metadata?.path ?? null,
    reason: raw.metadata?.reason ?? null,
    userRoles: raw.metadata?.userRoles ?? null,
    requiredRoles: raw.metadata?.requiredRoles ?? null,
  },
});

export const AuditPage: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadAuditEvents = async () => {
      try {
        // adminApi already handles 401/403 and falls back to the seeded local
        // audit log when the backend on port 3001 is not running.
        const events = await adminApi.fetchAuditLogs();
        if (!cancelled) setEvents((Array.isArray(events) ? events : []).map(toAuditRow));
      } catch (requestError) {
        console.error('Failed to load audit events:', requestError);
        if (!cancelled) setError('Unable to load audit logs.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadAuditEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-[18px] border border-navy-100 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-navy-100 px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-800 text-white">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-black text-navy-950">Security Audit Logs</h1>
          <p className="text-xs text-navy-500">
            Authentication and authorization events from the last 24 hours.
          </p>
        </div>
      </header>

      {loading && (
        <div className="p-8 text-center text-sm font-semibold text-navy-500">
          Loading audit logs…
        </div>
      )}

      {!loading && error && (
        <div className="p-8 text-center text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="p-8 text-center text-sm font-semibold text-navy-500">
          No security audit events are available.
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-navy-100 bg-navy-50">
              <tr>
                <th className="px-4 py-3 font-extrabold text-navy-700">Timestamp</th>
                <th className="px-4 py-3 font-extrabold text-navy-700">User</th>
                <th className="px-4 py-3 font-extrabold text-navy-700">Application</th>
                <th className="px-4 py-3 font-extrabold text-navy-700">Action</th>
                <th className="px-4 py-3 font-extrabold text-navy-700">Result</th>
                <th className="px-4 py-3 font-extrabold text-navy-700">Request</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {events.map((event, index) => (
                <tr key={`${event.timestamp ?? 'event'}-${index}`} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-navy-600">
                    {event.timestamp
                      ? new Date(event.timestamp).toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy-900">
                    {event.user ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-navy-600">
                    {event.application ?? '—'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy-900">
                    {event.action ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={
                      event.result === 'failure'
                        ? 'font-bold text-red-700'
                        : 'font-bold text-emerald-700'
                    }>
                      {event.result ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy-600">
                    <div>{event.metadata.method ?? '—'} {event.metadata.path ?? ''}</div>
                    <div className="mt-1 text-[11px] text-navy-400">
                      IP: {event.metadata.ip ?? '—'}
                    </div>
                    {event.metadata.reason && (
                      <div className="mt-1 text-[11px] text-navy-500">
                        Reason: {event.metadata.reason}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
