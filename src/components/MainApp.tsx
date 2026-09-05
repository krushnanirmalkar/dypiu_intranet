import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, CheckSquare, FileText, Headphones, MessageSquare, Newspaper, ShieldCheck, Users } from 'lucide-react';
import type { ApplicationItem, UserProfile, UserRole } from '../types';
import { mockEvents, mockNotifications } from '../data/mockData';
import { DEV_PREVIEW_APPLICATIONS, DEV_PREVIEW_USER, type AuthenticatedUser } from '../data/devPreviewData';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { AuditPage } from '../pages/AuditPage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ActivityHub } from './ActivityHub';
import { ApplicationsGrid } from './ApplicationsGrid';
import { AppSidebar } from './AppSidebar';
import { EventCard } from './EventCard';
import { TopNavbar } from './TopNavbar';
import { WelcomeBanner } from './WelcomeBanner';

const USE_DEV_PREVIEW = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH === 'true';

interface SessionUser {
  sub: string;
  name: string;
  email: string;
  roles: string[];
}

const resolveRoleByPrecedence = (roles: readonly string[]): UserRole | null => {
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('staff')) return 'staff';
  if (roles.includes('student')) return 'student';
  return null;
};

const resolvePreviewRole = (user: AuthenticatedUser): UserRole => {
  const previewRoles = Array.isArray(user.roles) ? user.roles : [];
  return resolveRoleByPrecedence(previewRoles) ?? user.role ?? 'student';
};

const createPreviewSessionUser = (user: AuthenticatedUser): SessionUser => {
  const previewRole = resolvePreviewRole(user);
  return {
    sub: user.sub ?? user.email,
    name: user.name,
    email: user.email,
    roles: Array.isArray(user.roles) && user.roles.length > 0 ? [...user.roles] : [previewRole],
  };
};

const hasValidIdentity = (user: unknown): user is { sub: string; name: string; email: string; roles?: unknown } => {
  if (typeof user !== 'object' || user === null) return false;
  const candidate = user as Record<string, unknown>;
  return typeof candidate.sub === 'string' && candidate.sub.length > 0
    && typeof candidate.name === 'string' && candidate.name.length > 0
    && typeof candidate.email === 'string' && candidate.email.length > 0;
};

const buildProfile = (user: SessionUser, role: UserRole): UserProfile => ({
  id: user.sub,
  name: user.name,
  email: user.email,
  role,
  roleTitle: role === 'staff' ? 'Staff' : role === 'admin' ? 'Administrator' : 'Student',
  avatar: '',
  collegeId: user.email.split('@')[0],
  department: 'D Y Patil International University',
  yearOrDesignation: role === 'student' ? 'Student' : role === 'staff' ? 'Staff' : 'Administration',
  bio: 'Member of the DYPIU campus community.',
  joinedYear: '',
  phone: '',
});

const applicationCategories: ApplicationItem['category'][] = [
  'Academic',
  'Administration',
  'Learning',
  'Library',
  'Examination',
  'Career',
  'Research',
  'Productivity',
];

const isApplicationCategory = (value: unknown): value is ApplicationItem['category'] => (
  typeof value === 'string' && applicationCategories.includes(value as ApplicationItem['category'])
);

const normalizeApplications = (payload: unknown): ApplicationItem[] => {
  const source = Array.isArray(payload)
    ? payload
    : typeof payload === 'object' && payload !== null && Array.isArray((payload as { applications?: unknown }).applications)
      ? (payload as { applications: unknown[] }).applications
      : [];

  return source.flatMap((item, index) => {
    if (typeof item !== 'object' || item === null) return [];
    const app = item as Record<string, unknown>;
    if (typeof app.name !== 'string' || typeof app.url !== 'string') return [];

    return [{
      id: typeof app.id === 'string' ? app.id : `application-${index}`,
      name: app.name,
      description: typeof app.description === 'string' ? app.description : 'University digital service.',
      category: isApplicationCategory(app.category) ? app.category : 'Productivity',
      iconName: typeof app.icon === 'string'
        ? app.icon
        : typeof app.iconName === 'string'
          ? app.iconName
          : 'LayoutDashboard',
      ssoEnabled: typeof app.ssoEnabled === 'boolean' ? app.ssoEnabled : true,
      isFavorite: typeof app.isFavorite === 'boolean' ? app.isFavorite : false,
      badgeText: typeof app.badgeText === 'string' ? app.badgeText : undefined,
      url: app.url,
      highlightColor: typeof app.highlightColor === 'string' ? app.highlightColor : undefined,
    }];
  });
};

