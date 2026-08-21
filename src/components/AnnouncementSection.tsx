import React from 'react';
import type { UserRole } from '../types';
import { 
  Megaphone, Pin, ArrowRight, Clock
} from 'lucide-react';

export interface AnnouncementItem {
  id: string;
  title: string;
  category: 'Academic' | 'Administrative' | 'Campus' | 'Urgent';
  date: string;
  pinned?: boolean;
}

const mockAnnouncements: AnnouncementItem[] = [
  {
    id: 'ann_1',
    title: 'Semester Registration & Fee Payment Portal Now Open for Mid-Term 2026',
    category: 'Urgent',
    date: 'Today, 10:00 AM',
    pinned: true,
  },
  {
    id: 'ann_2',
    title: 'Central Library Operating Hours Extended Until Midnight for Upcoming Exams',
    category: 'Academic',
    date: 'Yesterday',
    pinned: true,
  },
  {
    id: 'ann_3',
    title: 'Campus Wi-Fi Maintenance Scheduled for Saturday 02:00 AM - 04:00 AM',
    category: 'Administrative',
    date: '18 Feb 2026',
  },
  {
    id: 'ann_4',
    title: 'Applications Open for University Student Innovation & Incubation Fund',
    category: 'Campus',
    date: '16 Feb 2026',
  }
];

interface AnnouncementSectionProps {
  currentRole: UserRole;
  onViewAll?: () => void;
}

export const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({ onViewAll }) => {
  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-navy-800 text-white">
            <Megaphone className="w-4 h-4" />
          </div>
          <h3 className="text-base font-extrabold text-navy-900">Campus Announcements</h3>
        </div>
        
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-xs font-bold text-navy-800 hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col space-y-3">
        {mockAnnouncements.map((item) => (
          <div 
            key={item.id}
            className="p-3.5 rounded-xl bg-navy-50/60 border border-navy-100 hover:border-navy-300 transition-colors flex items-start space-x-3 group cursor-pointer"
          >
            <div className="p-1.5 rounded-lg bg-white border border-navy-200 shrink-0 text-navy-800 mt-0.5">
              {item.pinned ? <Pin className="w-3.5 h-3.5 fill-current" /> : <Megaphone className="w-3.5 h-3.5" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-navy-800 border border-navy-200">
                  {item.category}
                </span>
                <span className="text-[10px] text-navy-400 font-medium flex items-center">
                  <Clock className="w-3 h-3 mr-0.5" />
                  {item.date}
                </span>
              </div>

              <h4 className="text-xs font-bold text-navy-900 group-hover:text-navy-800 transition-colors leading-snug line-clamp-2">
                {item.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
