import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { ApplicationItem } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface ApplicationCardProps {
  app: ApplicationItem;
  onOpenApp: (app: ApplicationItem) => void;
  onToggleFavorite?: (appId: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ app, onOpenApp }) => {
  const highlightClass = app.highlightColor || 'from-[#00afef]/15 to-[#393678]/5 border-[#00afef]/20 text-[#00afef]';

  return (
    <button
      onClick={() => onOpenApp(app)}
      className="group relative flex min-h-[140px] w-full items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 pr-10 text-left shadow-xs transition-all duration-200 hover:-translate-y-px hover:shadow-md hover:border-slate-300 cursor-pointer"
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br ${highlightClass} shadow-2xs group-hover:scale-105 transition-transform`}>
        <DynamicIcon name={app.iconName} className="h-5 w-5 stroke-[2.2]" />
      </span>

      <span className="min-w-0 flex-1 pt-0.5">
        <span className="block text-sm font-bold text-[#393678] group-hover:text-[#00afef] transition-colors leading-snug">
          {app.name}
        </span>
        <span className="mt-0.5 inline-block text-[9.5px] font-extrabold uppercase tracking-wider text-[#00afef] bg-[#00afef]/10 px-1.5 py-0.2 rounded border border-[#00afef]/20">
          {app.category}
        </span>
        <span className="mt-2 block text-xs text-slate-600 leading-relaxed line-clamp-2">
          {app.description}
        </span>
      </span>

      <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-[#00afef] group-hover:text-white">
        <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
      </span>
    </button>
  );
};
