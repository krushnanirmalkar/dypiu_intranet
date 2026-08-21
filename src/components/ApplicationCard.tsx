import React from 'react';
import type { ApplicationItem } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { ExternalLink, Star } from 'lucide-react';

interface ApplicationCardProps {
  app: ApplicationItem;
  onOpenApp: (app: ApplicationItem) => void;
  onToggleFavorite?: (appId: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  app,
  onOpenApp,
  onToggleFavorite,
}) => {
  const highlightClass = app.highlightColor || 'from-navy-800/10 to-navy-700/5 border-navy-200 text-navy-800';

  return (
    <div className={`group relative bg-white rounded-xl border border-navy-100 p-5 hover:border-navy-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden`}>
      {/* Top Subtle Color Glow Header Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${highlightClass}`} />

      <div className="relative z-10">
        {/* Top bar with icon & badges */}
        <div className="flex items-start justify-between mb-3">
          {/* Dynamic Vivid Icon Badge */}
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${highlightClass} border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
            <DynamicIcon name={app.iconName} className="w-5 h-5" />
          </div>

          <div className="flex items-center space-x-1.5">
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(app.id);
                }}
                className={`p-1 rounded hover:bg-navy-50 transition-colors ${
                  app.isFavorite ? 'text-amber-500' : 'text-navy-300 hover:text-navy-600'
                }`}
                title={app.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-extrabold text-navy-900 text-base mb-1 group-hover:text-navy-800 transition-colors">
          {app.name}
        </h3>
        <p className="text-xs text-navy-500 leading-relaxed line-clamp-2 mb-4">
          {app.description}
        </p>
      </div>

      {/* Action Open Button */}
      <div className="pt-3 border-t border-navy-50 flex items-center justify-between relative z-10">
        <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider">
          {app.category}
        </span>

        <button
          onClick={() => onOpenApp(app)}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-navy-50 text-navy-900 font-bold text-xs hover:bg-navy-800 hover:text-white transition-all border border-navy-200 group-hover:border-navy-800 shadow-xs"
        >
          <span>Open</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
