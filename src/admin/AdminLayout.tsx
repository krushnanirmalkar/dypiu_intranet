import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Grid2X2,
  Key,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import type { UserProfile } from '../types';
import dypiuLogo from '../assets/dypiu-logo.png';
import { toTitleCase } from '../data/devPreviewData';
import { TopRightHeaderShape } from '../components/DecorativeShapes';

export type AdminTab = 'dashboard' | 'notices' | 'applications' | 'policies' | 'access' | 'audit' | 'notifications';

interface AdminLayoutProps {
  user: UserProfile;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onReturnToPortal: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  activeTab,
  onTabChange,
  onReturnToPortal,
  children,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const formattedName = toTitleCase(user.name || 'Admin User');
  const initials = formattedName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

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
      {/* Top Header - Reference Design Style */}
      <div className="bg-[#0A1328] sticky top-0 z-50 select-none shrink-0 w-full">
        <header className="bg-white rounded-bl-[24px] sm:rounded-bl-[32px] border-b border-slate-200/80 shadow-xs h-16 sm:h-20 px-3 sm:px-6 md:px-7 flex items-center justify-between relative overflow-visible">
          {/* Top right decorative shape extending full height */}
          <TopRightHeaderShape className="h-full w-28 sm:w-36 md:w-44" />

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
              className="p-1.5 sm:p-2 rounded-xl text-[#393678] hover:bg-slate-100 lg:hidden focus:outline-none cursor-pointer"
              aria-label="Toggle admin menu"
            >
              {isMobileDrawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={dypiuLogo}
                alt="DYPIU Logo"
                className="h-10 sm:h-14 max-h-[44px] sm:max-h-[58px] w-auto object-contain cursor-pointer transition-transform hover:scale-102"
                onClick={onReturnToPortal}
              />
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-sm font-bold text-[#393678]">UniOne</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0A1328] px-2.5 py-0.5 text-[10.5px] font-bold text-white shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-[#00afef]" />
                  <span>{user.isSuperAdmin || user.role === 'admin' ? 'Admin Portal' : 'Service Portal'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Return to UniOne Intranet */}
            <button
              onClick={onReturnToPortal}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[#F1F1F7] hover:bg-[#E6E6F0] px-3.5 py-2 text-xs font-bold text-[#393678] transition-all cursor-pointer"
              title="Return to user intranet"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#00afef]" />
              <span className="hidden sm:inline">Return to Intranet</span>
            </button>

            {/* Admin Identity */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#0A1328] text-xs font-bold text-white shadow-xs">
                {initials}
              </div>
              <div className="hidden md:block text-left leading-tight">
                <div className="font-bold text-[#393678]">{formattedName}</div>
                <div className="text-[10px] text-slate-500 font-semibold">{user.roleTitle || 'Administrator'}</div>
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={() => { window.location.href = '/logout'; }}
              className="p-2 text-slate-500 hover:text-[#f16136] hover:bg-[#f16136]/10 rounded-xl transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
      </div>

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
              <span>Back to Staff Portal</span>
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
              <span>Back to Staff Portal</span>
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-16 sm:pb-20 overflow-y-auto h-full">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