const quickAccessItems = [
  { label: 'My Schedule', sub: 'View timetable', icon: CalendarDays, nav: 'academics', color: 'bg-blue-50 text-blue-600' },
  { label: 'My Tasks', sub: 'Pending tasks', icon: CheckSquare, nav: 'academics', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Feedback', sub: 'Share feedback', icon: MessageSquare, nav: 'support', color: 'bg-violet-50 text-violet-600' },
  { label: 'Help & Support', sub: 'Get assistance', icon: Headphones, nav: 'support', color: 'bg-sky-50 text-sky-600' },
];

export const MainApp: React.FC = () => {
  const isSignedOutPage = window.location.pathname === '/signed-out';
  const [authLoading, setAuthLoading] = useState(!USE_DEV_PREVIEW && !isSignedOutPage);
  const [authenticated, setAuthenticated] = useState(USE_DEV_PREVIEW);
  const [authenticatedUser, setAuthenticatedUser] = useState<SessionUser | null>(
    USE_DEV_PREVIEW ? createPreviewSessionUser(DEV_PREVIEW_USER) : null,
  );
  const [currentRole, setCurrentRole] = useState<UserRole | null>(
    USE_DEV_PREVIEW ? resolvePreviewRole(DEV_PREVIEW_USER) : null,
  );
  const [currentNav, setCurrentNav] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [applications, setApplications] = useState<ApplicationItem[]>(
    USE_DEV_PREVIEW ? DEV_PREVIEW_APPLICATIONS : [],
  );
  const [applicationsLoading, setApplicationsLoading] = useState(!USE_DEV_PREVIEW);
  const [notifications, setNotifications] = useState(mockNotifications);

  useEffect(() => {
    if (isSignedOutPage) {
      setAuthLoading(false);
      return;
    }

    if (USE_DEV_PREVIEW) {
      setAuthenticated(true);
      setAuthLoading(false);
      return;
    }

    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/me', { method: 'GET', credentials: 'include' });

        if (response.ok) {
          const data = await response.json() as { authenticated?: unknown; user?: unknown };

          if (data.authenticated === true && hasValidIdentity(data.user)) {
            const roles = Array.isArray(data.user.roles)
              ? data.user.roles.filter((role): role is string => typeof role === 'string')
              : [];
            const resolvedRole = resolveRoleByPrecedence(roles);

            if (!resolvedRole) {
              console.error('Authenticated user has no supported DYPIU role:', roles);
              window.location.href = '/signed-out';
              return;
            }

            setAuthenticatedUser({
              sub: data.user.sub,
              name: data.user.name,
              email: data.user.email,
              roles,
            });
            setCurrentRole(resolvedRole);
            setAuthenticated(true);
            setAuthLoading(false);
            return;
          }
        }

        setAuthenticated(false);
        setAuthLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setAuthenticated(false);
        setAuthLoading(false);
      }
    };

    void checkAuthentication();
  }, [isSignedOutPage]);

  useEffect(() => {
    if (isSignedOutPage) return;

    if (USE_DEV_PREVIEW) {
      setApplications(DEV_PREVIEW_APPLICATIONS);
      setApplicationsLoading(false);
      return;
    }

    if (!authenticated || !authenticatedUser || !currentRole) return;

    const loadApplications = async () => {
      setApplicationsLoading(true);
      try {
        const response = await fetch('/api/applications', { method: 'GET', credentials: 'include' });

        if (response.status === 401) {
          setAuthenticated(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Application request failed with status ${response.status}`);
        }

        setApplications(normalizeApplications(await response.json()));
      } catch (error) {
        console.error('Failed to load authorized applications:', error);
        setApplications([]);
      } finally {
        setApplicationsLoading(false);
      }
    };

    void loadApplications();
  }, [authenticated, authenticatedUser, currentRole, isSignedOutPage]);

  const currentUser = useMemo(
    () => authenticatedUser && currentRole ? buildProfile(authenticatedUser, currentRole) : null,
    [authenticatedUser, currentRole],
  );
  const unreadNotifCount = currentRole
    ? notifications.filter((item) => item.targetRoles.includes(currentRole) && !item.isRead).length
    : 0;

  const openApplication = (app: ApplicationItem) => {
    if (/^https?:\/\//i.test(app.url)) window.open(app.url, '_blank', 'noopener,noreferrer');
    else window.location.assign(app.url);
  };

  if (isSignedOutPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-800 text-white"><ShieldCheck className="h-7 w-7" /></div>
          <h1 className="text-2xl font-black text-navy-900">You have been signed out</h1>
          <p className="mt-3 text-sm text-navy-500">Your DYPIU Intranet session has been securely ended.</p>
          <button onClick={() => { window.location.href = '/login?reauth=1'; }} className="mt-6 w-full rounded-xl bg-navy-800 py-3 text-sm font-bold text-white">Sign in again</button>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-navy-50"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-navy-200 border-t-navy-800" /><p className="mt-3 text-sm font-semibold text-navy-700">Verifying university session...</p></div></div>;
  }

  if (!authenticated || !authenticatedUser || !currentRole || !currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#f7f9fd] font-sans text-navy-900">
      <AppSidebar currentRole={currentRole} currentNav={currentNav} onNavigate={setCurrentNav} isOpenMobile={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
      <TopNavbar
        user={currentUser}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        unreadNotifCount={unreadNotifCount}
        onNavigate={setCurrentNav}
        notifications={notifications}
        onMarkAllRead={() => setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))}
      />

      <main className="mx-auto w-full max-w-[1500px] px-4 py-3 sm:px-5 lg:px-6 lg:py-4">
        {currentNav === 'dashboard' && (
          <div className="space-y-3">
            <WelcomeBanner user={currentUser} />

            <div className="dashboard-layout grid grid-cols-1 items-start gap-3">
              <div className="space-y-3">
                <ApplicationsGrid
                  applications={applications}
                  onOpenApp={openApplication}
                  onToggleFavorite={() => {}}
                  onViewAllApps={() => setCurrentNav('applications')}
                  loading={applicationsLoading}
                />

                <div className="grid items-stretch gap-3 sm:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
                  <article className="group relative flex aspect-square w-full max-w-[260px] flex-col overflow-hidden rounded-[14px] border border-[#d9e2f1] bg-navy-950 p-5 shadow-[0_3px_12px_rgba(15,35,75,0.08)] transition hover:-translate-y-px hover:border-navy-300 hover:shadow-[0_10px_24px_rgba(15,35,75,0.14)] lg:max-w-[280px]">
                    <img src="/zenith-cover.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]" />
                    <div aria-hidden="true" className="absolute inset-0 bg-navy-950/5" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-900/30 to-transparent" />
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/60 bg-white/90 text-navy-900 shadow-sm backdrop-blur-sm"><Newspaper className="h-5 w-5" /></div>
                    <div className="relative mt-auto drop-shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-100">College Newspaper</p>
                      <div className="mt-1.5 flex items-end justify-between gap-2">
                        <div><h3 className="text-2xl font-black leading-none text-white">Zenith</h3><p className="mt-2 text-[11px] font-medium text-white/75">Stories from across campus</p></div>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/60 bg-white/15 text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-navy-900"><ArrowUpRight className="h-4 w-4" /></span>
                      </div>
                    </div>
                  </article>

                  {currentRole === 'student' ? (
                    <section className="relative flex min-h-[260px] flex-col overflow-hidden rounded-[14px] border border-[#dfe7f3] bg-gradient-to-br from-white via-white to-blue-50/70 p-5 shadow-[0_3px_12px_rgba(15,35,75,0.04)] lg:min-h-[280px]">
                      <div aria-hidden="true" className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[28px] border-blue-100/40" />
                      <div className="relative flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-800 text-white shadow-sm"><MessageSquare className="h-5 w-5" /></span>
                          <div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600">Student support</p><h3 className="mt-1 text-lg font-black text-navy-950">Grievance Cell</h3></div>
                        </div>
                        
                      </div>
                      <p className="relative mt-4 max-w-md text-[12px] leading-relaxed text-navy-600">Raise an academic, administrative, campus, or conduct-related concern through a safe and transparent process.</p>
                      <div className="relative mt-auto flex items-center gap-2 border-t border-navy-100 pt-4">
                        <button onClick={() => setCurrentNav('support')} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy-800 px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-navy-700">Report a concern <ArrowRight className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setCurrentNav('support')} className="rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-[12px] font-bold text-navy-700 transition hover:bg-navy-50">Track report</button>
                      </div>
                    </section>
                  ) : (
                    <section className="relative flex min-h-[260px] flex-col overflow-hidden rounded-[14px] border border-[#dfe7f3] bg-white p-5 shadow-[0_3px_12px_rgba(15,35,75,0.04)] lg:min-h-[280px]">
                      <div aria-hidden="true" className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-blue-50/80" />
                      <div className="relative border-b border-navy-100 pb-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600">University essentials</p>
                        <h3 className="mt-1 text-lg font-black text-navy-950">Campus Resources</h3>
                        <p className="mt-1 text-[11px] text-navy-500">Common services for faculty and staff</p>
                      </div>
                      <div className="relative grid flex-1 grid-cols-2 divide-x divide-y divide-navy-100">
                        {[
                          { label: 'Digital Library', sub: 'Books, journals & research', icon: BookOpen, nav: 'applications', color: 'bg-blue-50 text-blue-600' },
                          { label: 'Academic Calendar', sub: 'Important university dates', icon: CalendarDays, nav: 'events', color: 'bg-violet-50 text-violet-600' },
                          { label: 'Campus Directory', sub: 'Find people & departments', icon: Users, nav: 'support', color: 'bg-emerald-50 text-emerald-600' },
                          { label: 'Policies & Forms', sub: 'Official documents', icon: FileText, nav: 'documents', color: 'bg-amber-50 text-amber-600' },
                        ].map(({ label, sub, icon: Icon, nav, color }) => (
                          <button key={label} onClick={() => setCurrentNav(nav)} className="group flex min-w-0 items-center gap-2.5 px-3 py-3 text-left transition hover:bg-navy-50/70">
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></span>
                            <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-extrabold text-navy-950">{label}</span><span className="mt-0.5 block text-[7px] leading-snug text-navy-500">{sub}</span></span>
                            <ArrowUpRight className="h-3 w-3 shrink-0 text-navy-300 transition group-hover:text-blue-600" />
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>

              <aside className="space-y-3">
                <ActivityHub currentRole={currentRole} />
                <section className="relative overflow-hidden rounded-[14px] border border-[#e5ebf5] bg-white p-3 shadow-[0_3px_12px_rgba(15,35,75,0.03)]">
                  <CalendarDays aria-hidden="true" className="pointer-events-none absolute -bottom-5 -right-3 h-24 w-24 rotate-[8deg] text-blue-100/80" />
                  <div className="relative z-10 flex items-center justify-between border-b border-navy-100 pb-2.5">
                    <h3 className="flex items-center gap-1.5 text-[12px] font-extrabold text-navy-950"><CalendarDays className="h-4 w-4 text-navy-800" />Upcoming Events</h3>
                    <button onClick={() => setCurrentNav('events')} className="text-[11px] font-bold text-blue-600">View calendar →</button>
                  </div>
                  <div className="relative z-10">{mockEvents.slice(0, 2).map((event) => <EventCard key={event.id} event={event} />)}</div>
                </section>
              </aside>
            </div>

            <section className="overflow-hidden rounded-[14px] border border-[#e5ebf5] bg-white shadow-[0_3px_12px_rgba(15,35,75,0.03)]">
              <div className="grid grid-cols-2 divide-x divide-y divide-navy-100 sm:grid-cols-[150px_repeat(4,minmax(0,1fr))] sm:divide-y-0">
                <div className="col-span-2 flex items-center px-4 py-3 sm:col-span-1">
                  <div><p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600">Shortcuts</p><h3 className="mt-0.5 text-[12px] font-extrabold text-navy-950">Quick Access</h3></div>
                </div>
                {quickAccessItems.map(({ label, sub, icon: Icon, nav, color }) => (
                  <button key={label} onClick={() => setCurrentNav(nav)} className="group flex min-h-[68px] items-center gap-3 px-4 py-3 text-left transition hover:bg-navy-50">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[12px] font-extrabold text-navy-950">{label}</span><span className="mt-0.5 block text-[12px] text-navy-500">{sub}</span></span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentNav === 'applications' && <ApplicationsPage applications={applications} onOpenApp={openApplication} onToggleFavorite={() => {}} />}
        {currentNav === 'audit' && currentRole === 'admin' && <AuditPage />}
        {currentNav === 'profile' && <ProfilePage user={currentUser} currentRole={currentRole} />}
        {['academics', 'events', 'notifications', 'documents', 'settings', 'support'].includes(currentNav) && (
          <div className="rounded-[18px] border border-navy-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-black capitalize text-navy-950">{currentNav}</h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-navy-500">This area is ready to connect to its university service.</p>
            <button onClick={() => setCurrentNav('dashboard')} className="mt-5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-bold text-white">Return to dashboard</button>
          </div>
        )}
      </main>
    </div>
  );
};
