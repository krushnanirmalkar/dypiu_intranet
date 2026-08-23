import React from 'react';
import type { UserRole } from '../types';
import { HelpCircle, LogOut } from 'lucide-react';
import { MiniCalendar } from './MiniCalendar';

interface AppSidebarProps {
  currentRole: UserRole;
  currentNav: string;
  onNavigate: (navId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
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
        fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-navy-100 flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Brand */}
          <div className="h-20 px-4 py-3 border-b border-navy-100 flex items-center justify-center bg-white shrink-0">
            <img 
              src="/DYPIU colour logo 1.png" 
              alt="D Y Patil International University" 
              className="h-full w-auto object-contain max-w-full" 
            />
          </div>

          {/* Sidebar Mini Calendar */}
          <div className="p-3.5 overflow-y-auto flex-1">
            <MiniCalendar />
          </div>

          {/* Footer Support & Logout */}
          <div className="p-4 border-t border-navy-100 space-y-1 bg-navy-50/50 shrink-0">
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
        </div>
      </aside>
    </>
  );
};

