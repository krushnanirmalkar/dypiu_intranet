import React from 'react';
import type { UserProfile } from '../types';
import { Building2, User } from 'lucide-react';

interface WelcomeBannerProps {
  user: UserProfile;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user }) => {
  const isStudent = user.role === 'student';

  return (
    <div className="rounded-xl bg-navy-800 text-white p-4 shadow-sm border border-navy-700 h-full flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center space-x-1.5 text-navy-200 text-xs font-medium">
          <Building2 className="w-3.5 h-3.5 text-navy-300 shrink-0" />
          <span>D. Y. Patil International University, Akurdi</span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">
          Welcome back, {user.name}
        </h1>

        <p className="text-navy-200 text-xs font-normal leading-relaxed max-w-lg">
          {isStudent
            ? "Access your academic portal, course materials, and university services."
            : "Manage your classes, student evaluations, and departmental activities."
          }
        </p>
      </div>

      <div className="pt-3 mt-3 border-t border-navy-700/80 flex items-center justify-between">
        <div className="inline-flex items-center text-xs text-navy-200 font-medium">
          <User className="w-3.5 h-3.5 text-navy-300 mr-1.5 shrink-0" />
          <span>PRN: <strong className="font-mono text-white ml-0.5">{user.collegeId}</strong></span>
          <span className="mx-2 text-navy-500">•</span>
          <span className="text-navy-200 truncate">{user.department}</span>
        </div>
      </div>
    </div>
  );
};
