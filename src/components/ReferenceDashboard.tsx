import React, { useEffect, useRef, useState } from 'react';
import imgLogo from "../assets/dashboard/logo.png";
import { Bell, AlertCircle, ChevronRight, BookOpen, GraduationCap, FileText, Laptop, Bookmark, Users, CheckCircle2, Briefcase, Award, HelpCircle, Clock, MapPin, Send, Sparkles, Search, X, Cake, Gift, User, Settings, LogOut } from 'lucide-react';
import type { ApplicationItem, UserProfile } from '../types';
import { NotificationPanel } from './NotificationPanel';
import { mockNotifications } from '../data/mockData';

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
  {
    id: 1,
    tag: 'Academic',
    title: 'End Semester Exam Schedule Released for Spring 2026',
    time: '10m ago',
    isNew: true,
    issuedBy: 'Controller of Examinations',
    description: 'The official datesheet for May 2026 End-Semester Examinations has been published. All students are advised to check their respective course exam schedules, hall ticket eligibility status, and room allocations on the Examination Engine portal.',
    details: [
      'Examinations commence on May 10, 2026.',
      'Admit cards will be available for download starting May 1, 2026.',
      'Ensure clear attendance and fee clearance before downloading hall tickets.',
    ],
  },
  {
    id: 2,
    tag: 'Admin',
    title: 'DYPIU Research Grant Applications Open for AY 2026-27',
    time: '2h ago',
    isNew: true,
    issuedBy: 'Office of Dean Research & Innovation',
    description: 'Applications are officially open for the DYPIU Seed Research Grant for AY 2026-27. Faculty members and postgraduate scholars are invited to submit interdisciplinary project proposals.',
    details: [
      'Grant funding up to ₹5,000,000 per approved proposal.',
      'Submission deadline: April 15, 2026 via UDMS Research Portal.',
      'Priority domains: Artificial Intelligence, Clean Tech, & Quantum Computing.',
    ],
  },
  {
    id: 3,
    tag: 'Placement',
    title: 'Campus Drive: Microsoft & Cognizant Registration Extended',
    time: '1d ago',
    isNew: false,
    issuedBy: 'Corporate Relations & Placement Cell',
    description: 'The registration deadline for the upcoming joint campus placement drive with Microsoft India and Cognizant has been extended until Friday, 6:00 PM.',
    details: [
      'Eligible batches: B.Tech CSE, ECE, & MCA (2026 passing out).',
      'Minimum CGPA cutoff: 7.0 with no active backlogs.',
      'Upload updated resume and certificates on Placement Cell portal.',
    ],
  },
  {
    id: 4,
    tag: 'IT Services',
    title: 'Scheduled ERP & WiFi Maintenance on Saturday Midnight',
    time: '2d ago',
    isNew: false,
    issuedBy: 'University IT Infrastructure Desk',
    description: 'A planned system maintenance and bandwidth upgrade will take place across campus network servers and the ERP portal on Saturday from 11:30 PM to 04:00 AM.',
    details: [
      'ERP Portal and Campus WiFi will experience intermittent downtime.',
      'LMS and MS Teams services will remain operational during maintenance.',
      'For emergency technical queries, contact IT Helpdesk at ex. 4040.',
    ],
  },
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
  { name: 'Siddharth Joshi', role: 'ECE Faculty' },
] as const;

