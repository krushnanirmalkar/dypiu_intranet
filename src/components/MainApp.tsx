import React, { useEffect, useState } from 'react';
import type { ApplicationItem, UserRole, UserProfile } from '../types';
import {
  mockEvents,
  mockNotifications,
} from '../data/mockData';

import { AppSidebar } from '../components/AppSidebar';
import { TopNavbar } from '../components/TopNavbar';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { ApplicationsGrid } from '../components/ApplicationsGrid';
import { EventCard } from '../components/EventCard';
import { ActivityHub } from '../components/ActivityHub';

import { ApplicationsPage } from '../pages/ApplicationsPage';
import { ProfilePage } from '../pages/ProfilePage';

import {
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const MainApp: React.FC = () => {
  // =========================================================
  // SIGNED-OUT PAGE
  // =========================================================

  const isSignedOutPage =
    window.location.pathname === '/signed-out';

  // =========================================================
  // PORTAL STATE
  // =========================================================

  const [currentRole, setCurrentRole] =
    useState<UserRole>('student');

  const [currentNav, setCurrentNav] =
    useState<string>('dashboard');

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState<boolean>(false);

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  // =========================================================
  // REAL SSO AUTHENTICATION STATE
  // =========================================================

  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [authenticatedUser, setAuthenticatedUser] = useState<{
    sub: string;
    name: string;
    email: string;
    roles: string[];
  } | null>(null);

  useEffect(() => {
    // The signed-out page must remain publicly accessible.
    // Do NOT automatically start SSO from this page.
    if (isSignedOutPage) {
      setAuthLoading(false);
      return;
    }

    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();

          if (data.authenticated && data.user) {
            const roles: string[] = Array.isArray(data.user.roles)
              ? data.user.roles
              : [];

            let resolvedRole: UserRole | null = null;

            // Role precedence:
            // admin > faculty > student
            if (roles.includes('admin')) {
              resolvedRole = 'admin';
            } else if (roles.includes('faculty')) {
              resolvedRole = 'faculty';
            } else if (roles.includes('student')) {
              resolvedRole = 'student';
            }

            if (!resolvedRole) {
              console.error(
                'Authenticated user has no supported DYPIU role:',
                roles
              );

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

        // No valid server-side session.
        // Start the normal DYPIU SSO login flow.
        window.location.href = '/login';
      } catch (error) {
        console.error('Authentication check failed:', error);

        // If authentication cannot be verified,
        // do not expose the dashboard.
        window.location.href = '/login';
      }
    };

    checkAuthentication();
  }, [isSignedOutPage]);

  // =========================================================
  // DATA STATE
  // =========================================================

  const [applications, setApplications] =
    useState<ApplicationItem[]>([]);

  const [notifications, setNotifications] =
    useState(mockNotifications);

  /*
   * Authentication, identity and base role come from the
   * authenticated server-side SSO session.
   *
   * Additional university profile attributes will be populated
   * when a trusted university profile source is connected.
   */
  const currentUser: UserProfile = {
    id: authenticatedUser?.sub ?? '',
    name: authenticatedUser?.name ?? '',
    email: authenticatedUser?.email ?? '',
    role: currentRole,
    roleTitle:
      currentRole === 'student'
        ? 'Student'
        : currentRole === 'faculty'
          ? 'Faculty'
          : 'Administrator',
    avatar: '',
    collegeId:
      authenticatedUser?.email?.split('@')[0] ?? '',
    department: '',
    program: undefined,
    yearOrDesignation: '',
    bio: '',
    joinedYear: '',
    phone: '',
  };


  // =========================================================
  // AUTHORIZED APPLICATIONS
  // =========================================================

  useEffect(() => {
    if (!authenticated || isSignedOutPage) {
      return;
    }

    const loadApplications = async () => {
      try {
        const response = await fetch('/api/applications', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Application request failed with status ${response.status}`
          );
        }

        const data = await response.json();

        const backendApplications: Array<{
          id: string;
          name: string;
          description: string;
          category: ApplicationItem['category'];
          icon?: string;
          url: string;
        }> = Array.isArray(data.applications)
          ? data.applications
          : [];

        const mappedApplications: ApplicationItem[] =
          backendApplications.map((app) => ({
            id: app.id,
            name: app.name,
            description: app.description,
            category: app.category,
            iconName: app.icon || 'LayoutDashboard',
            ssoEnabled: true,
            isFavorite: false,
            url: app.url,
          }));

        setApplications(mappedApplications);
      } catch (error) {
        console.error(
          'Failed to load authorized applications:',
          error
        );

        setApplications([]);
      }
    };

    loadApplications();
  }, [authenticated, isSignedOutPage]);

  // =========================================================
  // APPLICATION FAVORITES
  // =========================================================

  const handleToggleFavorite = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, isFavorite: !app.isFavorite }
          : app
      )
    );
  };

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        isRead: true,
      }))
    );
  };

  const unreadNotifCount = notifications.filter(
    (n) =>
      n.targetRoles.includes(currentRole) &&
      !n.isRead
  ).length;

  // =========================================================
  // SIGNED-OUT LANDING PAGE
  // =========================================================

  if (isSignedOutPage) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-navy-100 shadow-lg p-8 text-center">

          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-navy-800 text-white flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-black text-navy-900">
            You have been signed out
          </h1>

          <p className="mt-3 text-sm text-navy-500 leading-relaxed">
            Your DYPIU Intranet session has been securely ended.
          </p>

          <button
            onClick={() => {
              window.location.href = '/login?reauth=1';
            }}
            className="mt-6 w-full py-3 rounded-xl bg-navy-800 text-white text-sm font-bold hover:bg-navy-900 transition-colors"
          >
            Sign in again
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // AUTHENTICATION GATE
  // =========================================================

  /*
   * Do NOT render any portal content until the backend
   * confirms that a valid server-side session exists.
   */

  if (authLoading || !authenticated || !authenticatedUser) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="text-center space-y-3">

          <div className="w-10 h-10 border-4 border-navy-200 border-t-navy-800 rounded-full animate-spin mx-auto" />

          <p className="text-sm font-semibold text-navy-700">
            Verifying university session...
          </p>

        </div>
      </div>
    );
  }

  // =========================================================
  // AUTHENTICATED PORTAL
  // =========================================================

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900 flex flex-col font-sans">

      {/* =====================================================
          FIXED LEFT SIDEBAR
      ====================================================== */}

      <AppSidebar
        currentRole={currentRole}
        currentNav={currentNav}
        onNavigate={setCurrentNav}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() =>
          setIsMobileSidebarOpen(false)
        }
      />

      {/* =====================================================
          MAIN WORKSPACE
      ====================================================== */}

      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">

        {/* Top Navbar */}

        <TopNavbar
          user={currentUser}
          currentNav={currentNav}
          onToggleMobileSidebar={() =>
            setIsMobileSidebarOpen(true)
          }
          unreadNotifCount={unreadNotifCount}
          onNavigate={setCurrentNav}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
        />

        {/* =================================================
            DASHBOARD / PAGE CONTENT
        ================================================== */}

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* =================================================
              DASHBOARD
          ================================================== */}

          {currentNav === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">

              {/* Welcome Banner */}

              <div>
                <WelcomeBanner user={currentUser} />
              </div>

              {/* Main Dashboard Grid */}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* LEFT CONTENT */}

                <div className="lg:col-span-2 space-y-6">

                  {/* Applications */}

                  <ApplicationsGrid
                    applications={applications}
                    onOpenApp={(app) => {
                      window.open(
                        app.url,
                        '_blank',
                        'noopener,noreferrer'
                      );
                    }}
                    onToggleFavorite={
                      handleToggleFavorite
                    }
                    onViewAllApps={() =>
                      setCurrentNav('applications')
                    }
                  />

                  {/* Faculty Quick Actions */}

                  {currentRole === 'faculty' && (
                    <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">

                      <h3 className="text-base font-extrabold text-navy-900 mb-3">
                        Academic Management Quick Actions
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                        {[
                          'Manage Courses',
                          'View Students',
                          'Upload Materials',
                          'Review Assignments',
                          'Enter Marks',
                          'Research Grants',
                        ].map((action, i) => (

                          <button
                            key={i}
                            onClick={() =>
                              alert(
                                `Opening faculty action: ${action}`
                              )
                            }
                            className="p-3 rounded-xl bg-navy-50 hover:bg-navy-800 hover:text-white transition-all text-xs font-bold text-navy-800 border border-navy-200/80 text-left flex items-center justify-between group"
                          >
                            <span>{action}</span>

                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>

                        ))}

                      </div>
                    </div>
                  )}

                  {/* Events */}

                  <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">

                    <div className="flex items-center justify-between mb-4">

                      <h3 className="text-base font-extrabold text-navy-900">
                        Upcoming Campus & Academic Events
                      </h3>

                      <button
                        onClick={() =>
                          setCurrentNav('events')
                        }
                        className="text-xs font-bold text-navy-800 hover:underline"
                      >
                        View All Events →
                      </button>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {mockEvents
                        .slice(0, 2)
                        .map((evt) => (
                          <EventCard
                            key={evt.id}
                            event={evt}
                          />
                        ))}

                    </div>

                  </div>

                </div>

                {/* RIGHT CONTENT */}

                <div className="lg:col-span-1 space-y-6">

                  <ActivityHub
                    currentRole={currentRole}
                  />

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              APPLICATIONS PAGE
          ================================================== */}

          {currentNav === 'applications' && (

            <ApplicationsPage
              applications={applications}
              onOpenApp={(app) => {
                window.open(
                  app.url,
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
              onToggleFavorite={
                handleToggleFavorite
              }
            />

          )}

          {/* =================================================
              PROFILE PAGE
          ================================================== */}

          {currentNav === 'profile' && (

            <ProfilePage
              user={currentUser}
              currentRole={currentRole}
            />

          )}

          {/* =================================================
              OTHER MODULE PLACEHOLDERS
          ================================================== */}

          {[
            'academics',
            'students',
            'events',
            'notifications',
            'documents',
            'settings',
            'support',
          ].includes(currentNav) && (

            <div className="bg-white rounded-2xl border border-navy-100 p-8 text-center space-y-4">

              <div className="w-12 h-12 rounded-2xl bg-navy-800 text-white mx-auto flex items-center justify-center font-bold text-xl">
                U
              </div>

              <h2 className="text-2xl font-black text-navy-900 capitalize">
                {currentNav} Module
              </h2>

              <p className="text-xs text-navy-500 max-w-md mx-auto">
                This central intranet section is configured
                under your active SSO session (
                {currentUser.name} • {currentRole}).
              </p>

              <button
                onClick={() =>
                  setCurrentNav('dashboard')
                }
                className="px-4 py-2 rounded-lg bg-navy-800 text-white font-bold text-xs hover:bg-navy-900"
              >
                Return to Dashboard Overview
              </button>

            </div>

          )}

        </main>

      </div>



    </div>
  );
};
