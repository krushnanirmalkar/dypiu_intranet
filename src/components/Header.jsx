import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, KeyRound, User, Settings, LogOut, ArrowUpRight, Check, Menu, X } from 'lucide-react';
import dypiuLogo from '../assets/dypiu-logo.png';
import { TopRightHeaderShape } from './DecorativeShapes';

export const Header = (/** @type {any} */ {
  onToggleSidebar,
  isSidebarOpen,
  user: propUser,
  notifications: propNotifications,
  unreadCount: propUnreadCount,
  onMarkNotificationsRead,
  onNavigate
} = {}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [localUnreadCount, setLocalUnreadCount] = useState(3);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const getCategoryBadgeStyle = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('urgent') || cat.includes('exam')) {
      return 'bg-[#f16136]/10 text-[#f16136] border-[#f16136]/25';
    }
    if (cat.includes('acad')) {
      return 'bg-[#00afef]/10 text-[#00afef] border-[#00afef]/25';
    }
    if (cat.includes('event')) {
      return 'bg-[#faa831]/15 text-[#faa831] border-[#faa831]/30';
    }
    if (cat.includes('achieve')) {
      return 'bg-[#1bb470]/15 text-[#1bb470] border-[#1bb470]/30';
    }
    return 'bg-[#393678]/10 text-[#393678] border-[#393678]/25';
  };

  const rawNotifications = propNotifications && propNotifications.length > 0 ? propNotifications : [
    {
      id: 'default-notif-1',
      title: 'Welcome to DYPIU UniOne Intranet',
      time: '7d ago',
      message: 'Your central portal for campus notices, academic services, and digital resources is now active.',
      isRead: false
    }
  ];

  const unreadCount = typeof propUnreadCount === 'number'
    ? propUnreadCount
    : rawNotifications.filter((n) => !n.isRead).length || localUnreadCount;

  // Handle clicking outside profile or notification dropdown to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatName = (str) => {
    if (!str) return 'Sarthak Jayant Kharche';
    return str
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const formattedName = formatName(propUser?.name);
  const formattedFirstName = formattedName.split(' ')[0] || 'Sarthak';

  const isAdmin = Boolean(
    propUser?.isSuperAdmin ||
    propUser?.role === 'admin' ||
    (Array.isArray(propUser?.roles) && (propUser.roles.includes('admin') || propUser.roles.includes('super_admin')))
  );

  const hasServiceAccess = Boolean(
    propUser?.hasAdminPortalAccess ||
    (Array.isArray(propUser?.permissions?.allowedServices) && propUser.permissions.allowedServices.length > 0)
  );

  const user = {
    name: formattedName,
    email: propUser?.email || '20240802084@dypiu.ac.in',
    shortName: formattedFirstName,
    avatar: propUser?.avatar || propUser?.picture || '/images/avatars/header-avatar.jpg',
    isSuperAdmin: propUser?.isSuperAdmin,
    hasAdminPortalAccess: propUser?.hasAdminPortalAccess,
    role: propUser?.role,
    roles: propUser?.roles,
    permissions: propUser?.permissions,
    roleTitle: propUser?.roleTitle || (propUser?.isSuperAdmin ? 'Super Administrator' : propUser?.role === 'admin' ? 'Administrator' : propUser?.role === 'staff' ? 'Staff' : 'Student')
  };

  return (
    <div className="bg-[#0A1328] sticky top-0 z-40 select-none shrink-0 w-full">
      <header className="bg-white rounded-bl-[24px] sm:rounded-bl-[32px] border-b border-slate-200/80 shadow-xs h-16 sm:h-20 px-3 sm:px-6 md:px-7 flex items-center justify-between relative overflow-visible">
        {/* Top right decorative shape */}
        <TopRightHeaderShape className="h-full w-28 sm:w-36 md:w-44" />

        {/* Left: Hamburger Menu (Mobile only) + DYPIU Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 py-1.5 pl-1 sm:pl-2">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 -ml-1 text-[#393678] hover:text-[#00afef] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <img 
            src={dypiuLogo} 
            alt="D Y Patil International University Akurdi Pune" 
            className="h-10 sm:h-14 md:h-16 max-h-[44px] sm:max-h-[58px] w-auto object-contain cursor-pointer transition-transform hover:scale-102"
          />
        </div>

        {/* Right: Search, Notification, Profile */}
        <div className="relative z-20 flex items-center gap-2 sm:gap-4 md:gap-5 mr-1 sm:mr-4 md:mr-16">
          {/* Mobile Search Toggle Icon */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="sm:hidden p-1.5 text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Search Bar (Tablet & Desktop) */}
          <div className="hidden sm:block relative w-44 md:w-60 lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search apps, events, people..."
              className="w-full bg-[#F1F1F7] hover:bg-[#E6E6F0] focus:bg-white text-xs text-slate-700 placeholder-slate-400 pl-10 pr-4 py-2 sm:py-2.5 rounded-full border border-transparent focus:border-[#002B5C] outline-none transition-all"
            />
          </div>

          {/* Bell Notification & Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              aria-label="Notifications"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-1.5 sm:p-2 text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 rounded-full transition-colors cursor-pointer focus:outline-none"
            >
              <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#f16136] text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Notification Dropdown Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#0A1328] text-white flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4 stroke-[2]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#393678]">
                      Recent Notifications
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setLocalUnreadCount(0);
                      onMarkNotificationsRead?.();
                    }}
                    className="text-xs font-semibold text-[#393678] hover:text-[#00afef] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-[#393678]" /> Mark read
                  </button>
                </div>

                <div className="border-b border-slate-100 my-3" />

                {/* Main Notification Card(s) */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {rawNotifications.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedNotification(item);
                        setIsNotifOpen(false);
                      }}
                      className="p-3.5 rounded-2xl border border-indigo-200/80 bg-indigo-50/40 hover:bg-indigo-50/70 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-9 h-9 bg-white border border-indigo-100 rounded-xl flex items-center justify-center text-[#393678] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <Bell className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-[#393678] leading-snug group-hover:text-[#00afef] transition-colors truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-indigo-500 font-medium shrink-0">
                            {item.time || item.createdAt || 'Recent'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">
                          {item.message || item.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 my-3" />

                {/* Footer Action Link */}
                <button
                  type="button"
                  onClick={() => {
                    setIsNotifOpen(false);
                    onNavigate?.('notifications');
                  }}
                  className="w-full text-center text-xs font-bold text-[#00afef] hover:text-[#002B5C] transition-colors cursor-pointer py-1"
                >
                  View all notifications &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Profile Avatar & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 cursor-pointer group focus:outline-none"
            >
              {user.avatar && !avatarError ? (
                <img
                  src={user.avatar}
                  alt={user.shortName}
                  onError={() => setAvatarError(true)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-200 group-hover:border-[#002B5C] transition-colors"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0A1328] text-white flex items-center justify-center font-bold text-xs border border-slate-200 shadow-2xs group-hover:bg-[#393678] transition-colors">
                  {user.shortName ? user.shortName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-bold text-slate-700 group-hover:text-[#002B5C] transition-colors">
                  {user.shortName}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold leading-none mt-0.5">
                  {user.roleTitle}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 group-hover:text-slate-800 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-3 w-72 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl border border-slate-200/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header User Details */}
                <div className="p-3.5 bg-slate-50/80 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#393678] tracking-wide truncate">
                      {user.name}
                    </h4>
                    <span className="text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 shrink-0">
                      {user.roleTitle}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-[#00afef] mt-0.5 truncate">
                    {user.email}
                  </p>
                </div>

                {/* Options List */}
                <div className="p-1.5 space-y-0.5">
                  {isAdmin ? (
                    <a
                      href="#admin-portal"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsProfileOpen(false);
                        onNavigate?.('admin');
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-[#00afef]/15 text-[#00afef] group-hover:bg-[#00afef]/25 transition-colors">
                        <KeyRound className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors flex-1">
                        Admin Portal
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00afef] transition-colors" />
                    </a>
                  ) : hasServiceAccess ? (
                    <a
                      href="#service-portal"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsProfileOpen(false);
                        onNavigate?.('admin');
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-[#faa831]/15 text-[#faa831] group-hover:bg-[#faa831]/25 transition-colors">
                        <KeyRound className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors flex-1">
                        Service Portal
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00afef] transition-colors" />
                    </a>
                  ) : null}

                  <a
                    href="#profile"
                    onClick={(e) => {
                      setIsProfileOpen(false);
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate('profile');
                      }
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-[#393678]/10 text-[#393678] group-hover:bg-[#393678]/20 transition-colors">
                      <User className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors">
                      My Profile
                    </span>
                  </a>

                  <a
                    href="#preferences"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-[#00afef]/15 text-[#00afef] group-hover:bg-[#00afef]/25 transition-colors">
                      <Settings className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors">
                      Preferences
                    </span>
                  </a>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      window.location.href = '/logout';
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f16136]/10 transition-colors cursor-pointer group text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-[#f16136]/15 text-[#f16136] group-hover:bg-[#f16136]/25 transition-colors">
                      <LogOut className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-bold text-[#f16136] transition-colors">
                      Sign Out
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Mobile Search Bar Drawer */}
        {isMobileSearchOpen && (
          <div className="absolute inset-x-0 top-full bg-white border-b border-slate-200 px-4 py-2.5 shadow-lg flex items-center gap-2 sm:hidden z-50 animate-in slide-in-from-top-2 duration-150">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search apps, events, people..."
                className="w-full bg-[#F1F1F7] text-xs text-slate-700 placeholder-slate-400 pl-9 pr-3 py-2 rounded-full outline-none border border-slate-200 focus:border-[#002B5C]"
              />
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="text-xs font-bold text-[#393678] hover:text-[#f16136] px-1 py-1"
            >
              Cancel
            </button>
          </div>
        )}
      </header>

      {/* Notification Detail Modal Popup */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs select-none">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header with category badge & close */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider border ${getCategoryBadgeStyle(selectedNotification.category)}`}>
                  {selectedNotification.category || 'Notification'}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {selectedNotification.time || selectedNotification.timestamp || selectedNotification.createdAt || 'Recent'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Notification Title & Meta */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-[#393678] font-serif-custom leading-snug">
                {selectedNotification.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Official Campus Alert · DYPIU Intranet Portal
              </p>
            </div>

            {/* Notification Message Body */}
            <div className="rounded-2xl bg-[#F8F9FC] border border-slate-200/80 p-4 text-xs sm:text-sm font-medium leading-relaxed text-slate-700 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedNotification.message || selectedNotification.content}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedNotification(null);
                  onNavigate?.('notifications');
                }}
                className="text-xs font-bold text-[#00afef] hover:text-[#002B5C] transition-colors cursor-pointer"
              >
                View all notifications &rarr;
              </button>

              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="rounded-xl bg-[#0A1328] hover:bg-[#152347] px-5 py-2.5 text-xs font-bold text-white transition cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
