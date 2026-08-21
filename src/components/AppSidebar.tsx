import React from 'react';
import type { UserRole } from '../types';
import { 
  LayoutDashboard, Grid, BookOpen, Calendar, Bell, FileText, User, Settings, HelpCircle, LogOut, Users, BookMarked
} from 'lucide-react';

interface AppSidebarProps {
  currentRole: UserRole;
  currentNav: string;
  onNavigate: (navId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentRole,
  currentNav,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'My Applications', icon: Grid },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const facultyNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'My Applications', icon: Grid },
    { id: 'academics', label: 'Academic Management', icon: BookMarked },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = currentRole === 'faculty' ? facultyNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-navy-100 flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Header Brand */}
          <div className="h-24 px-4 py-3 border-b border-navy-100 flex items-center justify-center bg-white">
            <img 
              src="/DYPIU colour logo 1.png" 
              alt="D Y Patil International University" 
              className="h-full w-auto object-contain max-w-full" 
            />
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="px-3 py-2 text-[11px] font-semibold text-navy-400 uppercase tracking-widest">
              Navigation ({currentRole})
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                    ${isActive 
                      ? 'bg-navy-800 text-white shadow-md shadow-navy-800/10' 
                      : 'text-navy-700 hover:bg-navy-50 hover:text-navy-900'}
                  `}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-navy-500 group-hover:text-navy-800'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Support & Logout */}
        <div className="p-4 border-t border-navy-100 space-y-1 bg-navy-50/50">
          <button 
            onClick={() => { onNavigate('support'); onCloseMobile(); }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-navy-700 hover:bg-white hover:text-navy-900 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-navy-500" />
            <span>Help & Support</span>
          </button>
          <button 
            onClick={() => alert('SSO Logout session terminated mock action.')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-navy-700 hover:bg-white hover:text-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4 text-navy-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
