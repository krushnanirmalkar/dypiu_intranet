import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

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

interface AuditResponse {
  events?: AuditEvent[];
}

export const AuditPage: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAuditEvents = async () => {
      try {
        const response = await fetch('/api/admin/audit', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }

        if (response.status === 403) {
          setError('You do not have permission to view audit logs.');
          return;
        }

        if (!response.ok) {
          throw new Error(`Audit request failed with status ${response.status}`);
        }

        const data = await response.json() as AuditResponse;
        setEvents(Array.isArray(data.events) ? data.events : []);
      } catch (requestError) {
        console.error('Failed to load audit events:', requestError);
        setError('Unable to load audit logs.');
      } finally {
        setLoading(false);
      }
    };

    void loadAuditEvents();
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
