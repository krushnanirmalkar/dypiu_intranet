import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ApplicationItem, NotificationItem, UserProfile, UserRole } from '../types';
import { mockNotifications } from '../data/mockData';
import { normalizeNotifications } from '../utils/notifications';
import { DEV_PREVIEW_APPLICATIONS, DEV_PREVIEW_USER, toTitleCase, type AuthenticatedUser } from '../data/devPreviewData';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { AuditPage } from '../pages/AuditPage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NoticesPage } from '../pages/NoticesPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { PoliciesPage } from '../pages/PoliciesPage';
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage';
import { TermsConditionsPage } from '../pages/TermsConditionsPage';
import { HelpContactPage } from '../pages/HelpContactPage';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { WelcomeHero } from './WelcomeHero';
import { DateBirthdayCard } from './DateBirthdayCard';
import { MainSection } from './MainSection';
import { IntranetFooter } from './IntranetFooter';

// Super Admin Imports
import { AdminLayout, type AdminTab } from '../admin/AdminLayout';
import { AdminDashboard } from '../admin/pages/AdminDashboard';
import { NoticesAdminPage } from '../admin/pages/NoticesAdminPage';
import { ApplicationsAdminPage } from '../admin/pages/ApplicationsAdminPage';
import { PoliciesAdminPage } from '../admin/pages/PoliciesAdminPage';
import { AuditLogAdminPage } from '../admin/pages/AuditLogAdminPage';
import { AccessControlAdminPage } from '../admin/pages/AccessControlAdminPage';
import { NotificationsAdminPage } from '../admin/pages/NotificationsAdminPage';
interface SessionUser {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  roles: string[];
  isSuperAdmin?: boolean;
  hasAdminPortalAccess?: boolean;
  permissions?: {
    allowedServices: string[];
    accessLevel: 'read' | 'write' | 'full';
  };
}

const resolveRoleByPrecedence = (roles: readonly string[]): UserRole | null => {
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('staff')) return 'staff';
  if (roles.includes('student')) return 'student';
  return null;
};

const resolvePreviewRole = (user: AuthenticatedUser): UserRole => {
  const previewRoles = Array.isArray(user.roles) ? user.roles : [];
  return resolveRoleByPrecedence(previewRoles) ?? user.role ?? 'staff';
};

const createPreviewSessionUser = (user: AuthenticatedUser): SessionUser => {
  const previewRole = resolvePreviewRole(user);
  return {
    sub: user.sub ?? user.email,
    name: toTitleCase(user.name),
    email: user.email,
    roles: Array.isArray(user.roles) && user.roles.length > 0 ? [...user.roles] : [previewRole],
    isSuperAdmin: user.isSuperAdmin ?? user.roles?.includes('super_admin') ?? false,
    hasAdminPortalAccess: true,
    permissions: {
      allowedServices: ['notices', 'policies', 'applications', 'access', 'audit', 'notifications'],
      accessLevel: 'full',
    },
  };
};

const hasValidIdentity = (user: unknown): user is { sub: string; name: string; email: string; picture?: unknown; roles?: unknown; isSuperAdmin?: unknown; hasAdminPortalAccess?: unknown; permissions?: unknown } => {
  if (typeof user !== 'object' || user === null) return false;
  const candidate = user as Record<string, unknown>;
  return typeof candidate.sub === 'string' && candidate.sub.length > 0
    && typeof candidate.name === 'string' && candidate.name.length > 0
    && typeof candidate.email === 'string' && candidate.email.length > 0;
};

const buildProfile = (user: SessionUser, role: UserRole): UserProfile => {
  const allowedServices = user.permissions?.allowedServices || [];
  const isSuperOrAdmin = Boolean(user.isSuperAdmin || role === 'admin');
  const canManageNotices = isSuperOrAdmin || allowedServices.includes('notices');
  const canManagePolicies = isSuperOrAdmin || allowedServices.includes('policies');
  const canManageApplications = isSuperOrAdmin || allowedServices.includes('applications');
  const canManageAccess = isSuperOrAdmin || allowedServices.includes('access');
  const canManageAudit = isSuperOrAdmin || allowedServices.includes('audit');
  const canManageNotifications = isSuperOrAdmin || allowedServices.includes('notifications');
  const hasAdminPortalAccess = Boolean(user.hasAdminPortalAccess || isSuperOrAdmin || allowedServices.length > 0);

  return {
    id: user.sub,
    name: toTitleCase(user.name),
    email: user.email,
    role,
    roleTitle: user.isSuperAdmin ? 'Super Administrator' : role === 'staff' ? 'Staff' : role === 'admin' ? 'Administrator' : 'Student',
    avatar: '/api/me/photo',
    collegeId: user.email.split('@')[0],
    department: 'D Y Patil International University',
    yearOrDesignation: user.isSuperAdmin ? 'Super Administrator' : role === 'student' ? 'Student' : role === 'staff' ? 'Staff' : 'Administration',
    bio: 'Member of the DYPIU campus community.',
    joinedYear: '',
    phone: '',
    isSuperAdmin: user.isSuperAdmin,
    hasAdminPortalAccess,
    permissions: {
      allowedServices,
      accessLevel: user.permissions?.accessLevel || 'read',
      canManageNotices,
      canManagePolicies,
      canManageApplications,
      canManageAccess,
      canManageAudit,
      canManageNotifications,
    },
  };
};

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

