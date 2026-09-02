import React, { useEffect, useRef, useState } from 'react';
import { Bell, LogOut, Menu, Settings, User } from 'lucide-react';
import type { NotificationItem, UserProfile } from '../types';
import { NotificationPanel } from './NotificationPanel';

interface TopNavbarProps {
  user: UserProfile;
  onToggleMobileSidebar: () => void;
  unreadNotifCount: number;
  onNavigate: (navId: string) => void;
  overlaysHero?: boolean;
  notifications?: NotificationItem[];
  onMarkAllRead?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  onToggleMobileSidebar,
  unreadNotifCount,
  onNavigate,
  overlaysHero = false,
  notifications = [],
  onMarkAllRead = () => {},
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const initials = user.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-30 border-b transition-colors ${overlaysHero ? 'border-transparent bg-transparent' : 'border-navy-100/80 bg-white/95 backdrop-blur-xl'}`}>
      <div className="mx-auto flex h-16 w-full max-w-[1500px] items-center gap-2.5 px-4 sm:px-5 lg:px-6">
        <button onClick={() => onNavigate('dashboard')} className="hidden w-[230px] shrink-0 items-center justify-start pl-8 sm:flex" aria-label="Go to dashboard">
          <img src="/DYPIU colour logo 1.png" alt="D Y Patil International University" className="h-12 w-auto object-contain" />
        </button>

        <button onClick={onToggleMobileSidebar} className={`rounded-xl p-2 text-navy-800 ${overlaysHero ? 'bg-white/45 hover:bg-white/70' : 'hover:bg-navy-50'} sm:hidden`} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1" />

        <div ref={notifRef} className="relative ml-1 sm:ml-2">
          <button onClick={() => setIsNotifOpen((open) => !open)} className="relative rounded-full bg-navy-900/90 p-2.5 text-white shadow-[0_3px_10px_rgba(2,2,45,0.3)] transition hover:bg-navy-950" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            {unreadNotifCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white ring-2 ring-white">
                {unreadNotifCount}
              </span>
            )}
          </button>
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-navy-100 bg-white p-2 shadow-2xl">
              <NotificationPanel notifications={notifications} currentRole={user.role} onMarkAllRead={onMarkAllRead} />
            </div>
          )}
        </div>

        <div ref={dropdownRef} className="relative">
          <button onClick={() => setIsDropdownOpen((open) => !open)} className={`rounded-full transition ${overlaysHero ? 'hover:ring-4 hover:ring-white/35' : 'hover:ring-4 hover:ring-navy-50'}`} aria-label={`Open profile menu for ${user.name}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/90 bg-navy-900 text-xs font-black text-white shadow-[0_3px_10px_rgba(2,2,45,0.3)] transition hover:bg-navy-950" title={user.name}>
              {initials}
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-navy-100 bg-white shadow-xl">
              <div className="border-b border-navy-100 bg-navy-50/60 px-4 py-3">
                <p className="text-xs font-bold text-navy-900">{user.name}</p>
                <p className="truncate text-[11px] text-navy-500">{user.email}</p>
              </div>
              <button onClick={() => { onNavigate('profile'); setIsDropdownOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-navy-800 hover:bg-navy-50">
                <User className="h-4 w-4" />My Profile
              </button>
              <button onClick={() => { onNavigate('settings'); setIsDropdownOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-navy-800 hover:bg-navy-50">
                <Settings className="h-4 w-4" />Preferences
              </button>
              <button onClick={() => { setIsDropdownOpen(false); window.location.href = '/logout'; }} className="flex w-full items-center gap-2.5 border-t border-navy-100 px-4 py-2.5 text-xs font-medium text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4" />Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
