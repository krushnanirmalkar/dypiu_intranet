import React, { useState, useEffect, useRef } from 'react';
import {
  Pencil,
  Users,
  HelpCircle,
  Settings,
  Share2,
  FileText,
  LogOut,
  ChevronRight,
  KeyRound,
  Check,
  ArrowLeft
} from 'lucide-react';
import type { UserProfile } from '../types';
import { IntranetFooter } from './IntranetFooter';

interface MobileProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  isInAdminPortal?: boolean;
  onNavigate: (route: string) => void;
  onLogout?: () => void;
}

export const MobileProfileMenu: React.FC<MobileProfileMenuProps> = ({
  isOpen,
  onClose,
  user,
  isInAdminPortal = false,
  onNavigate,
  onLogout
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleShare = async () => {
    const shareUrl = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DYPIU UniOne Intranet',
          text: 'Access the official DYPIU UniOne Intranet portal.',
          url: shareUrl,
        });
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          // fallback to clipboard
        } else {
          return;
        }
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Portal link copied to clipboard!');
    } catch {
      showToast('Share URL: ' + shareUrl);
    }
  };

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/logout';
    }
  };

  if (!isOpen) return null;

  // Extract user details
  const rawName = user?.name?.trim() || 'Sarthak Jayant Kharche';
  const firstName = rawName.split(/\s+/)[0] || 'Sarthak';
  const displayGreeting = `Hi ${firstName.toUpperCase()}!`;
  const email = user?.email || '20240802084@dypiu.ac.in';
  const initial = (firstName.charAt(0) || 'S').toUpperCase();
  const roleTitle = user?.roleTitle || (user?.isSuperAdmin ? 'Super Administrator' : user?.role === 'admin' ? 'Administrator' : user?.role === 'staff' ? 'Staff' : 'Student');

  const isAdmin = Boolean(
    user?.isSuperAdmin ||
    user?.role === 'admin' ||
    (Array.isArray(user?.permissions?.allowedServices) && user.permissions.allowedServices.length > 0)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Profile Menu"
      className="fixed top-16 sm:top-20 inset-x-0 bottom-0 z-30 flex flex-col bg-[#F3F3F8] text-slate-800 font-sans antialiased animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden"
      ref={menuRef}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0A1328] text-white border border-slate-700 px-4 py-2 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-3.5 h-3.5 text-[#00afef]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 py-3.5 sm:py-4 space-y-3 sm:space-y-3.5 w-full"
      >
        {/* User Info Header Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 shadow-xs">
          {user?.avatar && !avatarError ? (
            <img
              src={user.avatar}
              alt={rawName}
              onError={() => setAvatarError(true)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0A1328] text-white font-bold text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-md">
              {initial}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-[#393678] font-serif-custom tracking-tight truncate">
                {displayGreeting}
              </h2>
              <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 shrink-0">
                {roleTitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {email}
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('profile');
              }}
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#00afef] hover:text-[#002B5C] transition-colors cursor-pointer group"
            >
              <span>Edit Profile</span>
              <Pencil className="w-3.5 h-3.5 text-[#00afef] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Group 1: Intranet Navigation & Settings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs">
          {isInAdminPortal ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('dashboard');
              }}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-1.5 rounded-lg bg-[#00afef]/15 text-[#00afef] group-hover:bg-[#00afef]/25 transition-colors">
                  <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors">
                  Return to Intranet
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00afef] group-hover:translate-x-0.5 transition-all" />
            </button>
          ) : isAdmin ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('admin');
              }}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-1.5 rounded-lg bg-[#00afef]/15 text-[#00afef] group-hover:bg-[#00afef]/25 transition-colors">
                  <KeyRound className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors">
                  Admin & Management Portal
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00afef] group-hover:translate-x-0.5 transition-all" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('profile');
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-1.5 rounded-lg bg-[#00afef]/15 text-[#00afef] group-hover:bg-[#00afef]/25 transition-colors">
                <Settings className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors">
                Account & Settings
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00afef] group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('dashboard');
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-1.5 rounded-lg bg-[#1bb470]/15 text-[#1bb470] group-hover:bg-[#1bb470]/25 transition-colors">
                <Users className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors">
                Team & Directory
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00afef] group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('support');
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-1.5 rounded-lg bg-[#faa831]/15 text-[#faa831] group-hover:bg-[#faa831]/25 transition-colors">
                <HelpCircle className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors">
                Help & Contact
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00afef] group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Group 2: Share & Legal Pages */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs">
          <button
            type="button"
            onClick={handleShare}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#00afef]/15 group-hover:text-[#00afef] transition-colors">
                <Share2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors">
                Share
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00afef] group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('terms');
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#00afef]/15 group-hover:text-[#00afef] transition-colors">
                <FileText className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors">
                Terms & Conditions
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00afef] group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('privacy');
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#00afef]/15 group-hover:text-[#00afef] transition-colors">
                <FileText className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors">
                Privacy Policy
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00afef] group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Sign Out Button matching Intranet Red Accent */}
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full rounded-2xl border border-red-200 bg-red-50/80 hover:bg-red-100 active:bg-red-200/80 py-3.5 px-4 flex items-center justify-center gap-2 text-xs font-bold text-[#f16136] shadow-xs transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 stroke-[2.2] text-[#f16136]" />
          <span>Sign Out</span>
        </button>

        {/* Footer below at the end of the blocks */}
        <IntranetFooter
          onNavigate={(route) => {
            onClose();
            onNavigate(route);
          }}
          className="mt-3 mb-6 rounded-2xl border border-slate-800"
        />
      </div>
    </div>
  );
};
