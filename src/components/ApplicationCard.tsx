import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { ApplicationItem } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface ApplicationCardProps { app: ApplicationItem; onOpenApp: (app: ApplicationItem) => void; onToggleFavorite?: (appId: string) => void; }

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ app, onOpenApp }) => {
  const highlightClass = app.highlightColor || 'from-navy-800/10 to-navy-700/5 border-navy-200 text-navy-800';
  return (
    <button onClick={() => onOpenApp(app)} className="group relative flex min-h-[150px] w-full items-start gap-3.5 rounded-xl border border-[#e5ebf5] bg-white p-3.5 pr-10 text-left shadow-[0_3px_10px_rgba(15,35,75,0.035)] transition hover:-translate-y-px hover:border-navy-200 hover:shadow-[0_7px_16px_rgba(15,35,75,0.06)]">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${highlightClass}`}><DynamicIcon name={app.iconName} className="h-6 w-6" /></span>
      <span className="min-w-0 flex-1 pt-0.5">
        <span className="block text-[13px] font-extrabold text-navy-950">{app.name}</span>
        <span className={`mt-0.5 block text-[12px] font-bold ${app.category === 'Academic' ? 'text-blue-600' : app.category === 'Productivity' ? 'text-emerald-600' : 'text-amber-600'}`}>{app.category}</span>
        <span className="mt-3 block text-[11px] leading-3.5 text-navy-600">{app.description}</span>
      </span>
      <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white"><ArrowRight className="h-3.5 w-3.5" /></span>
    </button>
  );
};