const getInitialNavFromPath = (path: string): string => {
  if (path === '/admin') return 'admin';
  if (path === '/privacy-policy' || path === '/privacy') return 'privacy';
  if (path === '/terms-and-conditions' || path === '/terms' || path === '/terms-of-service') return 'terms';
  if (path === '/contact' || path === '/help' || path === '/support') return 'support';
  if (path === '/profile') return 'profile';
  if (path === '/notices') return 'notices';
  if (path === '/applications') return 'applications';
  if (path === '/notifications') return 'notifications';
  if (path === '/documents' || path === '/policies') return 'documents';
  return 'dashboard';
};

export const MainApp: React.FC = () => {
  const isSignedOutPage = window.location.pathname === '/signed-out';
  const isLoginPage = window.location.pathname === '/login';
  const isDirectAdminUrl = window.location.pathname === '/admin';
  const isPreviewMode = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('preview') === '1' ||
    new URLSearchParams(window.location.search).get('preview') === 'true'
  );

  const [authLoading, setAuthLoading] = useState(!isSignedOutPage && !isLoginPage && !isPreviewMode);
  const [authenticated, setAuthenticated] = useState(isPreviewMode);
  const [authenticatedUser, setAuthenticatedUser] = useState<SessionUser | null>(
    isPreviewMode ? createPreviewSessionUser(DEV_PREVIEW_USER) : null,
  );
  const [currentRole, setCurrentRole] = useState<UserRole | null>(
    isPreviewMode ? resolvePreviewRole(DEV_PREVIEW_USER) : null,
  );
  const [currentNav, setCurrentNav] = useState(() => getInitialNavFromPath(window.location.pathname));
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [openNoticeCreateModal, setOpenNoticeCreateModal] = useState(false);
  const [openAppCreateModal, setOpenAppCreateModal] = useState(false);
  const [openPolicyCreateModal, setOpenPolicyCreateModal] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentNav(getInitialNavFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to top whenever navigation changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentNav]);

  const [isReferenceSidebarOpen, setIsReferenceSidebarOpen] = useState(false);
  const [applications, setApplications] = useState<ApplicationItem[]>(DEV_PREVIEW_APPLICATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [notices, setNotices] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);

  useEffect(() => {
    if (isSignedOutPage || isLoginPage || isPreviewMode) {
      setAuthLoading(false);
      return;
    }

    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/me', { method: 'GET', credentials: 'include' });

        if (response.ok) {
          const data = await response.json() as { authenticated?: unknown; user?: { sub?: unknown; name?: unknown; email?: unknown; picture?: unknown; roles?: unknown; isSuperAdmin?: unknown } };

          if (data.authenticated === true && hasValidIdentity(data.user)) {
            const roles = Array.isArray(data.user.roles)
              ? data.user.roles.filter((role): role is string => typeof role === 'string')
              : [];
            const isSuperAdmin = data.user.isSuperAdmin === true || roles.includes('super_admin') || roles.includes('admin');
            const resolvedRole = resolveRoleByPrecedence(roles) || 'staff';
            const userPermissions = typeof data.user.permissions === 'object' && data.user.permissions !== null
              ? (data.user.permissions as { allowedServices: string[]; accessLevel: 'read' | 'write' | 'full' })
              : undefined;
            const hasAdminPortalAccess = Boolean(
              data.user.hasAdminPortalAccess === true ||
              isSuperAdmin ||
              (userPermissions?.allowedServices && userPermissions.allowedServices.length > 0)
            );

            setAuthenticatedUser({
              sub: data.user.sub,
              name: toTitleCase(data.user.name),
              email: data.user.email,
              picture: typeof data.user.picture === 'string' ? data.user.picture : undefined,
              roles,
              isSuperAdmin,
              hasAdminPortalAccess,
              permissions: userPermissions,
            });
            setCurrentRole(resolvedRole);
            setAuthenticated(true);

            if (isDirectAdminUrl && !hasAdminPortalAccess) {
              window.history.replaceState({}, '', '/');
              setCurrentNav('dashboard');
            }
            return;
          }
        }
        setAuthenticated(false);
        setAuthenticatedUser(null);
        setCurrentRole(null);
      } catch {
        setAuthenticated(false);
        setAuthenticatedUser(null);
        setCurrentRole(null);
      } finally {
        setAuthLoading(false);
      }
    };

    void checkAuthentication();
  }, [isSignedOutPage, isLoginPage, isDirectAdminUrl, isPreviewMode]);

  useEffect(() => {
    if (isSignedOutPage || isLoginPage) return;

    const loadApplications = async () => {
      try {
        const response = await fetch('/api/applications', { method: 'GET', credentials: 'include' });
        if (response.ok) {
          const loaded = normalizeApplications(await response.json());
          if (loaded.length > 0) {
            setApplications(loaded);
          }
        }
      } catch {
        // keep fallback preview applications
      }
    };

    void loadApplications();
  }, [authenticated, isSignedOutPage, isLoginPage]);

  useEffect(() => {
    if (isSignedOutPage || isLoginPage) return;

    const loadNotifications = async () => {
      try {
        const response = await fetch('/api/notifications', { method: 'GET', credentials: 'include' });
        if (response.ok) {
          const loaded = normalizeNotifications(await response.json());
          if (loaded.length > 0) {
            setNotifications(loaded);
          }
        }
      } catch {
        // keep fallback notifications
      }
    };

    void loadNotifications();
  }, [authenticated, isSignedOutPage, isLoginPage]);

  useEffect(() => {
    if (isSignedOutPage || !authenticated) return;

    const loadData = async () => {
      try {
        const [noticesRes, policiesRes] = await Promise.all([
          fetch('/api/notices', { method: 'GET', credentials: 'include' }).catch(() => null),
          fetch('/api/policies', { method: 'GET', credentials: 'include' }).catch(() => null),
        ]);

        if (noticesRes && noticesRes.ok) {
          const data = await noticesRes.json() as { notices?: any[] };
          if (data && Array.isArray(data.notices)) {
            setNotices(data.notices);
          }
        }
        if (policiesRes && policiesRes.ok) {
          const data = await policiesRes.json() as { policies?: any[] };
          if (data && Array.isArray(data.policies)) {
            setPolicies(data.policies);
          }
        }
      } catch (err) {
        console.error('Failed to load notices or policies:', err);
      }
    };

    void loadData();
  }, [authenticated, isSignedOutPage]);

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

  const handleNavigate = (page: string) => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const currentSearch = window.location.search;
    if (page === 'admin') {
      const canAccessAdmin = Boolean(
        currentUser?.isSuperAdmin ||
        currentUser?.role === 'admin' ||
        currentUser?.hasAdminPortalAccess ||
        currentUser?.permissions?.allowedServices?.length
      );
      if (canAccessAdmin) {
        if (window.location.pathname !== '/admin') {
          window.history.pushState({}, '', '/admin' + currentSearch);
        }
        setCurrentNav('admin');
      } else {
        if (window.location.pathname === '/admin') {
          window.history.replaceState({}, '', '/' + currentSearch);
        }
        setCurrentNav('dashboard');
      }
    } else if (page === 'privacy') {
      if (window.location.pathname !== '/privacy-policy') {
        window.history.pushState({}, '', '/privacy-policy' + currentSearch);
      }
      setCurrentNav('privacy');
    } else if (page === 'terms') {
      if (window.location.pathname !== '/terms-and-conditions') {
        window.history.pushState({}, '', '/terms-and-conditions' + currentSearch);
      }
      setCurrentNav('terms');
    } else if (page === 'support') {
      if (window.location.pathname !== '/contact' && window.location.pathname !== '/help') {
        window.history.pushState({}, '', '/contact' + currentSearch);
      }
      setCurrentNav('support');
    } else if (page === 'profile') {
      if (window.location.pathname !== '/profile') {
        window.history.pushState({}, '', '/profile' + currentSearch);
      }
      setCurrentNav('profile');
    } else if (page === 'dashboard') {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/' + currentSearch);
      }
      setCurrentNav('dashboard');
    } else {
      if (
        window.location.pathname === '/admin' ||
        window.location.pathname === '/privacy-policy' ||
        window.location.pathname === '/terms-and-conditions' ||
        window.location.pathname === '/profile' ||
        window.location.pathname === '/contact' ||
        window.location.pathname === '/help'
      ) {
        window.history.pushState({}, '', '/' + currentSearch);
      }
      setCurrentNav(page);
    }
  };

  if (isSignedOutPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F3F8] px-4 font-sans antialiased text-slate-800">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A1328] text-[#00afef] shadow-md">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#393678] font-serif-custom tracking-tight">
            You have been signed out
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Your DYPIU Intranet session has been securely ended.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                window.location.href = '/login?reauth=1';
              }}
              className="w-full rounded-xl bg-[#0A1328] hover:bg-[#152347] py-3 text-xs sm:text-sm font-bold text-white transition-all shadow-md cursor-pointer"
            >
              Sign in again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F3F8]">
        <div className="text-center space-y-3">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#00afef]" />
          <p className="text-xs font-bold text-[#393678] tracking-wide">Verifying university session...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !authenticatedUser || !currentRole || !currentUser) {
    if (currentNav === 'privacy' || window.location.pathname === '/privacy-policy' || window.location.pathname === '/privacy') {
      return (
        <div className="min-h-screen bg-[#F3F3F8] p-4 sm:p-6 overflow-y-auto">
          <PrivacyPolicyPage onBack={() => { window.location.href = '/login'; }} />
        </div>
      );
    }
    if (currentNav === 'terms' || window.location.pathname === '/terms-and-conditions' || window.location.pathname === '/terms' || window.location.pathname === '/terms-of-service') {
      return (
        <div className="min-h-screen bg-[#F3F3F8] p-4 sm:p-6 overflow-y-auto">
          <TermsConditionsPage onBack={() => { window.location.href = '/login'; }} />
        </div>
      );
    }
    if (currentNav === 'support' || window.location.pathname === '/contact' || window.location.pathname === '/help' || window.location.pathname === '/support') {
      return (
        <div className="min-h-screen bg-[#F3F3F8] p-4 sm:p-6 overflow-y-auto">
          <HelpContactPage onBack={() => { window.location.href = '/login'; }} />
        </div>
      );
    }
    return <LoginPage />;
  }

  // -------------------------
  // Render Admin / Management Portal
  // -------------------------
  if (currentNav === 'admin') {
    const canAccessAdmin = Boolean(
      currentUser.isSuperAdmin ||
      currentUser.role === 'admin' ||
      currentUser.hasAdminPortalAccess ||
      currentUser.permissions?.allowedServices?.length
    );

    if (!canAccessAdmin) {
      if (window.location.pathname === '/admin') {
        window.history.replaceState({}, '', '/');
      }
      setCurrentNav('dashboard');
      return null;
    }

    return (
      <AdminLayout
        user={currentUser}
        activeTab={adminTab}
        onTabChange={(tab) => {
          setAdminTab(tab);
          setOpenNoticeCreateModal(false);
          setOpenAppCreateModal(false);
          setOpenPolicyCreateModal(false);
        }}
        onReturnToPortal={() => handleNavigate('dashboard')}
        onNavigate={handleNavigate}
        notifications={notifications}
        unreadCount={unreadNotifCount}
        onMarkNotificationsRead={() => setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            user={currentUser}
            onNavigateTab={(tab) => {
              setAdminTab(tab);
              setOpenNoticeCreateModal(false);
              setOpenAppCreateModal(false);
              setOpenPolicyCreateModal(false);
            }}
            onOpenCreateNotice={() => {
              setAdminTab('notices');
              setOpenNoticeCreateModal(true);
            }}
            onOpenCreateApplication={() => {
              setAdminTab('applications');
              setOpenAppCreateModal(true);
            }}
            onOpenCreatePolicy={() => {
              setAdminTab('policies');
              setOpenPolicyCreateModal(true);
            }}
          />
        )}

        {adminTab === 'notices' && (currentUser.isSuperAdmin || currentUser.role === 'admin' || currentUser.permissions?.canManageNotices) && (
          <NoticesAdminPage initialOpenCreate={openNoticeCreateModal} />
        )}
        {adminTab === 'notifications' && (currentUser.isSuperAdmin || currentUser.role === 'admin' || currentUser.permissions?.canManageNotifications) && (
          <NotificationsAdminPage />
        )}
        {adminTab === 'applications' && (currentUser.isSuperAdmin || currentUser.role === 'admin' || currentUser.permissions?.canManageApplications) && (
          <ApplicationsAdminPage initialOpenCreate={openAppCreateModal} />
        )}
        {adminTab === 'policies' && (currentUser.isSuperAdmin || currentUser.role === 'admin' || currentUser.permissions?.canManagePolicies) && (
          <PoliciesAdminPage initialOpenCreate={openPolicyCreateModal} />
        )}
        {adminTab === 'access' && (currentUser.isSuperAdmin || currentUser.role === 'admin' || currentUser.permissions?.canManageAccess) && (
          <AccessControlAdminPage />
        )}
        {adminTab === 'audit' && (currentUser.isSuperAdmin || currentUser.role === 'admin' || currentUser.permissions?.canManageAudit) && (
          <AuditLogAdminPage />
        )}
      </AdminLayout>
    );
  }

  // Unified Reference Layout for Portal
  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F3F3F8] flex flex-col font-sans text-slate-800 antialiased selection:bg-[#00afef]/20 selection:text-[#393678] overflow-hidden">
      {/* Top Navigation Header - Permanently pinned at the top, never scrolls away */}
      <Header
        onToggleSidebar={() => setIsReferenceSidebarOpen((prev) => !prev)}
        isSidebarOpen={isReferenceSidebarOpen}
        user={currentUser}
        notifications={notifications}
        unreadCount={unreadNotifCount}
        onMarkNotificationsRead={() => setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))}
        onNavigate={handleNavigate}
      />

      {/* Main Body Area: Responsive Sidebar + Scrollable Dashboard Content */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Left Dark Navy Sidebar (Static on lg+, Slide-over Drawer on mobile) */}
        <Sidebar
          isOpen={isReferenceSidebarOpen}
          onClose={() => setIsReferenceSidebarOpen(false)}
          applications={applications}
          policies={policies}
          onOpenApp={openApplication}
          onNavigate={handleNavigate}
          user={currentUser}
          currentNav={currentNav}
        />

        {/* Main Column: Scrollable Dashboard Content + Full-width Intranet Footer at the end */}
        <div
          ref={mainScrollRef}
          className="flex-1 min-h-0 overflow-y-auto scroll-smooth overflow-x-hidden flex flex-col justify-between bg-[#F3F3F8]"
        >
          <main className="flex-1 p-3 sm:p-4 lg:p-4 space-y-4 max-w-[1600px] mx-auto w-full overscroll-contain">
          {currentNav === 'dashboard' && (
            <>
              {/* TOP HERO ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
                <div className="lg:col-span-8">
                  <WelcomeHero user={currentUser} />
                </div>
                <div className="lg:col-span-4">
                  <DateBirthdayCard />
                </div>
              </div>

              <MainSection
                notices={notices}
                onViewAllNotices={() => handleNavigate('notices')}
              />
            </>
          )}

          {currentNav === 'notices' && (
            <NoticesPage
              user={currentUser}
              onOpenCreateNotice={() => {
                handleNavigate('admin');
                setAdminTab('notices');
                setOpenNoticeCreateModal(true);
              }}
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {currentNav === 'notifications' && (
            <NotificationsPage
              notifications={notifications}
              onMarkAllRead={() => setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))}
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {currentNav === 'profile' && (
            <ProfilePage
              user={currentUser}
              currentRole={currentRole}
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {currentNav === 'privacy' && (
            <PrivacyPolicyPage
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {currentNav === 'terms' && (
            <TermsConditionsPage
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {currentNav === 'applications' && (
            <ApplicationsPage
              applications={applications}
              onOpenApp={openApplication}
              onToggleFavorite={() => {}}
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {currentNav === 'documents' && (
            <PoliciesPage
              user={currentUser}
              onOpenCreatePolicy={() => {
                handleNavigate('admin');
                setAdminTab('policies');
                setOpenPolicyCreateModal(true);
              }}
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {currentNav === 'audit' && (currentUser.isSuperAdmin || currentUser.role === 'admin' || currentUser.permissions?.canManageAudit) && (
            <AuditPage />
          )}

          {currentNav === 'support' && (
            <HelpContactPage
              user={currentUser}
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {['academics', 'events', 'settings'].includes(currentNav) && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs max-w-xl mx-auto my-12">
              <h2 className="text-xl font-bold capitalize text-[#393678] font-serif-custom">{currentNav}</h2>
              <p className="mx-auto mt-2 max-w-md text-xs text-slate-500">This area is ready to connect to its university service.</p>
              <button
                onClick={() => handleNavigate('dashboard')}
                className="mt-5 rounded-xl bg-[#0A1328] hover:bg-[#152347] px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Return to dashboard
              </button>
            </div>
          )}
        </main>

        {/* Full-width Intranet Footer seamlessly joined to the sidebar */}
        <IntranetFooter onNavigate={handleNavigate} />
      </div>
      </div>
    </div>
  );
};
