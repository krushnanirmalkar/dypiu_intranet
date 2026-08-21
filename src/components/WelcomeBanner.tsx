import React from 'react';
import type { UserProfile } from '../types';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface WelcomeBannerProps {
  user: UserProfile;
  onExploreApps: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user, onExploreApps }) => {
  const isStudent = user.role === 'student';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy-800 text-white p-6 sm:p-8 shadow-xl shadow-navy-800/10 border border-navy-700">
      {/* Background Navy Geometric Abstract Pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none overflow-hidden hidden md:block">
        <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
          <circle cx="300" cy="100" r="140" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="300" cy="100" r="100" stroke="white" strokeWidth="1" />
          <circle cx="300" cy="100" r="60" stroke="white" strokeWidth="3" />
          <rect x="250" y="50" width="100" height="100" stroke="white" strokeWidth="1" transform="rotate(45 300 100)" />
          <path d="M 100,0 L 400,300 M 150,-50 L 450,250" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl">
        {/* Status Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md mb-4 border border-white/15">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>D Y Patil International University (DYPIU) Akurdi • Campus Portal</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Good Morning, {user.name} <span className="inline-block animate-bounce">👋</span>
        </h1>

        <p className="text-navy-100 text-sm sm:text-base leading-relaxed mb-6 font-normal">
          {isStudent
            ? "Everything you need for your academic journey, research publications, and university applications — all in one centralized workspace."
            : "Manage your academic activities, classes, student evaluations, and university services seamlessly from your faculty portal."
          }
        </p>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={onExploreApps}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-white text-navy-900 font-bold text-xs sm:text-sm hover:bg-navy-50 transition-all shadow-md group"
          >
            <span>Launch My Applications</span>
            <ArrowRight className="w-4 h-4 text-navy-900 group-hover:translate-x-0.5 transition-transform" />
          </button>
          
          <div className="text-xs text-navy-200 font-medium px-3 py-2 bg-navy-900/60 rounded-lg border border-navy-700">
            ID: <span className="font-mono text-white font-bold">{user.collegeId}</span> • {user.department}
          </div>
        </div>
      </div>
    </div>
  );
};
