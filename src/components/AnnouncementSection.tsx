import React, { useState } from 'react';
import type { UserRole } from '../types';
import { 
  Megaphone, Pin, ArrowRight, Clock, ChevronRight, X, ExternalLink
} from 'lucide-react';

export interface AnnouncementItem {
  id: string;
  title: string;
  category: 'Academic' | 'Administrative' | 'Campus' | 'Urgent';
  date: string;
  pinned?: boolean;
  content: string;
  author: string;
  linkText?: string;
  linkUrl?: string;
}

const mockAnnouncements: AnnouncementItem[] = [
  {
    id: 'ann_1',
    title: 'Mid-Term Semester Registration & Fee Payment Portal Open',
    category: 'Urgent',
    date: 'Today',
    pinned: true,
    author: 'Registrar Office',
    content: 'Students are advised to complete mid-term registration and clear pending tuition dues before March 10, 2026.',
    linkText: 'Open Student ERP Portal',
    linkUrl: '/app/student-erp'
  },
  {
    id: 'ann_2',
    title: 'Central Library Operating Hours Extended Until Midnight',
    category: 'Academic',
    date: 'Yesterday',
    pinned: true,
    author: 'Library Administration',
    content: 'Library reading halls will remain open until 12:00 AM for the upcoming mid-semester examinations.',
    linkText: 'E-Library Portal',
    linkUrl: '/app/library'
  },
  {
    id: 'ann_3',
    title: 'Scheduled Campus Network Maintenance (Saturday 02:00 AM - 04:00 AM)',
    category: 'Administrative',
    date: '18 Feb 2026',
    author: 'IT Helpdesk',
    content: 'Routine router maintenance will take place on Saturday midnight. Network connectivity may be briefly affected.',
    linkText: 'Check Status',
    linkUrl: '#status'
  },
  {
    id: 'ann_4',
    title: 'Applications Open for Student Innovation Seed Fund 2026',
    category: 'Campus',
    date: '16 Feb 2026',
    author: 'Incubation Cell',
    content: 'Applications are open for student startup grants up to ₹2,50,000. Last date to apply is March 25, 2026.',
    linkText: 'Apply Now',
    linkUrl: '/app/research'
  }
];

interface AnnouncementSectionProps {
  currentRole: UserRole;
  onViewAll?: () => void;
}

export const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({ onViewAll }) => {
  const [selectedAnn, setSelectedAnn] = useState<AnnouncementItem | null>(null);

  const getCategoryTag = (category: AnnouncementItem['category']) => {
    switch (category) {
      case 'Urgent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Academic':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Administrative':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Campus':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-navy-100">
        <div className="flex items-center space-x-2">
          <Megaphone className="w-4 h-4 text-navy-800" />
          <h3 className="text-sm font-bold text-navy-900">Notice Board</h3>
        </div>
        
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-xs font-medium text-navy-700 hover:text-navy-950 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-2">
        {mockAnnouncements.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedAnn(item)}
            className="p-3 rounded-lg bg-navy-50/50 hover:bg-navy-50 border border-navy-100 transition-colors flex items-start space-x-3 group cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getCategoryTag(item.category)}`}>
                  {item.category}
                </span>

                {item.pinned && (
                  <span className="text-[10px] font-medium text-amber-700 flex items-center">
                    <Pin className="w-2.5 h-2.5 mr-0.5 fill-current" />
                    Pinned
                  </span>
                )}

                <span className="text-[10px] text-navy-400 font-medium ml-auto flex items-center">
                  <Clock className="w-2.5 h-2.5 mr-0.5 text-navy-400" />
                  {item.date}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-navy-900 group-hover:text-navy-800 leading-snug line-clamp-2">
                {item.title}
              </h4>
            </div>

            <ChevronRight className="w-4 h-4 text-navy-300 group-hover:text-navy-700 shrink-0 self-center" />
          </div>
        ))}
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnn && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-navy-100 relative space-y-3">
            <button
              onClick={() => setSelectedAnn(null)}
              className="absolute top-4 right-4 p-1 text-navy-400 hover:text-navy-900 rounded-md hover:bg-navy-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryTag(selectedAnn.category)}`}>
                {selectedAnn.category}
              </span>
              <span className="text-xs text-navy-400">
                {selectedAnn.date}
              </span>
            </div>

            <h3 className="text-base font-bold text-navy-900">
              {selectedAnn.title}
            </h3>

            <div className="text-xs text-navy-500 pb-2 border-b border-navy-100">
              Issued by: <span className="font-semibold text-navy-800">{selectedAnn.author}</span>
            </div>

            <p className="text-xs text-navy-700 leading-relaxed bg-navy-50/60 p-3 rounded-lg border border-navy-100">
              {selectedAnn.content}
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedAnn(null)}
                className="px-3 py-1.5 rounded-lg bg-navy-50 text-navy-700 font-semibold text-xs hover:bg-navy-100"
              >
                Close
              </button>
              {selectedAnn.linkText && (
                <button
                  onClick={() => {
                    alert(`Opening ${selectedAnn.linkText}`);
                    setSelectedAnn(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-navy-800 text-white font-semibold text-xs hover:bg-navy-900 flex items-center space-x-1"
                >
                  <span>{selectedAnn.linkText}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
