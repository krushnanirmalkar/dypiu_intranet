import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Grid2X2,
  Key,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  User,
} from 'lucide-react';
import type { UserProfile } from '../types';
import { toTitleCase } from '../data/devPreviewData';
import { Header } from '../components/Header';

export type AdminTab = 'dashboard' | 'notices' | 'applications' | 'policies' | 'access' | 'audit' | 'notifications';

interface AdminLayoutProps {
  user: UserProfile;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onReturnToPortal: () => void;
  onNavigate?: (route: string) => void;
  notifications?: any[];
  unreadCount?: number;
  onMarkNotificationsRead?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  activeTab,
  onTabChange,
  onReturnToPortal,
  onNavigate,
  notifications,
  unreadCount,
  onMarkNotificationsRead,
  children,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const adminMainScrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (adminMainScrollRef.current) {
      adminMainScrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const formattedName = toTitleCase(user.name || 'Admin User');

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(user.isSuperAdmin || user.role === 'admin' || user.permissions?.canManageNotices ? [{ id: 'notices' as AdminTab, label: 'Notices', icon: Megaphone }] : []),
    ...(user.isSuperAdmin || user.role === 'admin' || user.permissions?.canManageNotifications ? [{ id: 'notifications' as AdminTab, label: 'Notifications', icon: Bell }] : []),
    ...(user.isSuperAdmin || user.role === 'admin' || user.permissions?.canManageApplications ? [{ id: 'applications' as AdminTab, label: 'Applications', icon: Grid2X2 }] : []),
    ...(user.isSuperAdmin || user.role === 'admin' || user.permissions?.canManagePolicies ? [{ id: 'policies' as AdminTab, label: 'University Policies', icon: BookOpen }] : []),
    ...(user.isSuperAdmin || user.role === 'admin' || user.permissions?.canManageAccess ? [{ id: 'access' as AdminTab, label: 'Access Control', icon: Key }] : []),
    ...(user.isSuperAdmin || user.role === 'admin' || user.permissions?.canManageAudit ? [{ id: 'audit' as AdminTab, label: 'Audit Log', icon: ShieldCheck }] : []),
  ];

  const handleNavClick = (tab: AdminTab) => {
    onTabChange(tab);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F3F3F8] font-sans text-slate-800 flex flex-col overflow-hidden">
      {/* Top Header - Unified Navbar matching normal dashboard */}
      <Header
        onToggleSidebar={() => setIsMobileDrawerOpen((prev) => !prev)}
        isSidebarOpen={isMobileDrawerOpen}
        user={user}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkNotificationsRead={onMarkNotificationsRead}
        onNavigate={onNavigate || ((route: string) => {
          if (route === 'dashboard') {
            onReturnToPortal();
          }
        })}
        isInAdminPortal={true}
      />

      {/* Main Container */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* Mobile Drawer Backdrop */}
        {isMobileDrawerOpen && (
          <div
            className="fixed inset-0 top-16 sm:top-20 z-30 bg-navy-950/60 backdrop-blur-xs lg:hidden"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
        )}

        {/* Mobile Slide-Over Sidebar (< lg) */}
        <aside
          className={`
            fixed top-16 sm:top-20 bottom-0 left-0 z-40 w-64 bg-white border-r border-navy-100 flex flex-col justify-between
            transition-transform duration-200 ease-in-out shadow-xl lg:hidden overflow-y-auto
            ${isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-4 space-y-6">
            <div>
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-navy-400">
                Administration
              </p>
              <nav className="mt-2 space-y-1">
                {navItems.map(({ id, label, icon: Icon }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleNavClick(id)}
                      className={`
                        w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left
                        ${isActive
                          ? 'bg-navy-900 text-white shadow-sm'
                          : 'text-navy-700 hover:bg-navy-50 hover:text-navy-950'
                        }
                      `}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-blue-300' : 'text-navy-500'}`} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-navy-100 bg-navy-50/50 space-y-2">
            <div className="flex items-center gap-2.5 px-2 py-1 text-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800 text-white shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-navy-950">{formattedName}</p>
                <p className="truncate text-[10px] text-navy-500">{user.email}</p>
              </div>
            </div>

            <button
              onClick={onReturnToPortal}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-navy-200 bg-white text-xs font-bold text-navy-800 hover:bg-navy-50 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </aside>

        {/* Desktop Permanent Sidebar (>= lg) */}
        <aside className="hidden lg:flex lg:w-64 lg:shrink-0 bg-white border-r border-navy-100 flex-col justify-between h-full overflow-y-auto">
          <div className="p-4 space-y-6">
            <div>
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-navy-400">
                Administration
              </p>
              <nav className="mt-2 space-y-1">
                {navItems.map(({ id, label, icon: Icon }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleNavClick(id)}
                      className={`
                        w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left
                        ${isActive
                          ? 'bg-navy-900 text-white shadow-sm'
                          : 'text-navy-700 hover:bg-navy-50 hover:text-navy-950'
                        }
                      `}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-blue-300' : 'text-navy-500'}`} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-navy-100 bg-navy-50/50 space-y-2">
            <div className="flex items-center gap-2.5 px-2 py-1 text-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800 text-white shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-navy-950">{formattedName}</p>
                <p className="truncate text-[10px] text-navy-500">{user.email}</p>
              </div>
            </div>

            <button
              onClick={onReturnToPortal}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-navy-200 bg-white text-xs font-bold text-navy-800 hover:bg-navy-50 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main ref={adminMainScrollRef} className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-16 sm:pb-20 overflow-y-auto h-full">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
