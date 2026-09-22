import React, { useEffect, useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ApplicationItem, NotificationItem, UserProfile, UserRole } from '../types';
import { mockNotifications } from '../data/mockData';
import { normalizeNotifications } from '../utils/notifications';
import { DEV_PREVIEW_APPLICATIONS, DEV_PREVIEW_USER, type AuthenticatedUser } from '../data/devPreviewData';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { AuditPage } from '../pages/AuditPage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NoticesPage } from '../pages/NoticesPage';
import { PoliciesPage } from '../pages/PoliciesPage';
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import ReferenceDashboard from './ReferenceDashboard';

// Super Admin Imports
import { AdminLayout, type AdminTab } from '../admin/AdminLayout';
import { AdminDashboard } from '../admin/pages/AdminDashboard';
import { NoticesAdminPage } from '../admin/pages/NoticesAdminPage';
import { ApplicationsAdminPage } from '../admin/pages/ApplicationsAdminPage';
import { PoliciesAdminPage } from '../admin/pages/PoliciesAdminPage';
import { AuditLogAdminPage } from '../admin/pages/AuditLogAdminPage';
import { AccessControlAdminPage } from '../admin/pages/AccessControlAdminPage';
import { NotificationsAdminPage } from '../admin/pages/NotificationsAdminPage';

const USE_DEV_PREVIEW = false;

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
    name: user.name,
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
    name: user.name,
    email: user.email,
    role,
    roleTitle: user.isSuperAdmin ? 'Super Administrator' : role === 'staff' ? 'Staff' : role === 'admin' ? 'Administrator' : 'Student',
    avatar: user.picture ?? '',
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

export const MainApp: React.FC = () => {
  const isSignedOutPage = window.location.pathname === '/signed-out';
  const isDirectAdminUrl = window.location.pathname === '/admin';

  const [authLoading, setAuthLoading] = useState(!USE_DEV_PREVIEW && !isSignedOutPage);
  const [authenticated, setAuthenticated] = useState(USE_DEV_PREVIEW);
  const [authenticatedUser, setAuthenticatedUser] = useState<SessionUser | null>(
    USE_DEV_PREVIEW ? createPreviewSessionUser(DEV_PREVIEW_USER) : null,
  );
  const [currentRole, setCurrentRole] = useState<UserRole | null>(
    USE_DEV_PREVIEW ? resolvePreviewRole(DEV_PREVIEW_USER) : null,
  );
  const [currentNav, setCurrentNav] = useState(isDirectAdminUrl ? 'admin' : 'dashboard');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [openNoticeCreateModal, setOpenNoticeCreateModal] = useState(false);
  const [openAppCreateModal, setOpenAppCreateModal] = useState(false);
  const [openPolicyCreateModal, setOpenPolicyCreateModal] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [applications, setApplications] = useState<ApplicationItem[]>(
    USE_DEV_PREVIEW ? DEV_PREVIEW_APPLICATIONS : [],
  );
  const [applicationsLoading, setApplicationsLoading] = useState(!USE_DEV_PREVIEW);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    USE_DEV_PREVIEW ? mockNotifications : [],
  );

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
              name: data.user.name,
              email: data.user.email,
              picture: typeof data.user.picture === 'string' ? data.user.picture : undefined,
              roles,
              isSuperAdmin,
              hasAdminPortalAccess,
              permissions: userPermissions,
            });
            setCurrentRole(resolvedRole);
            setAuthenticated(true);
            setAuthLoading(false);

            if (isDirectAdminUrl && !hasAdminPortalAccess) {
              window.history.replaceState({}, '', '/');
              setCurrentNav('dashboard');
            }
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
  }, [isSignedOutPage, isDirectAdminUrl]);

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

  useEffect(() => {
    if (isSignedOutPage) return;

    if (USE_DEV_PREVIEW) {
      setNotifications(mockNotifications);
      return;
    }

    if (!authenticated || !authenticatedUser || !currentRole) return;

    const loadNotifications = async () => {
      try {
        const response = await fetch('/api/notifications', { method: 'GET', credentials: 'include' });

        if (response.status === 401) {
          setAuthenticated(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Notification request failed with status ${response.status}`);
        }

        setNotifications(normalizeNotifications(await response.json()));
      } catch (error) {
        console.error('Failed to load notifications:', error);
        setNotifications([]);
      }
    };

    void loadNotifications();
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

  const handleNavigate = (page: string) => {
    if (page === 'admin') {
      const canAccessAdmin = Boolean(
        currentUser?.isSuperAdmin ||
        currentUser?.role === 'admin' ||
        currentUser?.hasAdminPortalAccess ||
        currentUser?.permissions?.allowedServices?.length
      );
      if (canAccessAdmin) {
        if (window.location.pathname !== '/admin') {
          window.history.pushState({}, '', '/admin');
        }
        setCurrentNav('admin');
      } else {
        if (window.location.pathname === '/admin') {
          window.history.replaceState({}, '', '/');
        }
        setCurrentNav('dashboard');
      }
    } else {
      if (window.location.pathname === '/admin') {
        window.history.pushState({}, '', '/');
      }
      setCurrentNav(page);
    }
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

  // Reference Dashboard
  if (currentNav === 'dashboard') {
    return (
      <ReferenceDashboard
        user={currentUser}
        applications={applications}
        loading={applicationsLoading}
        onNavigate={handleNavigate}
        onOpenApp={openApplication}
        notifications={notifications}
        onMarkAllNotificationsRead={() => setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fd] font-sans text-navy-900">
      <AppSidebar currentRole={currentRole} currentNav={currentNav} onNavigate={handleNavigate} isOpenMobile={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
      <TopNavbar
        user={currentUser}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        unreadNotifCount={unreadNotifCount}
        onNavigate={handleNavigate}
        notifications={notifications}
        onMarkAllRead={() => setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))}
      />

      <main className="mx-auto w-full max-w-[1500px] px-4 py-3 sm:px-5 lg:px-6 lg:py-4">
        {currentNav === 'applications' && <ApplicationsPage applications={applications} onOpenApp={openApplication} onToggleFavorite={() => {}} />}
        {currentNav === 'audit' && (currentUser.isSuperAdmin || currentUser.role === 'admin' || currentUser.permissions?.canManageAudit) && <AuditPage />}
        {currentNav === 'profile' && <ProfilePage user={currentUser} currentRole={currentRole} />}
        {currentNav === 'notifications' && (
          <NoticesPage
            user={currentUser}
            onOpenCreateNotice={() => {
              handleNavigate('admin');
              setAdminTab('notices');
              setOpenNoticeCreateModal(true);
            }}
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
          />
        )}
        {['academics', 'events', 'settings', 'support'].includes(currentNav) && (
          <div className="rounded-[18px] border border-navy-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-black capitalize text-navy-950">{currentNav}</h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-navy-500">This area is ready to connect to its university service.</p>
            <button onClick={() => handleNavigate('dashboard')} className="mt-5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-bold text-white">Return to dashboard</button>
          </div>
        )}
      </main>
    </div>
  );
};
