import React from 'react';
import type { ApplicationItem } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { ExternalLink } from 'lucide-react';

interface ApplicationCardProps {
  app: ApplicationItem;
  onOpenApp: (app: ApplicationItem) => void;
  onToggleFavorite?: (appId: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  app,
  onOpenApp,
}) => {
  const highlightClass = app.highlightColor || 'from-navy-800/10 to-navy-700/5 border-navy-200 text-navy-800';

  return (
    <div 
      onClick={() => onOpenApp(app)}
      className={`group relative bg-white rounded-xl border border-navy-100 p-4 hover:border-navy-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer`}
    >
      {/* Top Subtle Color Glow Header Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${highlightClass}`} />

      <div>
        {/* Icon & Category Tag */}
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${highlightClass} border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
            <DynamicIcon name={app.iconName} className="w-4 h-4" />
          </div>

          <span className="text-[10px] font-semibold text-navy-600 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
            {app.category}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-navy-900 text-sm mb-1 group-hover:text-navy-800 transition-colors flex items-center justify-between">
          <span>{app.name}</span>
          <ExternalLink className="w-3.5 h-3.5 text-navy-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
        </h3>
        <p className="text-xs text-navy-500 leading-relaxed line-clamp-2">
          {app.description}
        </p>
      </div>
    </div>
  );
};
