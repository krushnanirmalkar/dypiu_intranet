import React from 'react';
import type { UserRole } from '../types';
import { HelpCircle, LogOut, Phone, Calendar, BookMarked } from 'lucide-react';
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
          {/* Header Brand - Clickable to return to Dashboard */}
          <button 
            onClick={() => {
              onNavigate('dashboard');
              onCloseMobile();
            }}
            className="h-20 px-4 py-3 border-b border-navy-100 flex items-center justify-center bg-white shrink-0 cursor-pointer focus:outline-none w-full"
            title="Return to Dashboard"
          >
            <img 
              src="/DYPIU colour logo 1.png" 
              alt="D Y Patil International University" 
              className="h-full w-auto object-contain max-w-full" 
            />
          </button>

          {/* Sidebar Mini Calendar & Quick Links */}
          <div className="p-3.5 overflow-y-auto flex-1 space-y-3">
            <MiniCalendar />

            {/* Quick Links & Contacts */}
            <div className="bg-white rounded-xl border border-navy-100 p-3 shadow-xs space-y-2">
              <h4 className="text-[11px] font-extrabold text-navy-900 uppercase tracking-wider">
                Quick Links
              </h4>
              <div className="flex flex-col space-y-1.5 text-xs">
                <button
                  onClick={() => alert("Campus IT Helpdesk: support@dypiu.ac.in | Ext: 4040")}
                  className="w-full p-2 rounded-lg bg-navy-50/70 hover:bg-navy-100 border border-navy-100 flex items-center space-x-2 text-navy-800 font-medium group text-left transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-navy-600 shrink-0" />
                  <span className="truncate text-xs font-bold">IT Support Desk</span>
                </button>

                <button
                  onClick={() => alert("Academic Calendar 2026-27: Mid-term exams start March 15.")}
                  className="w-full p-2 rounded-lg bg-navy-50/70 hover:bg-navy-100 border border-navy-100 flex items-center space-x-2 text-navy-800 font-medium group text-left transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-navy-600 shrink-0" />
                  <span className="truncate text-xs font-bold">Academic Calendar</span>
                </button>

                <button
                  onClick={() => alert("Central Library Portal: 45,000+ E-books and IEEE Journals available.")}
                  className="w-full p-2 rounded-lg bg-navy-50/70 hover:bg-navy-100 border border-navy-100 flex items-center space-x-2 text-navy-800 font-medium group text-left transition-colors"
                >
                  <BookMarked className="w-3.5 h-3.5 text-navy-600 shrink-0" />
                  <span className="truncate text-xs font-bold">Central E-Library</span>
                </button>

                <button
                  onClick={() => alert("DYPIU Student FAQs & Guidelines portal opened.")}
                  className="w-full p-2 rounded-lg bg-navy-50/70 hover:bg-navy-100 border border-navy-100 flex items-center space-x-2 text-navy-800 font-medium group text-left transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-navy-600 shrink-0" />
                  <span className="truncate text-xs font-bold">Help Desk & FAQs</span>
                </button>
              </div>
            </div>
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
              onClick={() => {window.location.href = '/logout';}}
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

