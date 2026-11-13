import React, { useState } from 'react';
import {
  GraduationCap,
  Share2,
  FileText,
  BookOpen,
  CalendarCheck,
  Building2,
  Briefcase,
  Layers,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';

export interface UniversityApp {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderHover: string;
  bgLight: string;
  url: string;
  ssoEnabled: boolean;
}

export const CORE_UNIVERSITY_APPS: UniversityApp[] = [
  {
    id: 'juno',
    name: 'Juno ERP',
    subtitle: 'Academic portal, attendance, timetable & results',
    tag: 'Academic',
    badge: 'Popular',
    icon: GraduationCap,
    accentColor: 'text-[#0E0F8C]',
    borderHover: 'hover:border-[#0E0F8C]/50 hover:shadow-[#0E0F8C]/10',
    bgLight: 'bg-[#0E0F8C]/10',
    url: 'https://erp.dypiu.ac.in',
    ssoEnabled: true,
  },
  {
    id: 'unisync',
    name: 'UniSync',
    subtitle: 'Campus collaboration, notices & department updates',
    tag: 'Collaboration',
    badge: 'New v2.0',
    icon: Share2,
    accentColor: 'text-[#00AFEF]',
    borderHover: 'hover:border-[#00AFEF]/50 hover:shadow-[#00AFEF]/10',
    bgLight: 'bg-[#00AFEF]/10',
    url: 'https://unisync.dypiu.ac.in',
    ssoEnabled: true,
  },
  {
    id: 'udms',
    name: 'UDMS Portal',
    subtitle: 'Digital documents, bonafide & clearance certificates',
    tag: 'Administration',
    icon: FileText,
    accentColor: 'text-[#FAA831]',
    borderHover: 'hover:border-[#FAA831]/50 hover:shadow-[#FAA831]/10',
    bgLight: 'bg-[#FAA831]/15',
    url: 'https://udms.dypiu.ac.in',
    ssoEnabled: true,
  },
  {
    id: 'library',
    name: 'Digital Library',
    subtitle: 'Access IEEE Xplore, research journals & catalog',
    tag: 'Resources',
    icon: BookOpen,
    accentColor: 'text-indigo-600',
    borderHover: 'hover:border-indigo-400 hover:shadow-indigo-100',
    bgLight: 'bg-indigo-50',
    url: 'https://library.dypiu.ac.in',
    ssoEnabled: true,
  },
  {
    id: 'exams',
    name: 'Exam Cell & Grade Card',
    subtitle: 'Hall tickets, re-evaluation and exam schedules',
    tag: 'Examination',
    icon: CalendarCheck,
    accentColor: 'text-[#F16136]',
    borderHover: 'hover:border-[#F16136]/50 hover:shadow-[#F16136]/10',
    bgLight: 'bg-[#F16136]/10',
    url: 'https://exam.dypiu.ac.in',
    ssoEnabled: true,
  },
  {
    id: 'placement',
    name: 'Career & Placement',
    subtitle: 'Campus interview drives, internships & resumes',
    tag: 'Careers',
    badge: 'Active Drives',
    icon: Briefcase,
    accentColor: 'text-emerald-600',
    borderHover: 'hover:border-emerald-400 hover:shadow-emerald-100',
    bgLight: 'bg-emerald-50',
    url: 'https://placements.dypiu.ac.in',
    ssoEnabled: true,
  },
  {
    id: 'hostel',
    name: 'Hostel & Mess Desk',
    subtitle: 'Room allotment, leave pass and maintenance tickets',
    tag: 'Campus Living',
    icon: Building2,
    accentColor: 'text-sky-700',
    borderHover: 'hover:border-sky-400 hover:shadow-sky-100',
    bgLight: 'bg-sky-50',
    url: 'https://hostel.dypiu.ac.in',
    ssoEnabled: true,
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    subtitle: 'Lecture slides, assignments & quiz submissions',
    tag: 'Learning',
    icon: Layers,
    accentColor: 'text-purple-600',
    borderHover: 'hover:border-purple-400 hover:shadow-purple-100',
    bgLight: 'bg-purple-50',
    url: 'https://lms.dypiu.ac.in',
    ssoEnabled: true,
  },
];

interface UniversityApplicationsSectionProps {
  onOpenApp?: (app: UniversityApp) => void;
  onViewAll?: () => void;
}

export const UniversityApplicationsSection: React.FC<UniversityApplicationsSectionProps> = ({
  onOpenApp,
  onViewAll,
}) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['juno', 'unisync', 'udms']);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAppClick = (app: UniversityApp) => {
    if (onOpenApp) {
      onOpenApp(app);
    } else {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs relative overflow-hidden transition-all">
      {/* Top Header Row with Category & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00AFEF]" />
            <h2 className="text-base sm:text-lg font-bold text-[#0E0F8C] tracking-tight">
              University Applications
            </h2>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {CORE_UNIVERSITY_APPS.length} Essential Services
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official tools for students, faculty, and university administration
          </p>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="self-start sm:self-center inline-flex items-center gap-1 text-xs font-semibold text-[#00AFEF] hover:text-[#0E0F8C] transition-colors cursor-pointer group"
          >
            <span>Explore all directory apps</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Grid of 8 Core University Applications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
        {CORE_UNIVERSITY_APPS.map((app) => {
          const IconComponent = app.icon;
          const isFav = favoriteIds.includes(app.id);

          return (
            <div
              key={app.id}
              onClick={() => handleAppClick(app)}
              className={`group relative text-left p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between ${app.borderHover}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl ${app.bgLight} ${app.accentColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs`}
                  >
                    <IconComponent className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div className="flex items-center gap-1">
                    {app.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAA831]/20 text-amber-800 border border-[#FAA831]/30">
                        {app.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, app.id)}
                      className={`p-1 rounded-md transition-colors ${
                        isFav
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-slate-300 hover:text-slate-400'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Mark favorite'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0E0F8C] transition-colors leading-tight">
                  {app.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-normal mt-1 leading-snug line-clamp-2">
                  {app.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100/80 text-[10px] text-slate-400 font-medium">
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <ShieldCheck className="w-3 h-3 text-[#00AFEF]" />
                  <span>SSO Active</span>
                </span>
                <span className="inline-flex items-center gap-0.5 text-[#00AFEF] group-hover:translate-x-0.5 transition-transform font-semibold">
                  Launch <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
