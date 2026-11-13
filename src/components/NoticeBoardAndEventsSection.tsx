import React, { useState } from 'react';
import {
  ChevronRight,
  Clock,
  X
} from 'lucide-react';

export interface NoticeItem {
  id: string | number;
  tag: string;
  tagColor?: string;
  title: string;
  desc: string;
  date: string;
  author?: string;
  important?: boolean;
}

export interface UniversityEventItem {
  id: string | number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  month: string;
  day: string;
  isOnline?: boolean;
  image?: string;
}

const DEFAULT_NOTICES: NoticeItem[] = [
  {
    id: 1,
    tag: 'Academic',
    tagColor: 'bg-[#00AFEF]/10 text-[#00AFEF] border-[#00AFEF]/25',
    title: 'End-semester examination schedule released for Spring 2026',
    desc: 'The complete examination datesheet for B.Tech CSE, Bioengineering, and Management courses is published on Juno. Hall tickets can be downloaded starting Monday.',
    date: 'Today · Exam Cell',
    author: 'Controller of Examinations',
    important: true,
  },
  {
    id: 2,
    tag: 'Event',
    tagColor: 'bg-[#FAA831]/15 text-[#b07212] border-[#FAA831]/30',
    title: 'InnovateX 2026 hackathon registrations now open',
    desc: 'Register your 4-member multidisciplinary team for the 24-hour national hackathon hosted in the university central auditorium.',
    date: 'Yesterday · Student Council',
    author: 'Student Council',
  },
  {
    id: 3,
    tag: 'Campus',
    tagColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25',
    title: 'Extended library night hours activated for study month',
    desc: 'Central Knowledge Centre reading halls and digital labs will remain accessible until 2:00 AM on weekdays with security presence and cafeteria support.',
    date: '28 Sep · Library Wing',
    author: 'University Librarian',
  },
  {
    id: 4,
    tag: 'Placement',
    tagColor: 'bg-[#0E0F8C]/10 text-[#0E0F8C] border-[#0E0F8C]/25',
    title: 'Amazon & TCS pre-placement assessment dates',
    desc: 'Eligible 7th & 8th-semester students must complete their online resume profile and verify CGPA data prior to the technical screening round.',
    date: '25 Sep · T&P Cell',
    author: 'Training & Placement Office',
  },
  {
    id: 5,
    tag: 'Administration',
    tagColor: 'bg-purple-500/10 text-purple-700 border-purple-500/25',
    title: 'Updated hostel leave pass workflow on UDMS',
    desc: 'All weekend out-of-campus and night permissions must now be initiated through the digital parent-approval workflow.',
    date: '22 Sep · Warden Office',
    author: 'Chief Warden',
  },
];

const DEFAULT_EVENTS: UniversityEventItem[] = [
  {
    id: 'evt_1',
    date: 'Dec 05, 2026',
    month: 'Dec',
    day: '05',
    title: 'Spring semester course enrollment & academic advisory',
    category: 'Academic',
    time: 'Friday, Dec 5 · All day',
    location: 'Main Auditorium & Faculty Mentors',
    isOnline: false,
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'evt_2',
    date: 'Jan 12, 2026',
    month: 'Jan',
    day: '12',
    title: 'Orientation & commencement of Spring classes',
    category: 'Commencement',
    time: 'Monday, Jan 12 · 09:30 AM',
    location: 'Campus Academic Blocks',
    isOnline: false,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'evt_3',
    date: 'Jan 20, 2026',
    month: 'Jan',
    day: '20',
    title: 'AI in healthcare & ethics faculty symposium',
    category: 'Research',
    time: 'Wednesday, Jan 20 · 02:00 PM',
    location: 'Virtual Classroom (MS Teams)',
    isOnline: true,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'evt_4',
    date: 'Feb 14, 2026',
    month: 'Feb',
    day: '14',
    title: 'DYPIU Annual Cultural & Tech Fest - Tarang 2026',
    category: 'Cultural',
    time: 'Saturday, Feb 14 · 10:00 AM onwards',
    location: 'University Sports Grounds',
    isOnline: false,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=160&auto=format&fit=crop&q=80',
  },
];

interface NoticeBoardAndEventsSectionProps {
  notices?: NoticeItem[];
  events?: UniversityEventItem[];
  onViewAllNotices?: () => void;
  onViewAllEvents?: () => void;
}

