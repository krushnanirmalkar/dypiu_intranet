import React from 'react';
import type { StatMetric } from '../types';

interface StatCardProps {
  stat: StatMetric;
}

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm hover:border-navy-300 transition-colors">
      <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-1">
        {stat.label}
      </p>
      <div className="flex items-baseline justify-between">
        <h4 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
          {stat.value}
        </h4>
        {stat.change && (
          <span className="text-[11px] font-bold text-navy-700 bg-navy-50 px-2 py-0.5 rounded border border-navy-100">
            {stat.change}
          </span>
        )}
      </div>
      {stat.subtext && (
        <p className="text-[11px] text-navy-500 font-medium mt-1">
          {stat.subtext}
        </p>
      )}
    </div>
  );
};
