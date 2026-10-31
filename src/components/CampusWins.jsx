import React from 'react';
import { Trophy, ArrowRight, Award, Medal, Star } from 'lucide-react';
import { BottomRightCornerSwoosh } from './DecorativeShapes';

export const CampusWins = () => {
  const wins = [
    {
      id: 1,
      icon: Award,
      iconBg: 'bg-[#1bb470]/15 text-[#1bb470]',
      title: 'DYPIU students completed AWS Cloud Certification',
      subtitle: 'CSE · 3 students · 2h ago',
    },
    {
      id: 2,
      icon: Medal,
      iconBg: 'bg-[#faa831]/15 text-[#faa831]',
      title: 'Student team participated in Tech Innovation Challenge',
      subtitle: '5h ago',
    },
    {
      id: 3,
      icon: Star,
      iconBg: 'bg-[#00afef]/15 text-[#00afef]',
      title: 'Biotech team secured 1st prize at National Research Expo',
      subtitle: 'BioTech · 4 students · 1d ago',
    },
  ];

  return (
    <div className="relative bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full overflow-hidden">
      {/* Decorative swoosh in bottom right */}
      <BottomRightCornerSwoosh className="w-20 h-14" />

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#faa831]/15 text-[#faa831] rounded-lg">
            <Trophy className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold tracking-tight text-[#393678] uppercase">
              CAMPUS WINS
            </h3>
            <p className="text-[10px] text-slate-500 font-normal">
              Today · 21 September
            </p>
          </div>
        </div>
        <a
          href="#wins"
          className="text-[10px] font-semibold text-[#00afef] hover:text-[#393678] flex items-center gap-1 transition-colors cursor-pointer"
        >
          View all <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Wins List */}
      <div className="space-y-1.5 mt-1 mb-2 z-10">
        {wins.map((win) => {
          const Icon = win.icon;
          return (
            <div
              key={win.id}
              className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-slate-50/80 transition-colors cursor-pointer group"
            >
              <div className={`p-2 rounded-full shrink-0 ${win.iconBg}`}>
                <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-bold text-[#393678] leading-snug group-hover:text-[#00afef] transition-colors">
                  {win.title}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {win.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-1 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#393678]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer" />
      </div>
    </div>
  );
};
