import React from 'react';
import { ArrowRight, Grid2X2 } from 'lucide-react';
import type { ApplicationItem } from '../types';
import { ApplicationCard } from './ApplicationCard';

interface ApplicationsGridProps {
  applications: ApplicationItem[];
  onOpenApp: (app: ApplicationItem) => void;
  onToggleFavorite: (appId: string) => void;
  onViewAllApps: () => void;
  loading?: boolean;
}

export const ApplicationsGrid: React.FC<ApplicationsGridProps> = ({
  applications,
  onOpenApp,
  onToggleFavorite,
  onViewAllApps,
  loading = false,
}) => (
  <section className="self-start rounded-[14px] border border-[#e3ebf7] bg-[#f3f7ff] p-3 shadow-[0_3px_12px_rgba(15,35,75,0.03)] sm:p-3.5">
    <div className="mb-3 flex items-center justify-between gap-3 px-0.5">
      <div className="flex items-center gap-2">
        <Grid2X2 className="h-[18px] w-[18px] text-blue-700" />
        <h2 className="text-[13px] font-extrabold text-navy-950">Your Applications</h2>
      </div>
      <button onClick={onViewAllApps} className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-navy-900">
        View all applications <ArrowRight className="h-3 w-3" />
      </button>
    </div>

    {loading ? (
      <div className="flex min-h-48 items-center justify-center text-sm font-semibold text-navy-500">Loading applications…</div>
    ) : applications.length > 0 ? (
      <div className="applications-card-grid grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {applications.slice(0, 6).map((app) => (
          <ApplicationCard key={app.id} app={app} onOpenApp={onOpenApp} onToggleFavorite={onToggleFavorite} />
        ))}
      </div>
    ) : (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-white text-sm font-semibold text-navy-500">
        No applications are available for this account.
      </div>
    )}
  </section>
);
