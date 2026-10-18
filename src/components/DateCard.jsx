import React from 'react';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { BottomRightCornerSwoosh } from './DecorativeShapes';

export const DateCard = () => {
  return (
    <div className="relative bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full min-h-[230px] overflow-hidden">
      {/* Corner swoosh */}
      <BottomRightCornerSwoosh className="w-20 h-14" />

      {/* Header */}
      <div className="flex items-center gap-2 pb-1.5 z-10">
        <div className="p-1.5 bg-blue-50 text-[#0057A8] rounded-lg">
          <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
        </div>
        <h3 className="text-[11px] font-bold tracking-tight text-[#002B5C] uppercase">
          DATE
        </h3>
      </div>

      {/* Today Box */}
      <div className="bg-gradient-to-b from-[#EFF6FF] to-[#E2EFFD] rounded-lg p-2.5 text-center z-10 border border-blue-100/80 shadow-2xs">
        <span className="text-[9px] font-extrabold tracking-wider text-slate-500 uppercase block">
          TODAY
        </span>
        <h2 className="text-base font-extrabold text-[#002B5C] my-0.5">
          21 SEP
        </h2>
        <a
          href="#calendar"
          className="text-[10px] font-semibold text-[#0057A8] hover:text-[#002B5C] flex items-center justify-center gap-1 mt-0.5 transition-colors group cursor-pointer"
        >
          <span>3 upcoming items</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* Motivational Script Section */}
      <div className="relative py-1 pl-1 z-10 my-auto">
        <Sparkles className="w-3.5 h-3.5 text-[#00A6E8] mb-0.5" />
        <div className="font-handwriting text-xl font-bold text-[#003B70] leading-tight space-y-0.5 transform -rotate-2 select-none">
          <div className="text-[#0057A8] ml-2">Dream</div>
          <div className="text-[#003B70] ml-4">Build</div>
          <div className="text-[#FDB515] ml-6">Achieve</div>
        </div>
      </div>
    </div>
  );
};
