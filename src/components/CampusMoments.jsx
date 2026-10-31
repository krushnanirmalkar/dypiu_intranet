import React from 'react';
import { Bell, ArrowRight, Gift } from 'lucide-react';

export const CampusMoments = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full min-h-[155px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#faa831]/15 text-[#faa831] rounded-lg">
            <Bell className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <h3 className="text-[11px] font-bold tracking-tight text-[#393678] uppercase">
            CAMPUS MOMENTS
          </h3>
        </div>
        <a
          href="#moments"
          className="text-[10px] font-semibold text-[#00afef] hover:text-[#393678] flex items-center gap-1 transition-colors cursor-pointer"
        >
          View all <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Item Box */}
      <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-2.5 flex items-start gap-2.5 hover:bg-slate-100/60 transition-colors cursor-pointer group mt-1">
        {/* Red Gift / Alert Icon */}
        <div className="p-1.5 bg-[#f16136]/15 text-[#f16136] rounded-lg shrink-0">
          <Gift className="w-3.5 h-3.5 stroke-[2]" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-extrabold tracking-wider text-[#f16136] uppercase block">
            IMPORTANT
          </span>
          <h4 className="text-xs font-bold text-[#393678] truncate group-hover:text-[#00afef] transition-colors">
            Exam registration deadline extended
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Academic Office <span className="mx-1">•</span> Today
          </p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00afef] group-hover:translate-x-0.5 transition-all self-center" />
      </div>
    </div>
  );
};
