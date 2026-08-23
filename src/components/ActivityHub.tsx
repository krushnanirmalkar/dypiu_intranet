import React from 'react';
import type { UserRole } from '../types';
import { AnnouncementSection } from './AnnouncementSection';

interface ActivityHubProps {
  currentRole: UserRole;
}

export const ActivityHub: React.FC<ActivityHubProps> = ({
  currentRole,
}) => {
  return (
    <div className="bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden p-1.5">
      <AnnouncementSection currentRole={currentRole} />
    </div>
  );
};
