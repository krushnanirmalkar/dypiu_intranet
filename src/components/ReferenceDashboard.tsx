import React, { useState } from 'react';
import imgLogo from "../assets/dashboard/logo.png";
import imgProfile from "../assets/dashboard/profile.png";
import { Bell, AlertCircle, ChevronRight, BookOpen, GraduationCap, FileText, Laptop, Bookmark, Users, CheckCircle2, Briefcase, Award, HelpCircle, Clock, MapPin, Send, Sparkles, Search, Cake } from 'lucide-react';
import type { ApplicationItem, UserProfile } from '../types';

const APPLICATIONS = [
  { id: 'udms', name: 'UDMS', fullName: 'University Data Management', desc: 'Faculty profiles & reports', category: 'Academic', icon: GraduationCap, badge: 'v2.4' },
  { id: 'lms', name: 'LMS Portal', fullName: 'Learning Management System', desc: 'Course materials & quizzes', category: 'Academic', icon: BookOpen, badge: 'Active' },
  { id: 'ems', name: 'EMS', fullName: 'Examination System', desc: 'Schedules & admit cards', category: 'Academic', icon: FileText, badge: 'Grades' },
  { id: 'erp', name: 'ERP Portal', fullName: 'Enterprise Resource Planning', desc: 'Fees & attendance', category: 'Admin', icon: Laptop, badge: 'Core' },
  { id: 'library', name: 'e-Library', fullName: 'Central e-Resource Hub', desc: 'e-Books & IEEE journals', category: 'Resources', icon: Bookmark, badge: 'IEEE' },
  { id: 'teams', name: 'MS Teams', fullName: 'Microsoft Teams Campus', desc: 'Virtual classes & chat', category: 'Comm', icon: Users, badge: 'Live' },
  { id: 'exam', name: 'Exam Engine', fullName: 'Online Assessment Engine', desc: 'Proctored online tests', category: 'Academic', icon: CheckCircle2, badge: 'Proctor' },
  { id: 'placement', name: 'Placement Cell', fullName: 'Corporate Relations & Jobs', desc: 'Drives & interviews', category: 'Career', icon: Briefcase, badge: 'Drives' },
  { id: 'iqac', name: 'IQAC Portal', fullName: 'Quality Assurance Cell', desc: 'NAAC & feedback audits', category: 'Quality', icon: Award, badge: 'NAAC' },
  { id: 'helpdesk', name: 'IT Helpdesk', fullName: 'Service & Support Desk', desc: 'WiFi & IT support tickets', category: 'Support', icon: HelpCircle, badge: '24/7' },
];

const NOTICES = [
  { id: 1, tag: 'Academic', title: 'End Semester Exam Schedule Released for Spring 2026', time: '10m ago', isNew: true },
  { id: 2, tag: 'Admin', title: 'DYPIU Research Grant Applications Open for AY 2026-27', time: '2h ago', isNew: true },
  { id: 3, tag: 'Placement', title: 'Campus Drive: Microsoft & Cognizant Registration Extended', time: '1d ago', isNew: false },
  { id: 4, tag: 'IT Services', title: 'Scheduled ERP & WiFi Maintenance on Saturday Midnight', time: '2d ago', isNew: false },
];

const EVENTS = [
  { id: 1, day: '12', month: 'MAR', title: 'Annual TechFest "TechnoVision 2026"', time: '09:30 AM', venue: 'Main Auditorium', highlight: true },
  { id: 2, day: '15', month: 'MAR', title: 'Guest Lecture on AI & Machine Learning Ethics', time: '02:00 PM', venue: 'Seminar Hall B', highlight: false },
  { id: 3, day: '18', month: 'MAR', title: 'Faculty Development Workshop on Outcome Education', time: '10:00 AM', venue: 'Board Room', highlight: false },
];