const DUMMY_APPS: ApplicationItem[] = [
  {
    id: 'research-hub',
    name: 'Research Hub',
    description: 'Projects & publications',
    category: 'Research',
    iconName: 'Award',
    ssoEnabled: false,
    isFavorite: false,
    url: '#',
  },
  {
    id: 'hostel-desk',
    name: 'Hostel Desk',
    description: 'Rooms & requests',
    category: 'Administration',
    iconName: 'HelpCircle',
    ssoEnabled: false,
    isFavorite: false,
    url: '#',
  },
  {
    id: 'club-zone',
    name: 'Club Zone',
    description: 'Student clubs & events',
    category: 'Productivity',
    iconName: 'Users',
    ssoEnabled: false,
    isFavorite: false,
    url: '#',
  },
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

type WorkspaceApp = ApplicationItem & {
  desc: string;
  icon: typeof GraduationCap;
  displayCategory: string;
  isDummy?: boolean;
};

const toApplicationCategory = (category: string): ApplicationItem['category'] => {
  if (category === 'Admin' || category === 'Support') return 'Administration';
  if (category === 'Resources') return 'Library';
  if (category === 'Comm' || category === 'Quality') return 'Productivity';
  if (category === 'Career') return 'Career';
  return 'Academic';
};

export default function ReferenceDashboard({ user, applications, loading, onNavigate, onOpenApp }: DashboardProps) {
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [grievanceText, setGrievanceText] = useState(() => {
    try { return localStorage.getItem(`dypiu-grievance-draft:${user.id}`) ?? ''; }
    catch { return ''; }
  });
  const [draftError, setDraftError] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<typeof NOTICES[number] | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [failedProfilePhoto, setFailedProfilePhoto] = useState<string | null>(null);
  const [directorySearch, setDirectorySearch] = useState('');
  const [notifications, setNotifications] = useState(mockNotifications);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user.name;
  const userInitials = userName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?';
  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const userSubtitle = `${user.role === 'student' ? 'PRN' : 'Emp'}: ${user.collegeId}`;
  const filteredApps: WorkspaceApp[] = applications.map(app => {
    const reference = APPLICATIONS.find(item => item.id === app.id || item.name.toLowerCase() === app.name.toLowerCase());
    return {
      ...app,
      desc: reference?.desc ?? app.description,
      icon: reference?.icon ?? GraduationCap,
      displayCategory: reference?.category ?? 'Workspace',
    };
  });
  const supplementalApps = APPLICATIONS
    .filter((app) => !filteredApps.some((assignedApp) => assignedApp.id === app.id))
    .map((app): WorkspaceApp => ({
      id: app.id,
      name: app.name,
      description: app.desc,
      category: toApplicationCategory(app.category),
      iconName: app.name,
      ssoEnabled: false,
      isFavorite: false,
      url: '#',
      desc: app.desc,
      icon: app.icon,
      displayCategory: app.category,
      isDummy: true,
    }));
  const workspaceApps: WorkspaceApp[] = [
    ...filteredApps,
    ...supplementalApps,
  ].slice(0, 3).concat(
    DUMMY_APPS.map((app) => {
      const reference = APPLICATIONS.find(item => item.id === app.id || item.name.toLowerCase() === app.name.toLowerCase());
      return {
        ...app,
        desc: app.description,
        icon: reference?.icon ?? (app.iconName === 'Users' ? Users : app.iconName === 'Award' ? Award : HelpCircle),
        displayCategory: app.category === 'Research' ? 'Quality' : app.category === 'Administration' ? 'Support' : 'Comm',
        isDummy: true,
      };
    })
  );
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
    <div className="reference-dashboard w-full min-w-0 min-h-screen bg-[#f9fafb] text-[#0c1e38] font-sans flex flex-col overflow-x-hidden relative">
      {isCommunicationOpen && (
        <button
          aria-label="Close communication overlay"
          onClick={() => setIsCommunicationOpen(false)}
          className="fixed inset-0 z-45 cursor-default bg-slate-900/20 backdrop-blur-sm"
        />
      )}

      {isGrievanceOpen && (
        <button
          aria-label="Close grievance overlay"
          onClick={() => setIsGrievanceOpen(false)}
          className="fixed inset-0 z-50 cursor-default bg-slate-900/40 backdrop-blur-sm"
        />
      )}

      {/* HEADER - CRISP WHITE & BRANDED */}
      <header className={`h-[var(--header-height)] bg-white text-[#0c1e38] flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 shadow-sm relative border-b border-[#0c1e38]/10 ${isCommunicationOpen || isGrievanceOpen ? 'z-50' : 'z-40'}`}>
        <div className="dashboard-brand flex shrink-0 items-center gap-2">
          <img src={imgLogo} alt="DYPIU Logo" className="h-9 sm:h-10 w-auto max-h-full object-contain shrink-0" />
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center select-none shrink-0">
            <span className="text-xl sm:text-2xl font-black tracking-tighter relative">
              <span className="text-[#0c1e38]">Uni</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#ec510d] to-[#de4909] drop-shadow-sm">One</span>
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className="dashboard-header-actions flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={() => {
              if (!isCommunicationOpen) setIsGrievanceOpen(true);
            }}
            disabled={isCommunicationOpen}
            className={`h-9 px-3 rounded-full bg-[#ec510d] text-white hover:bg-[#de4909] flex items-center gap-2 text-xs font-bold shadow-sm transition-colors shrink-0 ${isCommunicationOpen ? 'pointer-events-none opacity-80' : ''}`}
            aria-label="Open Grievance Cell form"
          >
            <AlertCircle className="size-4" />
            <span className="dashboard-action-label hidden sm:inline">Grievance Cell</span>
          </button>

          <div className="dashboard-nav-chat relative z-50">
            {isCommunicationOpen && (
              <div className="absolute right-0 top-[calc(var(--header-height)-4px)] w-[min(320px,calc(100vw-32px))] rounded-2xl bg-white border border-slate-100 shadow-[0_20px_46px_rgb(12,30,56,0.22)] overflow-hidden z-50">
                <div className="bg-[#0c1e38] text-white px-3.5 py-2.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-serif font-bold">Communication Channel</h3>
                    <p className="text-[10px] text-white/70 mt-0.5">Search the campus directory</p>
                  </div>
                  <button
                    aria-label="Close communication channel"
                    onClick={() => setIsCommunicationOpen(false)}
                    className="size-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="p-3">
                  <label className="relative block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      value={directorySearch}
                      onChange={(event) => setDirectorySearch(event.target.value)}
                      placeholder="Search directory names..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-medium text-[#0c1e38] outline-none focus:border-[#ec510d]/50 focus:bg-white"
                    />
                  </label>
                  <div className="mt-3 space-y-1.5">
                    {filteredDirectory.slice(0, 3).map((person) => (
                      <button
                        key={`${person.name}-${person.role}`}
                        onClick={() => onNavigate('applications')}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-left hover:bg-orange-50/60 transition-colors"
                      >
                        <span className="block text-xs font-bold text-[#0c1e38]">{person.name}</span>
                        <span className="block text-[10px] font-medium text-slate-500 mt-0.5">{person.role}</span>
                      </button>
                    ))}
                    {filteredDirectory.length === 0 && (
                      <p className="rounded-xl bg-slate-50 px-3 py-3 text-xs font-medium text-slate-500">No directory match found.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCommunicationOpen((open) => !open)}
              className="h-9 px-3 rounded-full bg-[#0c1e38] text-white hover:bg-[#142b4b] flex items-center gap-2 text-xs font-bold shadow-sm transition-colors"
              aria-label="Open communication channel"
            >
              <Users className="size-4" />
              <span className="dashboard-action-label hidden sm:inline">Communication</span>
            </button>
          </div>

          <div ref={notifRef} className="relative z-50">
            <button
              aria-label="Notifications"
              onClick={() => setIsNotifOpen((open) => !open)}
              className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 bg-[#ec510d] rounded-full"></span>
            </button>
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50">
                <NotificationPanel
                  notifications={notifications}
                  currentRole={user.role}
                  onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))}
                  onViewAll={() => {
                    setIsNotifOpen(false);
                    onNavigate('notifications');
                  }}
                />
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          <div ref={profileMenuRef} className="dashboard-profile-menu relative z-50">
            <button
              onClick={() => {
                setIsProfileMenuOpen((open) => !open);
                setIsCommunicationOpen(false);
              }}
              className="dashboard-profile flex items-center gap-2 cursor-pointer group"
              aria-label="Open profile menu"
              aria-expanded={isProfileMenuOpen}
            >
              <div className="text-right leading-none hidden md:block">
                <div className="text-xs font-bold text-[#0c1e38]">{userName}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">{userSubtitle}</div>
              </div>
              {user.avatar && failedProfilePhoto !== user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${userName}'s profile`}
                  referrerPolicy="no-referrer"
                  onError={() => setFailedProfilePhoto(user.avatar)}
                  className="size-8 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <span
                  aria-label={`${userName}'s profile`}
                  className="size-8 rounded-full border border-slate-200 bg-slate-100 text-[10px] font-extrabold text-[#0c1e38] flex items-center justify-center"
                >
                  {userInitials}
                </span>
              )}
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-b-2xl rounded-t-sm border border-slate-200 bg-white shadow-[0_18px_48px_rgb(12,30,56,0.16)]">
                <div className="px-5 py-4 bg-white">
                  <p className="text-base font-extrabold leading-tight text-[#02022D]">{userName}</p>
                  <p className="mt-1 truncate text-sm font-medium text-blue-600">{user.email}</p>
                </div>
                <div className="border-t border-slate-200">
                  <button
                    onClick={() => { onNavigate('profile'); setIsProfileMenuOpen(false); }}
                    className="flex w-full items-center gap-4 px-5 py-3.5 text-left text-base font-semibold text-[#02022D] hover:bg-slate-50 transition-colors"
                  >
                    <User className="size-5" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => { onNavigate('settings'); setIsProfileMenuOpen(false); }}
                    className="flex w-full items-center gap-4 px-5 py-3.5 text-left text-base font-semibold text-[#02022D] hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="size-5" />
                    <span>Preferences</span>
                  </button>
                </div>
                <button
                  onClick={() => { setIsProfileMenuOpen(false); window.location.href = '/logout'; }}
                  className="flex w-full items-center gap-4 border-t border-slate-200 px-5 py-3.5 text-left text-base font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="size-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CANVAS */}
      <main className="flex-1 dashboard-canvas bg-[#f9fafb]">
        
        {/* LEFT COLUMN */}
        <div className="dashboard-left flex flex-col justify-between min-h-0 min-w-0 h-full">
          
          {/* USER GREETING */}
          <section className="dashboard-greeting flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgb(12,30,56,0.045)]">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#0c1e38] tracking-tight">
                {timeGreeting}, {userName.split(' ')[0]} 👋
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 sm:mt-2">
                Here is what's happening across the campus today.
              </p>
            </div>
            <div className="dashboard-thought w-full sm:w-auto shrink-0 bg-orange-50/45 border border-orange-100/80 rounded-2xl p-3 sm:p-3.5 relative overflow-hidden">
              <div className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[#ec510d]"></div>
              <div className="relative z-10 flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-2">
                  <span className="size-6 sm:size-7 rounded-full bg-white text-[#ec510d] flex items-center justify-center shadow-sm">
                    <Sparkles className="size-3.5" />
                  </span>
                  <h2 className="text-xs sm:text-sm font-serif font-bold text-[#0c1e38]">Daily Thoughts</h2>
                </div>
              </div>
              <p className="relative z-10 text-[11px] sm:text-xs font-semibold leading-relaxed text-slate-600">
                Small steps every day build the confidence for bigger ideas tomorrow.
              </p>
            </div>
          </section>

          {/* APPS LAUNCHER */}
          <section className="dashboard-workspace bg-[#E9EEF7] rounded-2xl shadow-[0_16px_38px_rgb(12,30,56,0.16)] flex flex-col shrink-0 overflow-hidden relative border border-[#172b4d]/35">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0c1e38] via-[#314d83] to-[#ec510d] z-20"></div>

            <div className="workspace-header px-4 sm:px-5 py-3 flex items-center justify-between border-b border-slate-300/90 relative z-10 bg-[#dfe6f1]/95">
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#0c1e38] tracking-tight">Your Workspace</h2>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">Quick access to your campus tools</p>
              </div>
              <a href="#applications" onClick={(event) => { event.preventDefault(); onNavigate('applications'); }} className="text-xs font-bold text-[#d94a0c] hover:text-[#c53e08] flex items-center gap-1 px-3 sm:px-4 py-2 bg-white border border-orange-200 shadow-sm hover:shadow-md hover:bg-orange-50 rounded-xl transition-all">
                View All Apps <ChevronRight className="size-3.5" />
              </a>
            </div>

            <div className="workspace-grid px-4 sm:px-5 py-3 grid gap-3 relative z-10 bg-[#e8edf6]/70">
              {loading && <p role="status" className="col-span-full text-sm text-slate-500">Loading your workspace…</p>}
              {workspaceApps.map((app) => {
                const getAppStyle = (category: string) => {
                  switch(category) {
                    case 'Academic': return { accent: 'bg-indigo-500', doodle: 'bg-indigo-50/80 border-indigo-100' };
                    case 'Admin': return { accent: 'bg-amber-500', doodle: 'bg-amber-50/80 border-amber-100' };
                    case 'Resources': return { accent: 'bg-emerald-500', doodle: 'bg-emerald-50/80 border-emerald-100' };
                    case 'Comm': return { accent: 'bg-fuchsia-500', doodle: 'bg-fuchsia-50/80 border-fuchsia-100' };
                    case 'Career': return { accent: 'bg-sky-500', doodle: 'bg-sky-50/80 border-sky-100' };
                    case 'Quality': return { accent: 'bg-rose-500', doodle: 'bg-rose-50/80 border-rose-100' };
                    case 'Support': return { accent: 'bg-[#ec510d]', doodle: 'bg-orange-50/80 border-orange-100' };
                    default: return { accent: 'bg-slate-400', doodle: 'bg-slate-50 border-slate-100' };
                  }
                };
                
                const appStyle = getAppStyle(app.displayCategory);
                
                return (
                  <a
                    key={app.id}
                    href={app.url} onClick={(event) => { event.preventDefault(); if (!app.isDummy) onOpenApp(app); }}
                    className="workspace-app group border border-slate-200 rounded-xl p-3 flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ec510d]/45 shadow-[0_5px_12px_rgb(12,30,56,0.07)] hover:shadow-[0_12px_24px_rgb(12,30,56,0.12)] relative overflow-hidden bg-white/95"
                  >
                    <div className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${appStyle.accent}`}></div>

                    <div className={`workspace-doodle-wrap relative z-10 rounded-xl border shadow-sm group-hover:scale-105 transition-all duration-300 ${appStyle.doodle}`}>
                      <AppDoodle appId={app.id} category={app.displayCategory} />
                    </div>
                    
                    <div className="relative z-10 min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-[#0c1e38] group-hover:text-[#ec510d] transition-colors leading-tight truncate">
                        {app.name}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 line-clamp-2 group-hover:text-slate-600 transition-colors mt-0.5 leading-snug">
                        {app.desc}
                      </p>
                    </div>

                    <span className="relative z-10 size-6 sm:size-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#ec510d] group-hover:text-white group-hover:border-[#ec510d] transition-colors shrink-0">
                      <ChevronRight className="size-3.5" />
                    </span>
                  </a>
                );
              })}
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <div className="dashboard-lower min-h-0 mt-auto">
            <section className="dashboard-action-stack grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 items-stretch">
              <div className="dashboard-birthdays rounded-2xl bg-white border border-pink-100/90 shadow-sm p-4 relative overflow-hidden flex flex-col">
                <div className="relative z-10 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="size-8 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
                      <Gift className="size-4" />
                    </span>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[#0c1e38] tracking-tight">Birthdays Today</h3>
                  </div>
                  <a href="#birthdays" onClick={(event) => event.preventDefault()} className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-0.5">View All <ChevronRight className="size-3.5" /></a>
                </div>
                <div className="relative z-10 space-y-1.5 flex-1 flex flex-col justify-center">
                  {BIRTHDAYS.map((person, index) => {
                    const variants = [
                      'bg-rose-50/85 border-rose-100 text-rose-600',
                      'bg-orange-50/70 border-orange-100 text-orange-600',
                      'bg-purple-50/75 border-purple-100 text-purple-600',
                    ];
                    const variant = variants[index % variants.length];
                    return (
                    <div key={person.name} className={`birthday-row flex items-center justify-between gap-3 rounded-xl border px-3 py-1.5 shadow-[0_3px_8px_rgb(12,30,56,0.025)] ${variant}`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`birthday-avatar size-7 rounded-full bg-white flex items-center justify-center text-[10px] font-extrabold shrink-0 shadow-xs`}>
                          {person.name.split(' ').map(part => part[0]).join('')}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[11px] font-extrabold text-[#0c1e38] truncate">{person.name}</div>
                          <div className="text-[9px] font-medium text-slate-500 truncate">{person.role}</div>
                        </div>
                      </div>
                      <span className="birthday-cake size-6 rounded-full bg-white/60 flex items-center justify-center shrink-0">
                        <Cake className="size-3" />
                      </span>
                    </div>
                  )})}
                </div>
              </div>

              <div className="dashboard-policy rounded-2xl bg-gradient-to-br from-[#fff1d6] via-[#fff8ea] to-[#f6e7c6] border border-[#e8b45f]/55 shadow-lg p-4 relative overflow-hidden flex flex-col">
                <div className="relative z-10 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="size-8 rounded-xl bg-orange-100/80 text-[#ec510d] flex items-center justify-center shrink-0 border border-orange-200/60">
                      <FileText className="size-4" />
                    </span>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[#0c1e38] tracking-tight">University Policy</h3>
                  </div>
                  <a href="#policies" onClick={(event) => event.preventDefault()} className="text-xs font-bold text-[#ec510d] hover:text-[#c8430b] flex items-center gap-0.5">View All <ChevronRight className="size-3.5" /></a>
                </div>
                <div className="relative z-10 space-y-1.5 flex-1 flex flex-col justify-center">
                  {[
                    ['Code of Conduct Policy', 'Effective from 1 Sep 2025', 'Updated'],
                    ['Attendance Guidelines', 'For all students and faculty', 'Reminder'],
                    ['Academic Integrity Policy', 'Maintaining ethical standards', ''],
                    ['Campus IT & WiFi Policy', 'Fair usage & security rules', 'New'],
                  ].map(([title, detail, badge]) => (
                    <div key={title} className="flex items-center justify-between gap-3 rounded-xl bg-white/95 px-3 py-1.5 border border-white/40 shadow-[0_3px_8px_rgb(12,30,56,0.025)] hover:bg-white transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="size-7 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                          <FileText className="size-3" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-[11px] font-bold text-[#0c1e38] truncate">{title}</h4>
                            {badge && <span className="shrink-0 rounded-full bg-orange-50 px-1.5 py-0.5 text-[8px] font-bold text-[#ec510d]">{badge}</span>}
                          </div>
                          <p className="text-[9px] font-medium text-slate-500 truncate">{detail}</p>
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

        {/* RIGHT COLUMN */}
        <div className="dashboard-right flex flex-col justify-between min-h-0 min-w-0 h-full">
          
          {/* NOTICE BOARD */}
          <section className="dashboard-notices flex flex-col overflow-hidden relative rounded-2xl border-4 sm:border-8 border-[#252a32] bg-[#343a43] shadow-inner">
            {/* Pegboard dot pattern using highly performant CSS radial gradient */}
            <div className="absolute inset-0 z-0 opacity-35 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
            
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#252a32] border-b border-white/10 relative z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">Notice Board</h3>
              </div>
              <a href="#notifications" onClick={(event) => { event.preventDefault(); onNavigate('notifications'); }} className="text-[11px] font-bold text-[#ec510d] hover:text-orange-300 hover:underline flex items-center gap-0.5">
                View All <ChevronRight className="size-3" />
              </a>
            </div>
            <div className="flex flex-col p-2.5 sm:p-3 space-y-2 relative z-10">
              {NOTICES.slice(0, 4).map((notice, i) => (
                <div
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className={`group cursor-pointer px-3 py-2 bg-[#fffcfa] rounded-xl shadow-xs hover:shadow-sm transition-all border border-slate-200 relative ${i % 2 === 0 ? 'rotate-[-0.8deg] hover:rotate-0' : 'rotate-[0.8deg] hover:rotate-0'} origin-top`}
                >
                  
                  {/* Notice Board Pin */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-3.5 rounded-full bg-red-500 shadow-[0_2px_4px_rgba(239,68,68,0.4)] border border-red-600 z-20 flex items-center justify-center">
                    <div className="size-1 rounded-full bg-white/70"></div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {notice.tag}
                      </span>
                      {notice.isNew && (
                        <span className="text-[8px] sm:text-[9px] font-bold text-[#ec510d] px-1.5 py-0.5 bg-orange-50 border border-orange-100 rounded-md">New</span>
                      )}
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="size-2.5 sm:size-3" /> {notice.time}
                    </span>
                  </div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#0c1e38] group-hover:text-[#ec510d] leading-tight transition-colors truncate">
                    {notice.title}
                  </h4>
                </div>
              ))}
            </div>
          </section>

          {/* UPCOMING EVENTS */}
          <section className="dashboard-events bg-[#0c1e38] rounded-2xl shadow-lg flex flex-col shrink-0 overflow-hidden relative text-white">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 relative z-10">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">Events</h3>
              </div>
            </div>
            <div className="flex-1 p-3 pt-0 space-y-2.5 relative z-10">
              {EVENTS.slice(0, 3).map((evt) => (
                <div key={evt.id} className="flex gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="rounded-lg bg-white/10 w-11 h-12 flex flex-col items-center justify-center shrink-0">
                    <div className="text-[9px] font-bold uppercase text-[#ec510d]">{evt.month}</div>
                    <div className="text-base font-bold text-white leading-none mt-0.5">{evt.day}</div>
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h5 className="text-xs font-bold text-white leading-snug mb-1 truncate">{evt.title}</h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-300 font-medium">
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

      {isGrievanceOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center px-4">
          <form onSubmit={handleRaiseGrievance} className="w-full max-w-[460px] rounded-2xl bg-white border border-orange-100 shadow-[0_24px_70px_rgb(12,30,56,0.24)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#ec510d] to-[#de4909] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold">Grievance Cell</h3>
                <p className="text-xs text-white/80 mt-1">Fill your concern and save it as a draft.</p>
              </div>
              <button
                type="button"
                aria-label="Close grievance form"
                onClick={() => setIsGrievanceOpen(false)}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {draftError && <p role="alert" className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-medium text-[#ec510d]">{draftError}</p>}
              {grievanceSubmitted && (
                <div className="rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="size-4" /> Draft saved on this device
                </div>
              )}
              <label className="block">
                <span className="text-xs font-bold text-[#0c1e38]">Describe your concern</span>
                <textarea
                  value={grievanceText}
                  onChange={(e) => setGrievanceText(e.target.value)}
                  aria-label="Describe your concern"
                  placeholder="Write your academic, administrative, or hostel concern..."
                  className="mt-2 w-full h-32 bg-slate-50 text-[#0c1e38] text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#ec510d]/50 resize-none placeholder-slate-500"
                />
              </label>
              <p className="text-xs font-medium text-slate-500">Draft only. University ticket submission is not connected yet.</p>
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsGrievanceOpen(false)} className="text-xs font-bold text-slate-500 hover:text-[#0c1e38] px-3 py-2">Cancel</button>
                <button type="submit" className="bg-[#ec510d] hover:bg-[#de4909] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Send className="size-3.5" /> Save Draft
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="w-full max-w-[500px] rounded-2xl bg-white border border-slate-200 shadow-[0_24px_70px_rgb(12,30,56,0.28)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0c1e38] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#ec510d] text-white">
                  {selectedNotice.tag}
                </span>
                {selectedNotice.isNew && (
                  <span className="text-[10px] font-bold text-amber-300 px-2 py-0.5 bg-amber-500/20 rounded-md">New Notice</span>
                )}
              </div>
              <button
                type="button"
                aria-label="Close notice details"
                onClick={() => setSelectedNotice(null)}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <X className="size-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#0c1e38] leading-snug">
                  {selectedNotice.title}
                </h3>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500 font-medium pb-3 border-b border-slate-100">
                  <span className="flex items-center gap-1"><Clock className="size-3.5 text-[#ec510d]" /> Published {selectedNotice.time}</span>
                  <span className="font-semibold text-slate-700">{selectedNotice.issuedBy}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {selectedNotice.description}
              </p>

              {selectedNotice.details && selectedNotice.details.length > 0 && (
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 space-y-2">
                  <h4 className="text-xs font-extrabold text-[#0c1e38] uppercase tracking-wider">Key Details & Guidelines</h4>
                  <ul className="space-y-1.5">
                    {selectedNotice.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="size-1.5 rounded-full bg-[#ec510d] mt-1.5 shrink-0"></span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedNotice(null)}
                  className="bg-[#0c1e38] hover:bg-[#142b4b] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Close Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