export const NoticeBoardAndEventsSection: React.FC<NoticeBoardAndEventsSectionProps> = ({
  notices: propNotices,
  events: propEvents,
  onViewAllNotices,
  onViewAllEvents,
}) => {
  const noticesList = propNotices && propNotices.length > 0 ? propNotices : DEFAULT_NOTICES;
  const eventsList = propEvents && propEvents.length > 0 ? propEvents : DEFAULT_EVENTS;

  // Show only top 3 as requested
  const topNotices = noticesList.slice(0, 3);
  const topEvents = eventsList.slice(0, 3);

  // Modal / Drawer state for "Show all" / "View all"
  const [showAllNoticesModal, setShowAllNoticesModal] = useState(false);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  const handleOpenNoticeModal = (notice: NoticeItem) => {
    setSelectedNotice(notice);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-stretch">
        
        {/* ========================================================= */}
        {/* SECTION 2: NOTICE BOARD (TOP 3 RECENT + VIEW ALL)         */}
        {/* ========================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0E0F8C]/10 border border-[#0E0F8C]/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#0E0F8C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <line x1="8" y1="2" x2="8" y2="4" />
                    <line x1="16" y1="2" x2="16" y2="4" />
                    <line x1="7" y1="9" x2="17" y2="9" />
                    <line x1="7" y1="13" x2="13" y2="13" />
                  </svg>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#0E0F8C] tracking-tight">
                  Notice Board
                </h2>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Top 3 of {noticesList.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onViewAllNotices) onViewAllNotices();
                  else setShowAllNoticesModal(true);
                }}
                className="text-xs font-semibold text-[#00AFEF] hover:text-[#0E0F8C] inline-flex items-center gap-1 transition-colors cursor-pointer group"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Top 3 Notices List */}
            <div className="space-y-3">
              {topNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => handleOpenNoticeModal(notice)}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-[#00AFEF]/50 hover:shadow-sm transition-all duration-150 cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        notice.tagColor || 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {notice.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {notice.date}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0E0F8C] transition-colors leading-snug line-clamp-1">
                    {notice.title}
                  </h3>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {notice.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Official circulars & administrative notifications</span>
            <button
              onClick={() => setShowAllNoticesModal(true)}
              className="text-[#00AFEF] hover:underline font-medium text-[11px]"
            >
              Browse all {noticesList.length} notices
            </button>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: UPCOMING EVENTS (TOP 3 RECENT + SHOW ALL)      */}
        {/* ========================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FAA831]/15 border border-[#FAA831]/25 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#D97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#0E0F8C] tracking-tight">
                  Upcoming Events
                </h2>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Top 3 of {eventsList.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onViewAllEvents) onViewAllEvents();
                  else setShowAllEventsModal(true);
                }}
                className="text-xs font-semibold text-[#00AFEF] hover:text-[#0E0F8C] inline-flex items-center gap-1 transition-colors cursor-pointer group"
              >
                <span>Show all</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Top 3 Events List */}
            <div className="space-y-3">
              {topEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-[#FAA831]/50 hover:shadow-sm transition-all duration-150 flex items-center gap-3.5 group cursor-pointer"
                >
                  {/* Date badge */}
                  <div className="w-13 h-13 rounded-xl bg-[#0E0F8C] text-white flex flex-col items-center justify-center shrink-0 shadow-2xs group-hover:scale-103 transition-transform">
                    <span className="text-[9px] font-bold text-[#73d7ff] uppercase tracking-wider leading-none">
                      {evt.month}
                    </span>
                    <span className="text-base font-extrabold leading-tight text-white mt-0.5">
                      {evt.day}
                    </span>
                  </div>

                  {/* Event Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.2 rounded-md">
                        {evt.category}
                      </span>
                      {evt.isOnline && (
                        <span className="text-[9px] font-semibold text-[#00AFEF] bg-sky-50 px-1.5 py-0.2 rounded">
                          Online
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0E0F8C] transition-colors leading-snug truncate">
                      {evt.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium truncate">
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{evt.time}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Academic deadlines, guest talks & campus programs</span>
            <button
              onClick={() => setShowAllEventsModal(true)}
              className="text-[#00AFEF] hover:underline font-medium text-[11px]"
            >
              Calendar schedule ({eventsList.length})
            </button>
          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* MODAL: SINGLE NOTICE PREVIEW DETAIL                       */}
      {/* ========================================================= */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${selectedNotice.tagColor || 'bg-blue-50 text-blue-700'}`}>
                  {selectedNotice.tag}
                </span>
                <span className="text-xs text-slate-400">{selectedNotice.date}</span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#0E0F8C] leading-snug">
                {selectedNotice.title}
              </h3>
              {selectedNotice.author && (
                <p className="text-xs text-slate-500 mt-1">Issued by: {selectedNotice.author}</p>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-56 overflow-y-auto">
              {selectedNotice.desc}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ALL NOTICES EXPLORER                               */}
      {/* ========================================================= */}
      {showAllNoticesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0E0F8C]/10 border border-[#0E0F8C]/15 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#0E0F8C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <line x1="8" y1="2" x2="8" y2="4" />
                    <line x1="16" y1="2" x2="16" y2="4" />
                    <line x1="7" y1="9" x2="17" y2="9" />
                    <line x1="7" y1="13" x2="13" y2="13" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0E0F8C]">
                    All University Notices ({noticesList.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comprehensive listing of all official academic and administrative releases
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAllNoticesModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {noticesList.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => {
                    setShowAllNoticesModal(false);
                    setSelectedNotice(notice);
                  }}
                  className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[#00AFEF] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${notice.tagColor || 'bg-blue-50 text-blue-700'}`}>
                      {notice.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {notice.date}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                    {notice.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {notice.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowAllNoticesModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-[#0E0F8C] hover:bg-[#070868] text-white rounded-xl shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ALL EVENTS EXPLORER                                */}
      {/* ========================================================= */}
      {showAllEventsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FAA831]/15 border border-[#FAA831]/25 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#D97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0E0F8C]">
                    All Upcoming Campus Events ({eventsList.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Full calendar schedule for academic, cultural, and sports events
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAllEventsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {eventsList.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/50 flex items-center gap-3.5 hover:bg-white hover:border-[#FAA831] transition-all"
                >
                  <div className="w-13 h-13 rounded-xl bg-[#0E0F8C] text-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-[#73d7ff] uppercase">
                      {evt.month}
                    </span>
                    <span className="text-base font-extrabold leading-tight text-white mt-0.5">
                      {evt.day}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.2 rounded-md">
                      {evt.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1 truncate">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{evt.time}</span>
                      <span>·</span>
                      <span>{evt.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowAllEventsModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-[#0E0F8C] hover:bg-[#070868] text-white rounded-xl shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
