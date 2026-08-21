import React from 'react';
import type { ScheduleItem } from '../types';
import { Clock, MapPin, CalendarDays } from 'lucide-react';

interface ScheduleTimelineProps {
  schedule: ScheduleItem[];
  title?: string;
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({ schedule, title = "Today's Schedule" }) => {
  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-navy-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-navy-800 text-white">
            <CalendarDays className="w-4 h-4" />
          </div>
          <h3 className="text-base font-extrabold text-navy-900">{title}</h3>
        </div>
        <span className="text-xs font-semibold text-navy-600 bg-navy-50 px-2.5 py-1 rounded-full border border-navy-200">
          Live Schedule
        </span>
      </div>

      <div className="space-y-4">
        {schedule.map((item) => (
          <div key={item.id} className="relative pl-6 pb-4 border-l-2 border-navy-200 last:border-l-0 last:pb-0">
            {/* Timeline Circle Bullet */}
            <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-navy-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-navy-800" />
            </div>

            <div className="bg-navy-50/60 rounded-xl p-3.5 border border-navy-100/80 hover:border-navy-300 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="inline-flex items-center text-[11px] font-bold text-navy-800">
                  <Clock className="w-3 h-3 mr-1 text-navy-600" />
                  {item.time}
                </span>
                {item.code && (
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white text-navy-800 border border-navy-200">
                    {item.code}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-navy-900 mb-1">
                {item.title}
              </h4>

              <div className="flex items-center text-xs text-navy-500 font-medium">
                <MapPin className="w-3.5 h-3.5 mr-1 text-navy-400" />
                <span>{item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
