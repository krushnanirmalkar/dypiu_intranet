import React, { useState } from 'react';
import {
  GraduationCap,
  FileText,
  BookOpen,
  ShieldCheck,
  Calendar,
  Headphones,
  UserCheck,
  Layout,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { BottomRightCornerSwoosh } from './DecorativeShapes';

export const MainSection = (/** @type {any} */ {
  notices: propNotices,
  events: propEvents,
  contacts: propContacts,
  onViewAllNotices,
  onViewAllEvents,
  onOpenDirectory
} = {}) => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const contactsList = propContacts || [
    {
      id: 1,
      name: 'Dr. Ananya Sharma',
      role: 'Dean Academics',
      ext: 'Ext: 1002 · dean@dypiu.ac.in',
      tag: 'ACADEMICS',
      tagColor: 'bg-[#00afef]/10 text-[#00afef] border-[#00afef]/20',
      avatar: '/images/avatars/ananya-sharma.jpg',
    },
    {
      id: 2,
      name: 'Prof. Rahul Deshmukh',
      role: 'CSE Department Faculty',
      ext: 'Ext: 1005 · cse@dypiu.ac.in',
      tag: 'FACULTY',
      tagColor: 'bg-[#1bb470]/10 text-[#1bb470] border-[#1bb470]/20',
      avatar: '/images/avatars/rahul-deshmukh.jpg',
    },
    {
      id: 3,
      name: 'Ms. Priya Nair',
      role: 'Registrar & Transcripts Office',
      ext: 'Ext: 1003 · registrar@dypiu.ac.in',
      tag: 'REGISTRAR',
      tagColor: 'bg-[#faa831]/10 text-[#faa831] border-[#faa831]/20',
      avatar: '/images/avatars/priya-nair.jpg',
    },
    {
      id: 4,
      name: 'Dr. Vikram Patil',
      role: 'Research & Innovation Cell',
      ext: 'Ext: 1008 · research@dypiu.ac.in',
      tag: 'RESEARCH',
      tagColor: 'bg-[#f16136]/10 text-[#f16136] border-[#f16136]/20',
      avatar: '/images/avatars/vikram-patil.jpg',
    },
    {
      id: 5,
      name: 'Prof. Sneha Kulkarni',
      role: 'Student Welfare & Hostel Cell',
      ext: 'Ext: 1010 · welfare@dypiu.ac.in',
      tag: 'WELFARE',
      tagColor: 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20',
      avatar: '/images/avatars/sneha-kulkarni.jpg',
    },
  ];

  const defaultNoticesList = [
    {
      id: 1,
      tag: 'EXAMS',
      tagColor: 'bg-[#f16136]/10 text-[#f16136] border-[#f16136]/20',
      title: 'End-Semester Examination Schedule Released',
      desc: 'Official timetable for B.Tech CSE, ECE & BCA courses is now available for download.',
      date: 'Today · Academic Cell',
    },
    {
      id: 2,
      tag: 'EVENT',
      tagColor: 'bg-[#00afef]/10 text-[#00afef] border-[#00afef]/20',
      title: 'InnovateX 2026 Hackathon Registrations Open',
      desc: 'Register your 4-member team for the 24-hour annual university hackathon.',
      date: 'Yesterday · Student Council',
    },
    {
      id: 3,
      tag: 'CAMPUS',
      tagColor: 'bg-[#1bb470]/10 text-[#1bb470] border-[#1bb470]/20',
      title: 'Central Library Open Till 2:00 AM',
      desc: 'Night study hours activated across all reading halls for mid-term preparations.',
      date: '28 Sep · Library Admin',
    },
    {
      id: 4,
      tag: 'CAREER',
      tagColor: 'bg-[#faa831]/10 text-[#faa831] border-[#faa831]/20',
      title: 'AWS & TCS Placement Drive Announced',
      desc: 'Pre-placement talk and online assessment scheduled for final year students.',
      date: '26 Sep · T&P Cell',
    }
  ];

  const tagColorMap = {
    Academic: 'bg-[#00afef]/10 text-[#00afef] border-[#00afef]/20',
    Administrative: 'bg-[#faa831]/10 text-[#faa831] border-[#faa831]/20',
    Campus: 'bg-[#1bb470]/10 text-[#1bb470] border-[#1bb470]/20',
    Urgent: 'bg-[#f16136]/10 text-[#f16136] border-[#f16136]/20',
    EXAMS: 'bg-[#f16136]/10 text-[#f16136] border-[#f16136]/20',
    EVENT: 'bg-[#00afef]/10 text-[#00afef] border-[#00afef]/20',
    CAMPUS: 'bg-[#1bb470]/10 text-[#1bb470] border-[#1bb470]/20',
    CAREER: 'bg-[#faa831]/10 text-[#faa831] border-[#faa831]/20',
  };

  const noticesList = (propNotices && propNotices.length > 0)
    ? propNotices.slice(0, 4).map((notice, idx) => {
        const category = notice.category || 'Academic';
        const tag = category.toUpperCase();
        const tagColor = tagColorMap[category] || tagColorMap[tag] || 'bg-[#00afef]/10 text-[#00afef] border-[#00afef]/20';
        return {
          id: notice.id || idx,
          tag,
          tagColor,
          title: notice.title,
          desc: notice.content || notice.description || '',
          date: notice.publishAt
            ? new Date(notice.publishAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · Academic Cell'
            : 'Recent · Academic Cell'
        };
      })
    : defaultNoticesList;

  const eventsList = [
    {
      id: 1,
      month: 'DEC',
      day: '5',
      title: 'Spring Semester Registration Deadline',
      time: 'Fri, Dec 5, All day',
      image: '/images/events/event-1.jpg',
    },
    {
      id: 2,
      month: 'JAN',
      day: '12',
      title: 'First Day of Classes',
      time: 'Mon, Jan 12, All day',
      image: '/images/events/event-2.jpg',
    },
    {
      id: 3,
      month: 'FEB',
      day: '18',
      title: 'Faculty Workshop on AI in Education',
      time: 'Wed, Feb 18, 10:00 AM',
      image: '/images/events/event-3.jpg',
    },
    {
      id: 4,
      month: 'APR',
      day: '14',
      title: 'Staff Wellness Day',
      time: 'Tue, Apr 14, 8:00 AM',
      image: '/images/events/event-4.jpg',
    },
    {
      id: 5,
      month: 'MAY',
      day: '20',
      title: 'Annual Campus Sports Meet 2026',
      time: 'Wed, May 20, 9:00 AM',
      image: '/images/events/event-5.jpg',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch select-none">
      {/* COLUMN 1: Communication Channel */}
      <div className="relative lg:col-span-4 bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between overflow-hidden">
        {/* Decorative corner swoosh */}
        <BottomRightCornerSwoosh className="w-16 h-12 z-0" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-[#393678] tracking-tight">
              Communication Channel
            </h2>
            <a
              href="#directory"
              onClick={(e) => {
                if (onOpenDirectory) {
                  e.preventDefault();
                  onOpenDirectory();
                }
              }}
              className="text-xs font-bold text-[#00afef] hover:underline cursor-pointer"
            >
              Directory
            </a>
          </div>

          <div className="space-y-2.5">
            {contactsList.map((contact) => {
              return (
                <div
                  key={contact.id}
                  className="p-2.5 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-100/70 hover:border-[#00afef]/40 transition-all cursor-pointer group flex items-center gap-3"
                >
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200/80 shadow-2xs group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors truncate">
                        {contact.name}
                      </h3>
                      <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded border shrink-0 ${contact.tagColor}`}>
                        {contact.tag}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                      {contact.role}
                    </p>
                    <p className="text-[9.5px] text-[#00afef] font-semibold mt-0.5 truncate">
                      {contact.ext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* COLUMN 2: Notice Board */}
      <div className="relative lg:col-span-4 bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between overflow-hidden">
        {/* Decorative corner swoosh */}
        <BottomRightCornerSwoosh className="w-16 h-12 z-0" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-[#393678] tracking-tight">
              Notice Board
            </h2>
            <a
              href="#notices"
              onClick={(e) => {
                if (onViewAllNotices) {
                  e.preventDefault();
                  onViewAllNotices();
                }
              }}
              className="text-xs font-bold text-[#00afef] hover:underline cursor-pointer"
            >
              View all
            </a>
          </div>

          <div className="space-y-2.5">
            {noticesList.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-100/70 hover:border-[#00afef]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${notice.tagColor}`}>
                    {notice.tag}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {notice.date}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors mt-1.5 leading-snug">
                  {notice.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight line-clamp-2">
                  {notice.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COLUMN 3: Events */}
      <div className="relative lg:col-span-4 bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between overflow-hidden">
        {/* Decorative corner swoosh */}
        <BottomRightCornerSwoosh className="w-16 h-12 z-0" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-[#393678] tracking-tight">
                Events
              </h2>
              <a
                href="#events"
                onClick={(e) => {
                  if (onViewAllEvents) {
                    e.preventDefault();
                    onViewAllEvents();
                  }
                }}
                className="text-xs font-bold text-[#f16136] hover:underline cursor-pointer"
              >
                See all
              </a>
            </div>

            {/* Events List */}
            <div className="divide-y divide-slate-100">
              {eventsList.map((event) => (
                <div
                  key={event.id}
                  className="py-2.5 flex items-center gap-3 hover:bg-slate-50/80 p-1.5 rounded-xl transition-colors cursor-pointer group"
                >
                  {/* Date thumbnail box */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-2xs group-hover:scale-103 transition-transform border border-slate-200/80">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Translucent overlay keeping image clear */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/20 flex flex-col items-center justify-center text-white">
                      <span className="text-[8px] font-extrabold uppercase tracking-wider text-white drop-shadow-xs">
                        {event.month}
                      </span>
                      <span className="text-sm font-extrabold leading-none mt-0.5 text-white drop-shadow-xs">
                        {event.day}
                      </span>
                    </div>
                  </div>

                  {/* Event text details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors leading-snug line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Pagination Controls */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs font-semibold text-slate-400">
            <button className="flex items-center gap-1 hover:text-[#393678] transition-colors cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button className="flex items-center gap-1 hover:text-[#393678] transition-colors cursor-pointer">
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notice Detail Modal Popup */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs select-none">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider border ${selectedNotice.tagColor || 'bg-[#393678]/10 text-[#393678] border-[#393678]/25'}`}>
                  {selectedNotice.tag || 'Notice'}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {selectedNotice.date || 'Recent'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Title & Issuer */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-[#393678] font-serif-custom leading-snug">
                {selectedNotice.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Official University Notice Board
              </p>
            </div>

            {/* Content Body */}
            <div className="rounded-2xl bg-[#F8F9FC] border border-slate-200/80 p-4 text-xs sm:text-sm font-medium leading-relaxed text-slate-700 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedNotice.desc || selectedNotice.content}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedNotice(null);
                  onViewAllNotices?.();
                }}
                className="text-xs font-bold text-[#00afef] hover:text-[#002B5C] transition-colors cursor-pointer"
              >
                View all notices &rarr;
              </button>

              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
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
