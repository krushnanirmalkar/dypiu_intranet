import React from 'react';
import {
  MessageSquare,
  Sparkles,
  Bot,
  ExternalLink,
  Users
} from 'lucide-react';

interface CommunicationFloatingButtonProps {
  onClick: () => void;
  unreadCount?: number;
}

export const CommunicationFloatingButton: React.FC<CommunicationFloatingButtonProps> = ({
  onClick,
  unreadCount = 2,
}) => {
  return (
    <aside aria-label="Campus communication channel" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 group">
      {/* Floating tooltip badge */}
      <div className="hidden md:flex items-center gap-2 bg-slate-900/90 text-white px-3.5 py-1.5 rounded-full text-xs font-medium shadow-lg backdrop-blur-xs border border-white/10 group-hover:opacity-100 opacity-90 transition-opacity">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Teams & campus messenger</span>
      </div>

      {/* Main Floating Trigger Button */}
      <button
        onClick={onClick}
        type="button"
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#0E0F8C] to-[#00AFEF] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#00AFEF]/30"
        title="Open Communication Channel (MS Teams / Campus Chat)"
      >
        <MessageSquare className="w-6 h-6 stroke-[2.2]" />

        {/* Unread badge indicator */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F16136] text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>
    </aside>
  );
};
