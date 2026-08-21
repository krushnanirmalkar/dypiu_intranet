import React, { useState } from 'react';
import type { ApplicationItem, UserRole, UserProfile } from '../types';
import { 
  mockUsers, mockApplications, mockEvents, 
  mockNotifications, mockStudentSchedule, mockFacultySchedule, 
  mockStudentStats, mockFacultyStats 
} from '../data/mockData';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavbar } from '../components/TopNavbar';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { AnnouncementSection } from '../components/AnnouncementSection';
import { ApplicationsGrid } from '../components/ApplicationsGrid';
import { StatCard } from '../components/StatCard';
import { ScheduleTimeline } from '../components/ScheduleTimeline';
import { EventCard } from '../components/EventCard';
import { NotificationPanel } from '../components/NotificationPanel';

import { ApplicationsPage } from '../pages/ApplicationsPage';
import { ProfilePage } from '../pages/ProfilePage';

import { ShieldCheck, ExternalLink, X, ArrowRight } from 'lucide-react';

export const MainApp: React.FC = () => {
  // Global Role & User State
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentNav, setCurrentNav] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data States
  const [applications, setApplications] = useState<ApplicationItem[]>(mockApplications);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Modal / SSO Launcher Simulator State
  const [simulatedApp, setSimulatedApp] = useState<ApplicationItem | null>(null);

  const currentUser: UserProfile = mockUsers[currentRole];

  // Role Switcher Handler
  const handleRoleSwitch = (newRole: UserRole) => {
    setCurrentRole(newRole);
    // Optionally reset nav back to dashboard if on role-specific pages
    if (currentNav === 'students' && newRole === 'student') {
      setCurrentNav('dashboard');
    }
  };

  // Toggle App Favorite
  const handleToggleFavorite = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, isFavorite: !app.isFavorite } : app
      )
    );
  };

  // Mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotifCount = notifications.filter(
    (n) => n.targetRoles.includes(currentRole) && !n.isRead
  ).length;

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900 flex flex-col font-sans">
      {/* Fixed Left Sidebar */}
      <AppSidebar
        currentRole={currentRole}
        currentNav={currentNav}
        onNavigate={setCurrentNav}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Layout */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Sticky Top Navbar */}
        <TopNavbar
          user={currentUser}
          currentNav={currentNav}
          onRoleSwitch={handleRoleSwitch}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          unreadNotifCount={unreadNotifCount}
          onNavigate={setCurrentNav}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Dashboard & Pages Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* NAV VIEW SWITCHER */}
          {currentNav === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 1. Hero / Welcome Banner */}
              <WelcomeBanner
                user={currentUser}
                onExploreApps={() => setCurrentNav('applications')}
              />

              {/* 2. My Applications (3 per row) + Vertical Campus Announcements Side-by-Side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left 2 Columns: Applications (3 cards per row) */}
                <div className="lg:col-span-2">
                  <ApplicationsGrid
                    applications={applications}
                    currentRole={currentRole}
                    onOpenApp={(app) => setSimulatedApp(app)}
                    onToggleFavorite={handleToggleFavorite}
                    onViewAllApps={() => setCurrentNav('applications')}
                  />
                </div>

                {/* Right Column: Campus Announcements Vertically */}
                <div className="lg:col-span-1">
                  <AnnouncementSection
                    currentRole={currentRole}
                  />
                </div>
              </div>

              {/* 3. Role-aware Statistics Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {(currentRole === 'student' ? mockStudentStats : mockFacultyStats).map((stat, idx) => (
                  <StatCard key={idx} stat={stat} />
                ))}
              </div>

              {/* 5. Two Column Dashboard Content: Timeline + Events + Notifications */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2-Columns: Today's Schedule */}
                <div className="lg:col-span-2 space-y-6">
                  <ScheduleTimeline
                    schedule={currentRole === 'student' ? mockStudentSchedule : mockFacultySchedule}
                    title={currentRole === 'student' ? "Today's Academic Timeline" : "Faculty Lectures & Meetings"}
                  />

                  {/* Academic Management Quick Actions for Faculty */}
                  {currentRole === 'faculty' && (
                    <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
                      <h3 className="text-base font-extrabold text-navy-900 mb-3">Academic Management Quick Actions</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {['Manage Courses', 'View Students', 'Upload Materials', 'Review Assignments', 'Enter Marks', 'Research Grants'].map((action, i) => (
                          <button
                            key={i}
                            onClick={() => alert(`Opening faculty action: ${action}`)}
                            className="p-3 rounded-xl bg-navy-50 hover:bg-navy-800 hover:text-white transition-all text-xs font-bold text-navy-800 border border-navy-200/80 text-left flex items-center justify-between group"
                          >
                            <span>{action}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upcoming Events Grid */}
                  <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-extrabold text-navy-900">Upcoming Campus & Academic Events</h3>
                      <button
                        onClick={() => setCurrentNav('events')}
                        className="text-xs font-bold text-navy-800 hover:underline"
                      >
                        View All Events →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mockEvents.slice(0, 2).map((evt) => (
                        <EventCard key={evt.id} event={evt} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Notifications & Announcements */}
                <div className="space-y-6">
                  <NotificationPanel
                    notifications={notifications}
                    currentRole={currentRole}
                    onMarkAllRead={handleMarkAllRead}
                  />

                  {/* SSO Portal Status Widget */}
                  <div className="bg-navy-800 text-white rounded-2xl p-6 shadow-sm border border-navy-700">
                    <div className="flex items-center space-x-2 text-xs font-bold text-navy-200 mb-2">
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>UNIVERSAL SSO ACTIVE</span>
                    </div>
                    <h4 className="text-sm font-extrabold mb-1">Seamless Digital Access</h4>
                    <p className="text-xs text-navy-200 leading-relaxed mb-4">
                      You are authenticated via Central Identity Provider. Clicking Juno, LMS, or UniSync launches directly into your account session.
                    </p>
                    <button
                      onClick={() => setCurrentNav('applications')}
                      className="w-full py-2 rounded-lg bg-white text-navy-900 font-bold text-xs hover:bg-navy-50 transition-colors shadow-sm"
                    >
                      Explore All SSO Applications
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE: APPLICATIONS */}
          {currentNav === 'applications' && (
            <ApplicationsPage
              applications={applications}
              currentRole={currentRole}
              onOpenApp={(app) => setSimulatedApp(app)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {/* PAGE: PROFILE */}
          {currentNav === 'profile' && (
            <ProfilePage
              user={currentUser}
              currentRole={currentRole}
              onRoleSwitch={handleRoleSwitch}
            />
          )}

          {/* FALLBACK / OTHER NAV PAGES */}
          {['academics', 'students', 'events', 'notifications', 'documents', 'settings', 'support'].includes(currentNav) && (
            <div className="bg-white rounded-2xl border border-navy-100 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-navy-800 text-white mx-auto flex items-center justify-center font-bold text-xl">
                U
              </div>
              <h2 className="text-2xl font-black text-navy-900 capitalize">{currentNav} Module</h2>
              <p className="text-xs text-navy-500 max-w-md mx-auto">
                This central intranet section is configured under your active SSO session ({currentUser.name} • {currentRole}).
              </p>
              <button
                onClick={() => setCurrentNav('dashboard')}
                className="px-4 py-2 rounded-lg bg-navy-800 text-white font-bold text-xs hover:bg-navy-900"
              >
                Return to Dashboard Overview
              </button>
            </div>
          )}

        </main>
      </div>

      {/* SSO APPLICATION LAUNCH SIMULATION MODAL */}
      {simulatedApp && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-navy-100 relative animate-in fade-in zoom-in-95 duration-150 text-center">
            <button
              onClick={() => setSimulatedApp(null)}
              className="absolute top-4 right-4 p-1 text-navy-400 hover:text-navy-900 rounded-lg hover:bg-navy-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Application Logo & SSO Badge */}
            <div className="w-14 h-14 rounded-2xl bg-navy-800 text-white mx-auto flex items-center justify-center shadow-lg mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-navy-50 text-navy-800 text-[11px] font-bold mb-3 border border-navy-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SSO Handshake Token Executed</span>
            </div>

            <h3 className="text-xl font-black text-navy-900 mb-1">
              Redirecting to {simulatedApp.name}...
            </h3>
            <p className="text-xs text-navy-500 mb-6 leading-relaxed">
              Authenticating <strong className="text-navy-900">{currentUser.email}</strong> via University Single Sign-On. Direct access granted without requiring password.
            </p>

            <div className="p-4 bg-navy-50 rounded-xl border border-navy-100 text-left text-xs space-y-2 mb-6 font-mono">
              <div className="flex justify-between">
                <span className="text-navy-400">Target App:</span>
                <span className="font-bold text-navy-900">{simulatedApp.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-400">User Identity:</span>
                <span className="font-bold text-navy-900">{currentUser.collegeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-400">Active Role:</span>
                <span className="font-bold text-navy-800 capitalize">{currentRole}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSimulatedApp(null)}
                className="flex-1 py-2.5 rounded-xl bg-navy-50 text-navy-700 font-bold text-xs hover:bg-navy-100"
              >
                Close Demo
              </button>
              <button
                onClick={() => {
                  alert(`In production, this opens ${simulatedApp.name} portal directly.`);
                  setSimulatedApp(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-navy-800 text-white font-bold text-xs hover:bg-navy-900 shadow-md flex items-center justify-center space-x-1.5"
              >
                <span>Proceed to {simulatedApp.name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
