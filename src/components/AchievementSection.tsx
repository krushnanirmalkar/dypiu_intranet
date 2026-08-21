import React from 'react';
import type { AchievementItem, UserRole } from '../types';
import { AchievementCard } from './AchievementCard';
import { Award, ArrowRight, Plus } from 'lucide-react';

interface AchievementSectionProps {
  achievements: AchievementItem[];
  currentRole: UserRole;
  onViewAll: () => void;
  onAddAchievement: () => void;
  onSelectAchievement: (ach: AchievementItem) => void;
}

export const AchievementSection: React.FC<AchievementSectionProps> = ({
  achievements,
  currentRole,
  onViewAll,
  onAddAchievement,
  onSelectAchievement,
}) => {
  const roleAchievements = achievements.filter(
    (a) => a.role === currentRole || a.role === 'student'
  );

  return (
    <section className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-navy-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-navy-800 text-white">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-navy-900 tracking-tight">Your Achievements</h2>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            {currentRole === 'student'
              ? 'Your digital academic portfolio, hackathons, certifications, and research credentials.'
              : 'Your faculty publications, grant awards, keynote engagements, and academic distinctions.'
            }
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onAddAchievement}
            className="px-3 py-1.5 rounded-lg bg-navy-800 text-white font-semibold text-xs hover:bg-navy-900 transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Achievement</span>
          </button>

          <button
            onClick={onViewAll}
            className="px-3 py-1.5 rounded-lg bg-navy-50 text-navy-800 font-semibold text-xs hover:bg-navy-100 transition-colors flex items-center space-x-1 border border-navy-200"
          >
            <span>View All Achievements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleAchievements.slice(0, 3).map((ach) => (
          <AchievementCard 
            key={ach.id} 
            achievement={ach} 
            onSelect={onSelectAchievement} 
          />
        ))}
      </div>
    </section>
  );
};
