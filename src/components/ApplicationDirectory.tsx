import React from 'react';
import type { ApplicationItem } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface ApplicationDirectoryProps {
  applications: ApplicationItem[];
  loading: boolean;
  onOpenApp: (app: ApplicationItem) => void;
}

const applicationCardGradients = [
  'linear-gradient(135deg, #168bc7 0%, #0868ad 52%, #06477f 100%)',
  'linear-gradient(135deg, #1a96d2 0%, #126fb5 48%, #0a4d91 100%)',
  'linear-gradient(135deg, #117ebd 0%, #075c9d 52%, #063b72 100%)',
];

const applicationAccentColors = ['#16b98b', '#f4b223', '#ef6a24'];

export const ApplicationDirectory: React.FC<ApplicationDirectoryProps> = ({ applications, loading, onOpenApp }) => (
  <section className="min-h-screen bg-[#f4f4f1] px-7 py-8 lg:px-10 lg:py-10">
    <div className="w-full" style={{ maxWidth: '720px' }}>
      <div className="mb-4 border-b-2 border-navy-950 pb-3">
        <h2 className="text-xl font-black tracking-tight text-navy-950">University Applications</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-2.5">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item) => <div key={item} className="h-32 animate-pulse rounded-xl" style={{ backgroundColor: '#e8eaf0' }} />)}
        </div>
      ) : applications.length > 0 ? (
        <div className="grid grid-cols-3 gap-2.5">
          {applications.map((app, index) => (
            <button
              key={app.id}
              type="button"
              onClick={() => onOpenApp(app)}
              className="group relative flex items-center gap-4 overflow-hidden p-4 text-left transition duration-300 hover:-translate-y-1"
              style={{
                minHeight: '118px',
                background: applicationCardGradients[index % applicationCardGradients.length],
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.18)',
                clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
                filter: 'drop-shadow(0 9px 14px rgba(6, 71, 127, 0.20))',
              }}
            >
              <span className="absolute -right-1 top-11 h-px w-24 -rotate-45 bg-white/15" aria-hidden="true" />
              <span className="absolute -right-5 top-14 h-px w-24 -rotate-45 bg-white/10" aria-hidden="true" />
              <span
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100"
                aria-hidden="true"
              />
              <span className="absolute -bottom-4 -left-2 transition duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ opacity: 0.11 }} aria-hidden="true">
                <DynamicIcon name={app.iconName} className="h-20 w-20" />
              </span>
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center text-white" aria-hidden="true">
                <DynamicIcon name={app.iconName} className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
              </span>
              <span className="relative z-10 ml-auto flex flex-col items-end text-right" style={{ maxWidth: '64%' }}>
                <span className="block text-xl font-black leading-tight tracking-[-0.025em] drop-shadow-sm">{app.name}</span>
                <span
                  className="mt-2 block h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-12"
                  style={{ backgroundColor: applicationAccentColors[index % applicationAccentColors.length] }}
                  aria-hidden="true"
                />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-navy-200 bg-white px-5 py-12 text-center">
          <p className="text-sm font-bold text-navy-900">No applications available</p>
        </div>
      )}
    </div>
  </section>
);
