import React, { useState } from 'react';
import {
  ArrowLeft,
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
import imgLogo from '../assets/dashboard/logo.png';

export type AdminTab = 'dashboard' | 'notices' | 'applications' | 'policies' | 'access' | 'audit';

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

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notices', label: 'Notices', icon: Megaphone },
    { id: 'applications', label: 'Applications', icon: Grid2X2 },
    { id: 'policies', label: 'University Policies', icon: BookOpen },
    { id: 'access', label: 'Access Control', icon: Key },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck },
  ];

  const handleNavClick = (tab: AdminTab) => {
    onTabChange(tab);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] font-sans text-navy-950 flex flex-col">
      {/* Top Header - Always full-width on top with z-50 */}
      <header className="sticky top-0 z-50 h-16 w-full bg-navy-900 text-white shadow-md flex items-center justify-between px-4 sm:px-6 border-b border-navy-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
            className="p-2 rounded-lg text-white/80 hover:bg-navy-800 lg:hidden focus:outline-none"
            aria-label="Toggle admin menu"
          >
            {isMobileDrawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3">
            <img src={imgLogo} alt="DYPIU Logo" className="h-8 w-auto object-contain" />
            <div className="h-5 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">UniOne</span>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-bold text-blue-200 border border-blue-400/30">
                Admin Portal
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Return to UniOne */}
          <button
            onClick={onReturnToPortal}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
            title="Return to user portal"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Return to UniOne</span>
          </button>

          {/* Admin Identity */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/15 text-xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[11px] font-black text-white uppercase shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className="text-right leading-tight">
              <div className="font-bold text-white">{user.name}</div>
              <div className="text-[10px] text-blue-200 font-medium">Super Administrator</div>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={() => { window.location.href = '/logout'; }}
            className="p-2 text-white/70 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Mobile Drawer Backdrop */}
        {isMobileDrawerOpen && (
          <div
            className="fixed inset-0 top-16 z-30 bg-navy-950/60 backdrop-blur-xs lg:hidden"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
        )}

        {/* Mobile Slide-Over Sidebar (< lg) */}
        <aside
          className={`
            fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-navy-100 flex flex-col justify-between
            transition-transform duration-200 ease-in-out shadow-xl lg:hidden
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
                <p className="truncate text-xs font-bold text-navy-950">{user.name}</p>
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
        <aside className="hidden lg:flex lg:w-64 lg:shrink-0 bg-white border-r border-navy-100 flex-col justify-between min-h-full">
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
                <p className="truncate text-xs font-bold text-navy-950">{user.name}</p>
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
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
