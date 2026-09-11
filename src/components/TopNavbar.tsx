import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Bell, CheckCircle2, LogOut, Menu, Search, Send, Settings, User, Users, X } from 'lucide-react';
import type { NotificationItem, UserProfile } from '../types';
import { NotificationPanel } from './NotificationPanel';
import imgLogo from '../assets/dashboard/logo.png';

const DIRECTORY = [
  { name: 'Dr. Ananya Sharma', role: 'Dean Academics' },
  { name: 'Prof. Rahul Deshmukh', role: 'CSE Faculty' },
  { name: 'Ms. Priya Nair', role: 'Registrar Office' },
  { name: 'Mr. Amit Patil', role: 'IT Helpdesk' },
  { name: 'Dr. Sneha Kulkarni', role: 'IQAC Coordinator' },
  { name: 'Placement Cell', role: 'Career Services' },
];

interface TopNavbarProps {
  user: UserProfile;
  onToggleMobileSidebar: () => void;
  unreadNotifCount: number;
  onNavigate: (navId: string) => void;
  notifications?: NotificationItem[];
  onMarkAllRead?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  onToggleMobileSidebar,
  unreadNotifCount,
  onNavigate,
  notifications = [],
  onMarkAllRead = () => {},
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false);
  const [directorySearch, setDirectorySearch] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const initials = user.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?';

  const filteredDirectory = DIRECTORY.filter((person) =>
    `${person.name} ${person.role}`.toLowerCase().includes(directorySearch.trim().toLowerCase())
  );

  const handleRaiseGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceText.trim()) return;
    try {
      localStorage.setItem(`dypiu-grievance-draft:${user.id}`, grievanceText);
      setGrievanceSubmitted(true);
    } catch {
      // ignore draft saving error
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {isCommunicationOpen && (
        <button
          aria-label="Close communication overlay"
          onClick={() => setIsCommunicationOpen(false)}
          className="fixed inset-0 z-45 cursor-default bg-slate-900/20 backdrop-blur-sm"
        />
      )}

      {isGrievanceOpen && (
        <button
          aria-label="Close grievance overlay"
          onClick={() => setIsGrievanceOpen(false)}
          className="fixed inset-0 z-50 cursor-default bg-slate-900/40 backdrop-blur-sm"
        />
      )}

      <header className={`h-[var(--header-height)] bg-white text-[#0c1e38] flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 shadow-sm relative border-b border-[#0c1e38]/10 ${isCommunicationOpen || isGrievanceOpen ? 'z-50' : 'z-40'}`}>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 focus:outline-none" aria-label="Go to dashboard">
            <img src={imgLogo} alt="DYPIU Logo" className="h-9 sm:h-10 w-auto max-h-full object-contain shrink-0" />
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <span className="text-xl sm:text-2xl font-black tracking-tighter select-none">
              <span className="text-[#0c1e38]">Uni</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#ec510d] to-[#de4909] drop-shadow-sm">One</span>
            </span>
          </button>

          <button onClick={onToggleMobileSidebar} className="rounded-xl p-2 text-[#0c1e38] hover:bg-slate-100 sm:hidden ml-2" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={() => {
              if (!isCommunicationOpen) setIsGrievanceOpen(true);
            }}
            disabled={isCommunicationOpen}
            className={`h-9 px-3 rounded-full bg-[#ec510d] text-white hover:bg-[#de4909] flex items-center gap-2 text-xs font-bold shadow-sm transition-colors shrink-0 ${isCommunicationOpen ? 'pointer-events-none opacity-80' : ''}`}
            aria-label="Open Grievance Cell form"
          >
            <AlertCircle className="size-4" />
            <span className="hidden sm:inline">Grievance Cell</span>
          </button>

          <div className="relative z-50">
            {isCommunicationOpen && (
              <div className="absolute right-0 top-[calc(var(--header-height)-4px)] w-[min(320px,calc(100vw-32px))] rounded-2xl bg-white border border-slate-100 shadow-[0_20px_46px_rgb(12,30,56,0.22)] overflow-hidden z-50">
                <div className="bg-[#0c1e38] text-white px-3.5 py-2.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-serif font-bold">Communication Channel</h3>
                    <p className="text-[10px] text-white/70 mt-0.5">Search the campus directory</p>
                  </div>
                  <button
                    aria-label="Close communication channel"
                    onClick={() => setIsCommunicationOpen(false)}
                    className="size-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="p-3">
                  <label className="relative block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      value={directorySearch}
                      onChange={(event) => setDirectorySearch(event.target.value)}
                      placeholder="Search directory names..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-medium text-[#0c1e38] outline-none focus:border-[#ec510d]/50 focus:bg-white"
                    />
                  </label>
                  <div className="mt-3 space-y-1.5">
                    {filteredDirectory.slice(0, 3).map((person) => (
                      <button
                        key={`${person.name}-${person.role}`}
                        onClick={() => onNavigate('applications')}
                        className="w-full rounded-xl bg-slate-50 px-3 py-1.5 text-left hover:bg-orange-50/60 transition-colors"
                      >
                        <span className="block text-xs font-bold text-[#0c1e38]">{person.name}</span>
                        <span className="block text-[10px] font-medium text-slate-500 mt-0.5">{person.role}</span>
                      </button>
                    ))}
                    {filteredDirectory.length === 0 && (
                      <p className="rounded-xl bg-slate-50 px-3 py-3 text-xs font-medium text-slate-500">No directory match found.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCommunicationOpen((open) => !open)}
              className="h-9 px-3 rounded-full bg-[#0c1e38] text-white hover:bg-[#142b4b] flex items-center gap-2 text-xs font-bold shadow-sm transition-colors"
              aria-label="Open communication channel"
            >
              <Users className="size-4" />
              <span className="hidden sm:inline">Communication</span>
            </button>
          </div>
        <div ref={notifRef} className="relative">
          <button onClick={() => setIsNotifOpen((open) => !open)} className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 bg-[#ec510d] rounded-full"></span>
            )}
          </button>
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50">
              <NotificationPanel
                notifications={notifications}
                currentRole={user.role}
                onMarkAllRead={onMarkAllRead}
                onViewAll={() => {
                  setIsNotifOpen(false);
                  onNavigate('notifications');
                }}
              />
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        <div ref={dropdownRef} className="relative z-50">
          <button onClick={() => setIsDropdownOpen((open) => !open)} className="flex items-center gap-2 cursor-pointer group">
            <div className="text-right leading-none hidden md:block">
              <div className="text-xs font-bold text-[#0c1e38]">{user.name}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">PRN: {user.collegeId}</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[10px] font-extrabold text-[#0c1e38]">
              {initials}
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-b-2xl rounded-t-sm border border-slate-200 bg-white shadow-[0_18px_48px_rgb(12,30,56,0.16)] z-50">
              <div className="px-5 py-4 bg-white">
                <p className="text-base font-extrabold leading-tight text-[#02022D]">{user.name}</p>
                <p className="mt-1 truncate text-sm font-medium text-blue-600">{user.email}</p>
              </div>
              <div className="border-t border-slate-200">
                <button onClick={() => { onNavigate('profile'); setIsDropdownOpen(false); }} className="flex w-full items-center gap-4 px-5 py-3.5 text-left text-base font-semibold text-[#02022D] hover:bg-slate-50 transition-colors">
                  <User className="h-5 w-5" /><span>My Profile</span>
                </button>
                <button onClick={() => { onNavigate('settings'); setIsDropdownOpen(false); }} className="flex w-full items-center gap-4 px-5 py-3.5 text-left text-base font-semibold text-[#02022D] hover:bg-slate-50 transition-colors">
                  <Settings className="h-5 w-5" /><span>Preferences</span>
                </button>
              </div>
              <button onClick={() => { setIsDropdownOpen(false); window.location.href = '/logout'; }} className="flex w-full items-center gap-4 border-t border-slate-200 px-5 py-3.5 text-left text-base font-semibold text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="h-5 w-5" /><span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
      </header>

      {isGrievanceOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center px-4">
          <form onSubmit={handleRaiseGrievance} className="w-full max-w-[460px] rounded-2xl bg-white border border-orange-100 shadow-[0_24px_70px_rgb(12,30,56,0.24)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#ec510d] to-[#de4909] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold">Grievance Cell</h3>
                <p className="text-xs text-white/80 mt-1">Fill your concern and save it as a draft.</p>
              </div>
              <button
                type="button"
                aria-label="Close grievance form"
                onClick={() => setIsGrievanceOpen(false)}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {grievanceSubmitted && (
                <div className="rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="size-4" /> Draft saved on this device
                </div>
              )}
              <label className="block">
                <span className="text-xs font-bold text-[#0c1e38]">Describe your concern</span>
                <textarea
                  value={grievanceText}
                  onChange={(e) => setGrievanceText(e.target.value)}
                  aria-label="Describe your concern"
                  placeholder="Write your academic, administrative, or hostel concern..."
                  className="mt-2 w-full h-32 bg-slate-50 text-[#0c1e38] text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#ec510d]/50 resize-none placeholder-slate-500"
                />
              </label>
              <p className="text-xs font-medium text-slate-500">Draft only. University ticket submission is not connected yet.</p>
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsGrievanceOpen(false)} className="text-xs font-bold text-slate-500 hover:text-[#0c1e38] px-3 py-2">Cancel</button>
                <button type="submit" className="bg-[#ec510d] hover:bg-[#de4909] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Send className="size-3.5" /> Save Draft
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