const DIRECTORY = [
  { name: 'Dr. Ananya Sharma', role: 'Dean Academics' },
  { name: 'Prof. Rahul Deshmukh', role: 'CSE Faculty' },
  { name: 'Ms. Priya Nair', role: 'Registrar Office' },
  { name: 'Mr. Amit Patil', role: 'IT Helpdesk' },
  { name: 'Dr. Sneha Kulkarni', role: 'IQAC Coordinator' },
  { name: 'Placement Cell', role: 'Career Services' },
];

const BIRTHDAYS = [
  { name: 'Aarav Mehta', role: 'B.Tech CSE' },
  { name: 'Riya Kulkarni', role: 'Design Faculty' },
  { name: 'Neha Sharma', role: 'MBA Student' },
];

function AppDoodle({ appId, category }: { appId: string; category: string }) {
  const strokeMap: Record<string, string> = {
    Academic: '#4f46e5',
    Admin: '#d97706',
    Resources: '#059669',
    Comm: '#c026d3',
    Career: '#0284c7',
    Quality: '#e11d48',
    Support: '#ec510d',
    Workspace: '#0c1e38',
  };
  const stroke = strokeMap[category] ?? strokeMap.Workspace;
  const common = {
    fill: 'none',
    stroke,
    strokeWidth: 2.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (appId === 'udms') {
    return (
      <svg viewBox="0 0 72 56" aria-hidden="true" className="workspace-doodle">
        <rect x="10" y="10" width="38" height="34" rx="5" {...common} />
        <path d="M18 19h20M18 27h12M18 35h18" {...common} />
        <path d="M50 18c7 0 11 3 11 7s-4 7-11 7M50 32c7 0 11 3 11 7s-4 7-11 7" {...common} />
      </svg>
    );
  }

  if (appId === 'lms' || appId === 'library') {
    return (
      <svg viewBox="0 0 72 56" aria-hidden="true" className="workspace-doodle">
        <path d="M14 13c8-3 15-1 22 4v29c-7-5-14-7-22-4V13Z" {...common} />
        <path d="M36 17c7-5 14-7 22-4v29c-8-3-15-1-22 4V17Z" {...common} />
        <path d="M21 23h8M21 31h8M44 23h7M44 31h7" {...common} />
      </svg>
    );
  }

  if (appId === 'ems' || appId === 'exam') {
    return (
      <svg viewBox="0 0 72 56" aria-hidden="true" className="workspace-doodle">
        <path d="M21 8h27l8 8v31H21V8Z" {...common} />
        <path d="M48 8v10h9M29 24h16M29 32h12" {...common} />
        <path d="M26 42l5 5 13-15" {...common} />
      </svg>
    );
  }

  if (appId === 'erp') {
    return (
      <svg viewBox="0 0 72 56" aria-hidden="true" className="workspace-doodle">
        <rect x="12" y="12" width="48" height="28" rx="5" {...common} />
        <path d="M20 22h13M20 30h22M28 46h16M36 40v6" {...common} />
        <path d="M49 22h3M49 30h3" {...common} />
      </svg>
    );
  }

  if (appId === 'teams') {
    return (
      <svg viewBox="0 0 72 56" aria-hidden="true" className="workspace-doodle">
        <path d="M13 17h31v21H26l-10 8v-8h-3V17Z" {...common} />
        <path d="M46 24h13v17h-6v6l-7-6" {...common} />
        <path d="M22 27h14M22 33h9" {...common} />
      </svg>
    );
  }

  if (appId === 'placement') {
    return (
      <svg viewBox="0 0 72 56" aria-hidden="true" className="workspace-doodle">
        <rect x="14" y="18" width="44" height="28" rx="5" {...common} />
        <path d="M28 18v-5h16v5M14 29h44M32 32h8" {...common} />
        <path d="M52 13l4-4M57 18h6M49 9l1-5" {...common} />
      </svg>
    );
  }

  if (appId === 'iqac') {
    return (
      <svg viewBox="0 0 72 56" aria-hidden="true" className="workspace-doodle">
        <path d="M36 8l7 14 15 2-11 10 3 15-14-8-14 8 3-15-11-10 15-2 7-14Z" {...common} />
        <path d="M29 30l5 5 10-12" {...common} />
      </svg>
    );
  }

  if (appId === 'helpdesk') {
    return (
      <svg viewBox="0 0 72 56" aria-hidden="true" className="workspace-doodle">
        <path d="M18 31v-5c0-10 7-17 18-17s18 7 18 17v5" {...common} />
        <path d="M18 30h8v13h-8V30ZM46 30h8v13h-8V30ZM46 43c-2 5-6 7-12 7" {...common} />
        <path d="M31 50h6" {...common} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 56" aria-hidden="true" className="workspace-doodle">
      <path d="M18 14h36v28H18V14Z" {...common} />
      <path d="M26 23h20M26 31h12M22 48h28" {...common} />
    </svg>
  );
}

interface DashboardProps {
  user: UserProfile;
  applications: ApplicationItem[];
  loading: boolean;
  onNavigate: (page: string) => void;
  onOpenApp: (app: ApplicationItem) => void;
}

export default function ReferenceDashboard({ user, applications, loading, onNavigate, onOpenApp }: DashboardProps) {
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [grievanceText, setGrievanceText] = useState(() => {
    try { return localStorage.getItem(`dypiu-grievance-draft:${user.id}`) ?? ''; }
    catch { return ''; }
  });
  const [draftError, setDraftError] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false);
  const [directorySearch, setDirectorySearch] = useState('');

  const userName = user.name;
  const userSubtitle = `${user.role === 'student' ? 'PRN' : 'Emp'}: ${user.collegeId}`;
  const filteredApps = applications.map(app => {
    const reference = APPLICATIONS.find(item => item.id === app.id || item.name.toLowerCase() === app.name.toLowerCase());
    return {
      ...app,
      desc: reference?.desc ?? app.description,
      icon: reference?.icon ?? GraduationCap,
      displayCategory: reference?.category ?? 'Workspace',
    };
  });
  const filteredDirectory = DIRECTORY.filter((person) =>
    `${person.name} ${person.role}`.toLowerCase().includes(directorySearch.trim().toLowerCase())
  );

  const handleRaiseGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceText.trim()) return;
    try {
      localStorage.setItem(`dypiu-grievance-draft:${user.id}`, grievanceText);
      setGrievanceSubmitted(true);
      setDraftError('');
    } catch {
      setDraftError('Your browser could not save this draft. Please copy your concern before leaving.');
    }
  };

  return (
    <div className="reference-dashboard w-full max-w-[1440px] min-h-screen bg-[#f9fafb] text-[#0c1e38] font-sans flex flex-col overflow-hidden mx-auto my-0 relative shadow-2xl">
      
      {/* HEADER - CRISP WHITE & BRANDED */}
      <header className="h-[64px] bg-white text-[#0c1e38] flex items-center justify-between px-8 shrink-0 z-20 shadow-sm relative border-b border-[#0c1e38]/10">
        <div className="flex items-center gap-2">
          <img src={imgLogo} alt="DYPIU Logo" className="h-11 w-auto shrink-0 object-contain" />
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center select-none">
            <span className="text-2xl font-black tracking-tighter relative">
              <span className="text-[#0c1e38]">Uni</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#ec510d] to-[#de4909] drop-shadow-sm">One</span>
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <button aria-label="Notifications" onClick={() => onNavigate('notifications')} className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100">
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-[#ec510d] rounded-full"></span>
          </button>

          <div className="h-6 w-px bg-slate-200"></div>

          <button onClick={() => onNavigate('profile')} className="flex items-center gap-2 cursor-pointer group">
            <div className="text-right leading-none">
              <div className="text-xs font-bold text-[#0c1e38]">{userName}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">{userSubtitle}</div>
            </div>
            <img src={imgProfile} alt="User Avatar" className="size-8 rounded-full border border-slate-200 object-cover" />
          </button>
        </div>
      </header>

      {/* MAIN DASHBOARD CANVAS */}
      <main className="flex-1 p-8 gap-8 dashboard-canvas grid grid-cols-12 bg-[#f9fafb]">
        
        {/* LEFT COLUMN (8 Cols) */}
        <div className="col-span-8 flex flex-col gap-8 min-h-0">
          
          {/* USER GREETING */}
          <div className="dashboard-greeting flex items-center justify-between gap-5">
            <div className="min-w-0">
              <h1 className="text-3xl font-serif font-bold text-[#0c1e38] tracking-tight">
                Good morning, {userName.split(' ')[0]} 👋
              </h1>
              <p className="text-[15px] font-medium text-slate-500 mt-2">
                Here is what's happening across the campus today.
              </p>
            </div>
            <section className="dashboard-thought shrink-0 w-[320px] bg-white border border-orange-100 rounded-2xl px-4 py-3 shadow-[0_12px_34px_rgb(12,30,56,0.08)] relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#0c1e38] to-[#ec510d]"></div>
              <div className="absolute -right-8 -top-8 size-20 rounded-full bg-orange-100/70"></div>
              <div className="relative z-10 flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="size-7 rounded-full bg-orange-50 text-[#ec510d] flex items-center justify-center">
                    <Sparkles className="size-3.5" />
                  </span>
                  <h2 className="text-sm font-serif font-bold text-[#0c1e38]">Daily Thoughts</h2>
                </div>
                <span className="text-3xl font-serif leading-none text-[#ec510d]/20">“</span>
              </div>
              <p className="relative z-10 text-xs font-semibold leading-relaxed text-slate-600">
                Small steps every day build the confidence for bigger ideas tomorrow.
              </p>
            </section>
          </div>

          {/* APPS LAUNCHER */}
          <section className="dashboard-workspace bg-white rounded-3xl shadow-[0_8px_40px_rgb(12,30,56,0.06)] flex flex-col shrink-0 overflow-hidden relative border border-slate-100">
            {/* Elegant Header Accent */}
            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#0c1e38] via-indigo-800 to-[#ec510d] z-20"></div>

            <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50 relative z-10 bg-white">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-serif font-bold text-[#0c1e38] tracking-tight">Your Workspace</h2>
              </div>
              <a href="#applications" onClick={(event) => { event.preventDefault(); onNavigate('applications'); }} className="text-xs font-bold text-[#ec510d] hover:text-[#de4909] flex items-center gap-1 px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
                View All Apps <ChevronRight className="size-3.5" />
              </a>
            </div>

            <div className="p-8 pt-6 grid grid-cols-3 gap-6 relative z-10 bg-gradient-to-b from-white to-slate-50/30">
              {loading && <p role="status" className="col-span-full text-sm text-slate-500">Loading your workspace…</p>}
              {!loading && filteredApps.length === 0 && <p className="col-span-full text-sm text-slate-500">No applications are assigned to your account.</p>}
              {filteredApps.slice(0, 6).map((app) => {
                const getAppStyle = (category: string) => {
                  switch(category) {
                    case 'Academic': return {
                      accent: 'bg-indigo-500',
                      doodle: 'bg-indigo-50/80 border-indigo-100',
                    };
                    case 'Admin': return {
                      accent: 'bg-amber-500',
                      doodle: 'bg-amber-50/80 border-amber-100',
                    };
                    case 'Resources': return {
                      accent: 'bg-emerald-500',
                      doodle: 'bg-emerald-50/80 border-emerald-100',
                    };
                    case 'Comm': return {
                      accent: 'bg-fuchsia-500',
                      doodle: 'bg-fuchsia-50/80 border-fuchsia-100',
                    };
                    case 'Career': return {
                      accent: 'bg-sky-500',
                      doodle: 'bg-sky-50/80 border-sky-100',
                    };
                    case 'Quality': return {
                      accent: 'bg-rose-500',
                      doodle: 'bg-rose-50/80 border-rose-100',
                    };
                    case 'Support': return {
                      accent: 'bg-[#ec510d]',
                      doodle: 'bg-orange-50/80 border-orange-100',
                    };
                    default: return {
                      accent: 'bg-slate-400',
                      doodle: 'bg-slate-50 border-slate-100',
                    };
                  }
                };
                
                const appStyle = getAppStyle(app.displayCategory);
                
                return (
                  <a
                    key={app.id}
                    href={app.url} onClick={(event) => { event.preventDefault(); onOpenApp(app); }}
                    className="workspace-app group border border-slate-200/70 rounded-[20px] p-5 flex flex-col justify-between h-[132px] transition-all duration-300 hover:-translate-y-1 hover:border-[#0c1e38]/20 shadow-[0_8px_22px_rgb(12,30,56,0.04)] hover:shadow-[0_16px_32px_rgb(12,30,56,0.08)] relative overflow-hidden bg-white"
                  >
                    <div className={`absolute inset-y-4 left-0 w-1 rounded-r-full ${appStyle.accent}`}></div>

                    <div className="relative z-10 flex items-start justify-between">
                      <div className={`workspace-doodle-wrap rounded-2xl border shadow-sm group-hover:scale-105 transition-all duration-300 ${appStyle.doodle}`}>
                        <AppDoodle appId={app.id} category={app.displayCategory} />
                      </div>
                      
                      {/* Go Button */}
                      <div className="size-8 rounded-full bg-white border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-[#ec510d] transition-all duration-300 translate-x-4 group-hover:translate-x-0 shadow-sm">
                        <ChevronRight className="size-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="relative z-10 mt-4">
                      <h3 className="text-[15px] font-bold text-[#0c1e38] group-hover:text-[#ec510d] transition-colors leading-tight mb-1.5 truncate">
                        {app.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 line-clamp-1 group-hover:text-slate-600 transition-colors">
                        {app.desc}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <div className="dashboard-lower flex-1 min-h-0">
            <section className="dashboard-action-stack grid grid-cols-[1.05fr_1.1fr_1.65fr] gap-3 items-start">
              <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-3 shadow-sm">
                <h3 className="text-sm font-serif font-bold text-[#0c1e38] tracking-tight mb-3">Campus Support</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="size-11 rounded-full bg-[#ec510d] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <AlertCircle className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#0c1e38]">Grievance Cell</h4>
                      <p className="text-[10px] font-medium text-slate-600 leading-snug">Have an issue or concern? We are here to help.</p>
                    </div>
                  </div>
                  {grievanceSubmitted ? (
                    <div className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#ec510d] flex items-center justify-center gap-2 border border-orange-100">
                      <CheckCircle2 className="size-4" /> Draft saved
                      <button onClick={() => setGrievanceSubmitted(false)} className="underline">Edit</button>
                    </div>
                  ) : isGrievanceOpen ? (
                    <form onSubmit={handleRaiseGrievance} className="space-y-2 rounded-xl bg-white p-3 border border-orange-100">
                      {draftError && <p role="alert" className="text-xs text-[#ec510d]">{draftError}</p>}
                      <textarea
                        value={grievanceText}
                        onChange={(e) => setGrievanceText(e.target.value)}
                        aria-label="Describe your concern"
                        placeholder="Describe your concern..."
                        className="w-full h-14 bg-slate-50 text-[#0c1e38] text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 resize-none placeholder-slate-500"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => setIsGrievanceOpen(false)} className="text-xs font-bold text-slate-500 hover:text-[#0c1e38] px-2 py-1">Cancel</button>
                        <button type="submit" className="bg-[#ec510d] hover:bg-[#de4909] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <Send className="size-3" /> Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => setIsGrievanceOpen(true)} className="w-full bg-[#ff4f12] hover:bg-[#de4909] text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                      Raise a Ticket <ChevronRight className="size-3.5" />
                    </button>
                  )}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                    <div className="flex items-start gap-3">
                      <span className="size-10 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <Users className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#0c1e38]">Communication Channel</h4>
                        <p className="text-[10px] font-medium text-slate-600 leading-snug">Connect with the university community for updates and announcements.</p>
                      </div>
                    </div>
                    {!isCommunicationOpen ? (
                      <button onClick={() => setIsCommunicationOpen(true)} className="mt-3 w-full bg-white text-blue-700 border border-blue-200 hover:border-blue-300 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        Open Channel <ChevronRight className="size-3.5" />
                      </button>
                    ) : (
                      <div className="mt-3 rounded-xl bg-white border border-blue-100 p-2">
                        <label className="relative block">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                          <input value={directorySearch} onChange={(event) => setDirectorySearch(event.target.value)} placeholder="Search directory names..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs font-medium text-[#0c1e38] outline-none focus:border-blue-300 focus:bg-white" />
                        </label>
                        <div className="mt-2 space-y-1.5">
                          {filteredDirectory.slice(0, 3).map((person) => (
                            <button key={`${person.name}-${person.role}`} onClick={() => onNavigate('applications')} className="w-full rounded-lg bg-slate-50 px-2.5 py-1.5 text-left hover:bg-blue-50 transition-colors">
                              <span className="block text-[11px] font-bold text-[#0c1e38]">{person.name}</span>
                              <span className="block text-[9px] font-medium text-slate-500">{person.role}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="dashboard-birthdays rounded-2xl bg-gradient-to-br from-pink-50 via-white to-orange-50 border border-pink-100 shadow-sm px-4 py-3 relative overflow-hidden">
                <div className="absolute -right-7 -top-7 size-20 rounded-full bg-pink-200/45 pointer-events-none"></div>
                <div className="absolute right-9 top-9 size-3 rounded-full bg-[#ec510d]/25 pointer-events-none"></div>
                <div className="absolute right-5 bottom-5 size-2 rounded-full bg-pink-400/30 pointer-events-none"></div>
                <div className="relative z-10 flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <h3 className="text-sm font-serif font-bold text-[#0c1e38] tracking-tight">Birthdays Today</h3>
                  </div>
                  <a href="#birthdays" onClick={(event) => event.preventDefault()} className="text-[10px] font-bold text-blue-600 flex items-center gap-1">View All <ChevronRight className="size-3" /></a>
                </div>
                <div className="relative z-10 space-y-2">
                  {BIRTHDAYS.map((person) => (
                    <div key={person.name} className="flex items-center justify-between gap-2 rounded-xl bg-white/80 px-3 py-2 border border-white/70 shadow-[0_6px_16px_rgb(236,81,13,0.06)]">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="size-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {person.name.split(' ').map(part => part[0]).join('')}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#0c1e38] truncate">{person.name}</div>
                          <div className="text-[10px] font-medium text-slate-500 truncate">{person.role}</div>
                        </div>
                      </div>
                      <Cake className="size-4 text-[#ec510d] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-policy rounded-2xl bg-gradient-to-br from-[#0c1e38] via-[#132b4d] to-[#0c1e38] border border-[#0c1e38]/20 shadow-lg px-4 py-3 relative overflow-hidden">
                <div className="absolute -right-8 -bottom-10 w-32 h-40 rounded-2xl border border-white/10 bg-white/5 rotate-[-10deg] pointer-events-none"></div>
                <div className="absolute right-3 top-3 h-16 w-20 rounded-xl border border-white/10 pointer-events-none"></div>
                <div className="relative z-10 flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <h3 className="text-sm font-serif font-bold text-white tracking-tight">University Policy</h3>
                  </div>
                  <a href="#policies" onClick={(event) => event.preventDefault()} className="text-[10px] font-bold text-sky-200 hover:text-white flex items-center gap-1">View All <ChevronRight className="size-3" /></a>
                </div>
                <div className="relative z-10 space-y-2">
                  {[
                    ['Code of Conduct Policy', 'Effective from 1 Sep 2025', 'Updated'],
                    ['Attendance Guidelines', 'For all students and faculty', 'Reminder'],
                    ['Academic Integrity Policy', 'Maintaining ethical standards', ''],
                    ['Leave and Permission Policy', 'Applicable for staff and faculty', ''],
                  ].map(([title, detail, badge]) => (
                    <div key={title} className="flex items-center justify-between gap-3 rounded-xl bg-white/95 px-2.5 py-2 border border-white/20 hover:bg-white transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="size-7 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                          <FileText className="size-3.5" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-[#0c1e38] truncate">{title}</h4>
                            {badge && <span className="shrink-0 rounded-full bg-orange-50 px-1.5 py-0.5 text-[8px] font-bold text-[#ec510d]">{badge}</span>}
                          </div>
                          <p className="text-[10px] font-medium text-slate-500 truncate">{detail}</p>
                        </div>
                      </div>
                      <ChevronRight className="size-3.5 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          
        </div>

        {/* RIGHT COLUMN (4 Cols) */}
        <div className="col-span-4 flex flex-col gap-6 min-h-0">
          
          {/* NOTICE BOARD */}
          <section className="dashboard-notices flex flex-col overflow-hidden relative rounded-2xl border-8 border-black bg-black shadow-inner">
            {/* Pegboard dot pattern using highly performant CSS radial gradient */}
            <div className="absolute inset-0 z-0 opacity-35 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
            
            <div className="flex items-center justify-between px-5 py-4 bg-black border-b border-white/10 relative z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-serif font-bold text-white tracking-tight">Notice Board</h3>
              </div>
              <a href="#notifications" onClick={(event) => { event.preventDefault(); onNavigate('notifications'); }} className="text-[11px] font-bold text-[#ec510d] hover:text-orange-300 hover:underline flex items-center gap-0.5">
                View All <ChevronRight className="size-3" />
              </a>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 relative z-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {NOTICES.map((notice, i) => (
                <div key={notice.id} className={`group cursor-pointer p-4 bg-[#fffcfa] rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 relative ${i % 2 === 0 ? 'rotate-[-1deg] hover:rotate-0' : 'rotate-[1deg] hover:rotate-0'} origin-top`}>
                  
                  {/* Notice Board Pin */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 size-4 rounded-full bg-red-500 shadow-[0_3px_5px_rgba(239,68,68,0.5)] border border-red-600 z-20 flex items-center justify-center">
                    <div className="size-1.5 rounded-full bg-white/60"></div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {notice.tag}
                      </span>
                      {notice.isNew && (
                        <span className="text-[9px] font-bold text-[#ec510d] px-1.5 py-0.5 bg-orange-50 border border-orange-100 rounded-md">New</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="size-3" /> {notice.time}
                    </span>
                  </div>
                  <h4 className="text-[13px] font-bold text-[#0c1e38] group-hover:text-[#ec510d] leading-snug transition-colors">
                    {notice.title}
                  </h4>
                </div>
              ))}
            </div>
          </section>

          {/* UPCOMING EVENTS */}
          <section className="dashboard-events bg-[#0c1e38] rounded-2xl shadow-lg flex flex-col shrink-0 overflow-hidden relative text-white h-[220px]">
            <div className="absolute -right-16 -bottom-16 w-64 h-64 border-[16px] border-white/5 rounded-full pointer-events-none z-0"></div>
            <div className="flex items-center justify-between px-5 py-4 relative z-10">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-white tracking-tight">Events</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-3 relative z-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {EVENTS.map((evt) => (
                <div key={evt.id} className="flex gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="rounded-lg bg-white/10 w-[52px] h-[60px] flex flex-col items-center justify-center shrink-0">
                    <div className="text-[10px] font-bold uppercase text-[#ec510d]">{evt.month}</div>
                    <div className="text-xl font-bold text-white leading-none mt-0.5">{evt.day}</div>
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <h5 className="text-xs font-bold text-white leading-snug mb-1.5 truncate">{evt.title}</h5>
                    <div className="flex items-center gap-3 text-[10px] text-slate-300 font-medium">
                      <span className="flex items-center gap-1"><Clock className="size-3" />{evt.time}</span>
                      <span className="flex items-center gap-1 truncate"><MapPin className="size-3" />{evt.venue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
