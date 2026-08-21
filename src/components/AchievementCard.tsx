import type { AchievementItem } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { CheckCircle2 } from 'lucide-react';

interface AchievementCardProps {
  achievement: AchievementItem;
  onSelect?: (achievement: AchievementItem) => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect && onSelect(achievement)}
      className="group relative bg-white rounded-xl border border-navy-100 p-5 hover:border-navy-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-800 group-hover:bg-navy-800 group-hover:text-white transition-colors">
            <DynamicIcon name={achievement.badgeType || 'Trophy'} className="w-5 h-5" />
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-navy-50 text-navy-700 border border-navy-100">
              {achievement.category}
            </span>
            {achievement.verified && (
              <span className="inline-flex items-center text-[10px] font-semibold text-navy-800 bg-navy-100/60 px-1.5 py-0.5 rounded" title="Verified Record">
                <CheckCircle2 className="w-3 h-3 mr-0.5" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Title & Org */}
        <h3 className="font-bold text-navy-900 text-base group-hover:text-navy-800 transition-colors line-clamp-1 mb-1">
          {achievement.title}
        </h3>
        <p className="text-xs font-semibold text-navy-600 mb-2">
          {achievement.organization}
        </p>

        {/* Short Description */}
        <p className="text-xs text-navy-500 leading-relaxed line-clamp-2 mb-4">
          {achievement.description}
        </p>
      </div>

      {/* Footer Date & Digital Portfolio Link */}
      <div className="pt-3 border-t border-navy-50 flex items-center justify-between text-xs text-navy-400">
        <span className="font-medium text-navy-500">{achievement.date}</span>
        <span className="font-bold text-navy-800 text-[11px] group-hover:underline flex items-center">
          View Details →
        </span>
      </div>
    </div>
  );
};
