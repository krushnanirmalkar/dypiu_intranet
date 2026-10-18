import React from 'react';
import { Activity, ArrowRight, HeartPulse } from 'lucide-react';

export const CampusPulse = () => {
  const pulseItems = [
    {
      id: 1,
      type: 'important',
      tag: 'IMPORTANT',
      tagColor: 'text-[#f16136] bg-[#f16136]/10',
      title: 'Exam registration deadline extended',
      subtitle: 'Academic Office · Today',
      isRedIcon: true,
    },
    {
      id: 2,
      type: 'event',
      date: '18',
      month: 'SEP',
      title: 'Tech Symposium',
      subtitle: 'Auditorium · 10:00 AM',
    },
    {
      id: 3,
      type: 'event',
      date: '21',
      month: 'SEP',
      badge: '+ NEW',
      title: 'Cloud Computing Workshop',
      subtitle: 'Lab 3 · 2:00 PM',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#00afef]/10 text-[#00afef] rounded-lg">
            <Activity className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold tracking-tight text-[#393678] uppercase">
              CAMPUS PULSE
            </h3>
            <p className="text-[10px] text-slate-500 font-normal">
              What's happening around you
            </p>
          </div>
        </div>
        <a
          href="#pulse"
          className="text-[10px] font-semibold text-[#00afef] hover:text-[#393678] flex items-center gap-1 transition-colors cursor-pointer"
        >
          View all <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* List Items */}
      <div className="divide-y divide-slate-100 mt-1">
        {pulseItems.map((item) => (
          <div
            key={item.id}
            className="py-1.5 flex items-center gap-2.5 hover:bg-slate-50/70 rounded-lg px-1.5 transition-colors cursor-pointer group"
          >
            {item.isRedIcon ? (
              <div className="p-1.5 bg-[#f16136]/15 text-[#f16136] rounded-lg shrink-0">
                <HeartPulse className="w-3.5 h-3.5 stroke-[2]" />
              </div>
            ) : (
              <div className="w-9 h-9 bg-slate-100 text-[#393678] rounded-lg flex flex-col items-center justify-center shrink-0 border border-slate-200/60">
                <span className="text-[11px] font-extrabold leading-none">{item.date}</span>
                <span className="text-[8px] font-bold text-slate-500 leading-none mt-0.5">{item.month}</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                {item.tag && (
                  <span className="text-[8px] font-extrabold text-[#f16136] uppercase">
                    {item.tag}
                  </span>
                )}
                {item.badge && (
                  <span className="text-[8px] font-extrabold text-[#1bb470] bg-[#1bb470]/10 px-1 py-0.5 rounded border border-[#1bb470]/30">
                    {item.badge}
                  </span>
                )}
              </div>
              <h4 className="text-[11px] font-bold text-[#393678] truncate group-hover:text-[#00afef] transition-colors">
                {item.title}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {item.subtitle}
              </p>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00afef] group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
