import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export const TodayCard = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full min-h-[155px]">
      <div className="flex items-start gap-2.5">
        {/* Calendar Icon Badge */}
        <div className="p-2 bg-[#00afef]/10 text-[#00afef] rounded-lg shrink-0">
          <Calendar className="w-4 h-4 stroke-[2]" />
        </div>
        <div>
          <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase">
            TODAY
          </span>
          <h2 className="text-lg font-extrabold text-[#393678] mt-0.5">
            21 SEP
          </h2>
        </div>
      </div>

      {/* 3 upcoming items */}
      <a
        href="#calendar"
        className="bg-[#00afef]/10 hover:bg-[#00afef]/20 text-[#393678] text-[11px] font-semibold py-1.5 px-2.5 rounded-lg flex items-center justify-between transition-colors group cursor-pointer mt-3"
      >
        <span>3 upcoming items</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
};
