import React from 'react';
import type { ApplicationItem, UserRole } from '../types';
import { ApplicationCard } from './ApplicationCard';
import { Grid, ArrowRight } from 'lucide-react';

interface ApplicationsGridProps {
  applications: ApplicationItem[];
  currentRole: UserRole;
  onOpenApp: (app: ApplicationItem) => void;
  onToggleFavorite: (appId: string) => void;
  onViewAllApps: () => void;
}

export const ApplicationsGrid: React.FC<ApplicationsGridProps> = ({
  applications,
  currentRole,
  onOpenApp,
  onToggleFavorite,
  onViewAllApps,
}) => {
  const roleFilteredApps = applications.filter((app) =>
    app.targetRoles.includes(currentRole)
  );

  return (
    <section className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-navy-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-navy-800 text-white">
              <Grid className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-navy-900 tracking-tight">University Portals & Applications</h2>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Access your learning management systems, student services, and academic portals.
          </p>
        </div>

        <button
          onClick={onViewAllApps}
          className="px-3.5 py-1.5 rounded-lg bg-navy-50 text-navy-800 font-semibold text-xs hover:bg-navy-100 transition-colors flex items-center space-x-1 border border-navy-200"
        >
          <span>All Applications ({roleFilteredApps.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Application Cards - Max 3 Cards per Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleFilteredApps.slice(0, 6).map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            onOpenApp={onOpenApp}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
};
