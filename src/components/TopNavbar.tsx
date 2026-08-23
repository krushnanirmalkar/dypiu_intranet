import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile, UserRole, NotificationItem } from '../types';
import { NotificationPanel } from './NotificationPanel';
import { 
  Search, Bell, Menu, User, Settings, RefreshCw, LogOut, ChevronDown, Check
} from 'lucide-react';

interface TopNavbarProps {
  user: UserProfile;
  currentNav: string;
  onRoleSwitch: (newRole: UserRole) => void;
  onToggleMobileSidebar: () => void;
  unreadNotifCount: number;
  onNavigate: (navId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications?: NotificationItem[];
  onMarkAllRead?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  currentNav,
  onRoleSwitch,
  onToggleMobileSidebar,
  unreadNotifCount,
  onNavigate,
  searchQuery,
  onSearchChange,
  notifications = [],
  onMarkAllRead = () => {},
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navTitles: Record<string, string> = {
    dashboard: 'Dashboard / Overview',
    applications: 'Digital Workspace / Applications',
    academics: 'Academic Services',
    students: 'Student Management & Analytics',
    events: 'Campus Life & Academic Events',
    notifications: 'Notifications & Broadcasts',
    documents: 'Document Vault & Transcripts',
    profile: 'User Profile & Academic Record',
    settings: 'Account Settings & SSO Preferences',
    support: 'Help Desk & SSO Assistance',
  };

  return (
    <header className="h-16 bg-white border-b border-navy-100 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-lg text-navy-700 hover:bg-navy-50 lg:hidden focus:outline-none"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="text-xs font-semibold uppercase tracking-wider text-navy-400">
            Intranet Portal
          </div>
          <div className="text-sm font-bold text-navy-900 tracking-tight">
            {navTitles[currentNav] || 'Dashboard / Overview'}
          </div>
        </div>
      </div>

      {/* Center: Search Field */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search applications (Juno, LMS...), announcements, events..."
            className="w-full pl-9 pr-4 py-1.5 bg-navy-50/70 border border-navy-200/70 rounded-lg text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:bg-white focus:border-navy-800 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        {/* Notifications Bell Dropdown Container */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-navy-700 hover:bg-navy-50 hover:text-navy-900 transition-colors focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-navy-800 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-navy-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <NotificationPanel
                notifications={notifications}
                currentRole={user.role}
                onMarkAllRead={onMarkAllRead}
              />
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-navy-50 transition-colors focus:outline-none"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-navy-200"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-navy-900 leading-tight">{user.name}</div>
              <div className="text-[10px] font-medium text-navy-500 capitalize">{user.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-navy-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-navy-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-navy-100 bg-navy-50/50">
                <p className="text-xs font-bold text-navy-900">{user.name}</p>
                <p className="text-[11px] text-navy-500 truncate">{user.email}</p>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-navy-800 text-white tracking-wider">
                  {user.role} Role
                </div>
              </div>

              {/* Navigation Links */}
              <div className="py-1">
                <button
                  onClick={() => { onNavigate('profile'); setIsDropdownOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-navy-800 hover:bg-navy-50 font-medium transition-colors"
                >
                  <User className="w-4 h-4 text-navy-500" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => { onNavigate('settings'); setIsDropdownOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-navy-800 hover:bg-navy-50 font-medium transition-colors"
                >
                  <Settings className="w-4 h-4 text-navy-500" />
                  <span>Preferences & SSO Settings</span>
                </button>
              </div>

              {/* Role Switcher Demo */}
              <div className="px-4 py-2 border-t border-b border-navy-100 bg-navy-50/30">
                <div className="text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3 text-navy-500" />
                  <span>Demo: Switch Role</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => { onRoleSwitch('student'); setIsDropdownOpen(false); }}
                    className={`px-2.5 py-1.5 text-xs rounded font-medium flex items-center justify-between border transition-all ${
                      user.role === 'student' 
                        ? 'bg-navy-800 text-white border-navy-800 font-bold' 
                        : 'bg-white text-navy-800 border-navy-200 hover:border-navy-400'
                    }`}
                  >
                    <span>Student</span>
                    {user.role === 'student' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => { onRoleSwitch('faculty'); setIsDropdownOpen(false); }}
                    className={`px-2.5 py-1.5 text-xs rounded font-medium flex items-center justify-between border transition-all ${
                      user.role === 'faculty' 
                        ? 'bg-navy-800 text-white border-navy-800 font-bold' 
                        : 'bg-white text-navy-800 border-navy-200 hover:border-navy-400'
                    }`}
                  >
                    <span>Faculty</span>
                    {user.role === 'faculty' && <Check className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => { alert('Logged out demo'); setIsDropdownOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-navy-700 hover:bg-navy-50 hover:text-red-700 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 text-navy-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
