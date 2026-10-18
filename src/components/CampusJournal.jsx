import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { BottomRightCornerSwoosh } from './DecorativeShapes';

export const CampusJournal = () => {
  return (
    <div className="relative bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full min-h-[230px] overflow-hidden">
      {/* Corner swoosh */}
      <BottomRightCornerSwoosh className="w-16 h-12" />

      {/* Header */}
      <div className="flex items-center justify-between pb-2 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-[#0057A8] rounded-lg">
            <BookOpen className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold tracking-tight text-[#002B5C] uppercase">
              CAMPUS JOURNAL
            </h3>
            <p className="text-[10px] text-slate-500 font-normal">
              Stories from our campus
            </p>
          </div>
        </div>
        <a
          href="#journal"
          className="text-[10px] font-semibold text-[#0057A8] hover:text-[#002B5C] flex items-center gap-1 transition-colors cursor-pointer"
        >
          View all <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Journal Feature Story */}
      <div className="my-auto z-10 group cursor-pointer">
        <div className="rounded-lg overflow-hidden shadow-2xs border border-slate-100 h-24 w-full">
          <img
            src="/images/campus-building.jpg"
            alt="DYPIU Campus Innovation Hub"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h4 className="text-[11px] font-bold text-[#002B5C] group-hover:text-[#0057A8] transition-colors mt-2">
          Inside DYPIU's latest innovation
        </h4>
        <a
          href="#read-story"
          className="text-[10px] font-semibold text-[#0057A8] group-hover:text-[#002B5C] flex items-center gap-1 transition-colors mt-0.5"
        >
          Read story <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};
