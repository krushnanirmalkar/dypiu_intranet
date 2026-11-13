import React, { useState } from 'react';
import { UniOneChatModal } from './UniOneChatModal';

export interface UniOneApp {
  id: string;
  name: string;
  desc: string;
  bg: string;
  textColor: string;
  descColor: string;
  barColor: string;
  iconBg: string;
  iconColor: string;
  arrowColor: string;
  url: string;
  iconSvg: React.ReactNode;
}

export interface UniOneNotice {
  id: string | number;
  tag: string;
  tagBg: string;
  tagColor: string;
  date: string;
  title: string;
  desc: string;
  isNew?: boolean;
}

export interface UniOneEvent {
  id: string | number;
  title: string;
  dateLabel: string;
  organizer: string;
  organizerInitial: string;
  organizerColor: string;
  liveNow?: boolean;
  upcoming?: boolean;
  posterImg?: string;
  month?: string;
  day?: string;
  accentBg?: string;
  accentBar1?: string;
  accentBar2?: string;
}

// Exact updated vibrant apps cards from source of truth
export const SAMPLE_APPS: UniOneApp[] = [
  {
    id: 'juno',
    name: 'Juno ERP Engine',
    desc: 'Academic records and everyday university workflows',
    bg: '#0074B8',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,.92)',
    barColor: 'rgba(255,255,255,.16)',
    iconBg: 'rgba(255,255,255,.22)',
    iconColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    url: 'https://erp.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
        <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
        <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
        <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
      </svg>
    )
  },
  {
    id: 'unisync',
    name: 'UniSync Suite',
    desc: 'University communication and collaboration',
    bg: '#FDB515',
    textColor: '#0B2559',
    descColor: '#3A2E0F',
    barColor: 'rgba(11,37,89,.12)',
    iconBg: '#0B2559',
    iconColor: '#FDB515',
    arrowColor: '#0B2559',
    url: 'https://teams.microsoft.com',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  },
  {
    id: 'udms',
    name: 'Digital Documents',
    desc: 'Your secure digital document repository',
    bg: '#C2410C',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,.92)',
    barColor: 'rgba(255,255,255,.16)',
    iconBg: 'rgba(255,255,255,.22)',
    iconColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    url: 'https://udms.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 3h7l5 5v13H7z"></path>
        <path d="M14 3v5h5"></path>
        <path d="M10 13h6M10 17h6"></path>
      </svg>
    )
  },
  {
    id: 'library',
    name: 'Library',
    desc: 'Books, journals and e-resources',
    bg: '#1F7A33',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,.92)',
    barColor: 'rgba(255,255,255,.16)',
    iconBg: 'rgba(255,255,255,.22)',
    iconColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    url: 'https://library.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
        <path d="M6 6h10M6 10h10"></path>
      </svg>
    )
  },
  {
    id: 'exams',
    name: 'Exams and Results',
    desc: 'Schedules, hall tickets and marks',
    bg: '#0B2559',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,.92)',
    barColor: 'rgba(255,255,255,.16)',
    iconBg: 'rgba(255,255,255,.22)',
    iconColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    url: 'https://exams.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 11l3 3L22 4"></path>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
      </svg>
    )
  },
  {
    id: 'fees',
    name: 'Fees and Payments',
    desc: 'Dues, receipts and scholarships',
    bg: '#0AA0E6',
    textColor: '#0B2559',
    descColor: '#083B5E',
    barColor: 'rgba(11,37,89,.12)',
    iconBg: '#0B2559',
    iconColor: '#0AA0E6',
    arrowColor: '#0B2559',
    url: 'https://payments.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
        <line x1="2" y1="10" x2="22" y2="10"></line>
      </svg>
    )
  },
  {
    id: 'timetable',
    name: 'Timetable',
    desc: 'Your daily schedule and attendance',
    bg: '#FFE08A',
    textColor: '#0B2559',
    descColor: '#3A2E0F',
    barColor: 'rgba(11,37,89,.12)',
    iconBg: '#0B2559',
    iconColor: '#FDB515',
    arrowColor: '#0B2559',
    url: 'https://timetable.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    )
  },
  {
    id: 'placements',
    name: 'Placements',
    desc: 'Drives, openings and career help',
    bg: '#BFE3F7',
    textColor: '#0B2559',
    descColor: '#083B5E',
    barColor: 'rgba(11,37,89,.12)',
    iconBg: '#0B2559',
    iconColor: '#0AA0E6',
    arrowColor: '#0B2559',
    url: 'https://placements.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    )
  }
];

export const SAMPLE_NOTICES: UniOneNotice[] = [
  {
    id: 1,
    tag: 'Academic',
    tagBg: '#E3F1FB',
    tagColor: '#0B5E94',
    date: 'Oct 18 · Academic Cell',
    title: 'Test notice',
    desc: 'This is a test notice.',
    isNew: true
  },
  {
    id: 2,
    tag: 'Academic',
    tagBg: '#E3F1FB',
    tagColor: '#0B5E94',
    date: 'Sep 21 · Academic Cell',
    title: 'End semester exam schedule released for Spring 2026',
    desc: 'The official datesheet for the May 2026 end-semester examinations has been published. Students should check their respective schedules.'
  },
  {
    id: 3,
    tag: 'Welfare',
    tagBg: '#FFEBDD',
    tagColor: '#9A3F00',
    date: 'Sep 12 · Student Welfare Cell',
    title: 'Hostel mess timings during exam week',
    desc: 'The mess will open an hour earlier through exam week. Check with the welfare cell for the full timings.'
  },
  {
    id: 4,
    tag: 'Placement',
    tagBg: '#E3F1FB',
    tagColor: '#0B5E94',
    date: 'Sep 05 · T&P Cell',
    title: 'AWS and TCS placement drives registration',
    desc: 'Pre-placement talk and eligibility criteria for final year engineering students.'
  }
];

export const SAMPLE_EVENTS: UniOneEvent[] = [
  {
    id: 'ev1',
    title: 'Youth Vision: Art for Social Change 2026',
    dateLabel: 'Register by 30 Nov 2026',
    organizer: 'Yin Kala',
    organizerInitial: 'Y',
    organizerColor: '#F5A100',
    liveNow: true,
    posterImg: '/event-poster-youth-vision.png'
  },
  {
    id: 'ev2',
    title: 'Spring Semester Registration Deadline',
    dateLabel: '5 Dec · All day',
    organizer: 'Academic Cell',
    organizerInitial: 'A',
    organizerColor: '#0AA0E6',
    upcoming: true,
    month: 'Dec',
    day: '5',
    accentBg: '#0B2559',
    accentBar1: '#FDB515',
    accentBar2: '#0AA0E6'
  },
  {
    id: 'ev3',
    title: 'First Day of Classes',
    dateLabel: '12 Jan · All day',
    organizer: 'Academic Cell',
    organizerInitial: 'A',
    organizerColor: '#0AA0E6',
    upcoming: true,
    month: 'Jan',
    day: '12',
    accentBg: '#0074B8',
    accentBar1: '#FDB515',
    accentBar2: '#0B2559'
  },
  {
    id: 'ev4',
    title: 'Faculty AI in Pedagogy Workshop',
    dateLabel: '18 Feb · 10:00 am',
    organizer: 'Dean Academics',
    organizerInitial: 'D',
    organizerColor: '#23803A',
    upcoming: true,
    month: 'Feb',
    day: '18',
    accentBg: '#0B2559',
    accentBar1: '#FFE08A',
    accentBar2: '#0074B8'
  }
];

interface UniOneDashboardPageProps {
  user?: {
    name?: string;
    role?: string;
    roleTitle?: string;
  };
  onNavigate?: (page: string) => void;
  showBirthdayProp?: boolean;
}

export const UniOneDashboardPage: React.FC<UniOneDashboardPageProps> = ({
  user,
  onNavigate,
  showBirthdayProp = true
}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [wished, setWished] = useState(false);
  const [showBirthday, setShowBirthday] = useState(showBirthdayProp);
  const [allNoticesOpen, setAllNoticesOpen] = useState(false);
  const [allEventsOpen, setAllEventsOpen] = useState(false);

  const rawFirstName = user?.name ? user.name.trim().split(/\s+/)[0] : 'Krushna';
  const displayName = rawFirstName
    ? rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1).toLowerCase()
    : 'Krushna';
  const roleName = user?.roleTitle || (user?.role === 'staff' ? 'Faculty' : user?.role === 'admin' ? 'Administrator' : 'Student');
  const userInitial = displayName.charAt(0).toUpperCase() || 'K';

  const dateLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const topNotices = SAMPLE_NOTICES.slice(0, 3);
  const topEvents = SAMPLE_EVENTS.slice(0, 3);
  const totalUnreadCount = 6;

  return (
    <div
      className="page-root font-nunito"
      style={{
        background: '#F3F6FB',
        color: '#14213D',
        fontFamily: "'Nunito', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        minHeight: '100%',
        width: '100%',
        position: 'relative'
      }}
    >
      
      {/* ─── Header ─── */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E3E9F3', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="header-inner" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* University Branding & UniOne Word Art */}
          <div className="hdr-branding" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/dypiu-official-logo.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/dypiu-logo-unione.png';
              }}
              alt="D Y Patil International University"
              className="hdr-logo"
              style={{ width: 'auto', display: 'block', objectFit: 'contain', cursor: 'pointer' }}
              onClick={() => onNavigate?.('dashboard')}
            />

            <span className="hide-xs" aria-hidden="true" style={{ width: '1px', height: '36px', background: '#D5DEEC', display: 'inline-block' }}></span>

            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate?.('dashboard'); }}
              aria-label="UniOne home"
              className="unione-wordmark"
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 'clamp(28px, 4vw, 38px)',
                lineHeight: 1,
                letterSpacing: '-0.5px',
                color: '#0B2559',
                cursor: 'pointer'
              }}
            >
              <span aria-hidden="true">U</span>
              <span aria-hidden="true" style={{ color: '#0B2559' }}>n</span>
              <span
                aria-hidden="true"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '7.5px',
                  height: '21px',
                  margin: '0 3px 0 2px',
                  borderRadius: '3.5px',
                  background: '#0B2559',
                  verticalAlign: 'baseline'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '-12px',
                    width: '7.5px',
                    height: '7.5px',
                    borderRadius: '50%',
                    background: '#FDB515'
                  }}
                ></span>
              </span>
              <svg
                aria-hidden="true"
                width="30"
                height="30"
                viewBox="0 0 32 32"
                style={{ verticalAlign: '-4px', margin: '0 2px' }}
              >
                <circle cx="16" cy="16" r="12" fill="none" stroke="#0AA0E6" strokeWidth="6.5"></circle>
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  fill="none"
                  stroke="#FDB515"
                  strokeWidth="6.5"
                  strokeDasharray="30 75.4"
                  transform="rotate(-70 16 16)"
                ></circle>
              </svg>
              <span aria-hidden="true" style={{ color: '#0074B8' }}>ne</span>
            </a>
          </div>

          {/* Header Action Buttons */}
          <div className="hdr-actions" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setChatOpen(true)}
              aria-label="Open messages"
              className="hdr-action-btn"
              style={{
                height: '42px',
                padding: '0 16px',
                border: 0,
                borderRadius: '999px',
                background: '#0074B8',
                color: '#fff',
                fontFamily: 'inherit',
                fontWeight: 800,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z"></path>
              </svg>
              <span className="hide-sm">Messages</span>
            </button>

            <button
              onClick={() => onNavigate?.('notifications')}
              aria-label="Notifications, 2 new"
              className="hdr-notif-btn"
              style={{
                position: 'relative',
                width: '42px',
                height: '42px',
                border: '1px solid #E3E9F3',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0B2559'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 17V11a6 6 0 1 1 12 0v6l1.5 2h-15z"></path>
                <path d="M10 21h4"></path>
              </svg>
              <span style={{ position: 'absolute', top: '-3px', right: '-3px', minWidth: '18px', height: '18px', borderRadius: '9px', background: '#D9531E', color: '#fff', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                2
              </span>
            </button>

            <div
              onClick={() => onNavigate?.('profile')}
              className="hdr-profile-pill"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 12px 3px 3px', border: '1px solid #E3E9F3', borderRadius: '999px', background: '#fff', cursor: 'pointer' }}
            >
              <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FDB515', color: '#0B2559', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {userInitial}
              </span>
              <span className="hide-sm" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontWeight: 800, fontSize: '14px' }}>{displayName}</span>
                <span style={{ fontSize: '12px', color: '#5B6785' }}>{roleName}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content (Fully scrollable) ─── */}
      <main className="dashboard-main" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        
        <div className="dashboard-columns" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch' }}>
          
          {/* Left Column (Hero Welcome + Updated Apps Grid + Events Panel) */}
          <div className="dashboard-left-col" style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. Hero Welcome Section */}
            <section className="hero-welcome-card" style={{ position: 'relative', overflow: 'hidden', background: '#0B2559', borderRadius: '28px', color: '#fff', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
              <div aria-hidden="true" style={{ position: 'absolute', right: '-30px', top: '-120px', width: '70px', height: '340px', background: '#FDB515', transform: 'rotate(35deg)' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', right: '-110px', top: '-120px', width: '90px', height: '340px', background: '#0AA0E6', transform: 'rotate(35deg)' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', left: '-60px', bottom: '-130px', width: '60px', height: '260px', background: '#0AA0E6', opacity: 0.35, transform: 'rotate(35deg)' }}></div>

              <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '800px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, color: '#BFE3F7' }}>{dateLabel}</p>
                <h1 style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.15 }}>
                  Welcome back, {displayName}
                </h1>
                <p style={{ margin: '12px 0 0', fontSize: '16px', lineHeight: 1.5, color: '#DCEBF7' }}>
                  Your apps, notices and campus buzz are all right here.
                </p>
              </div>
            </section>

            {/* 2. University Applications Grid (Updated Vibrant Colorful Cards with angled bars) */}
            <section aria-labelledby="apps-title" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px 14px' }}>
                <h2 id="apps-title" style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '28px', color: '#0B2559' }}>
                  Your apps
                </h2>
                <span style={{ fontSize: '15px', color: '#5B6785' }}>Everything you use at the university, one tap away</span>
              </div>

              <div className="apps-grid" style={{ display: 'grid' }}>
                {SAMPLE_APPS.map((app) => (
                  <a
                    key={app.id}
                    className="app-card"
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      padding: '20px',
                      position: 'relative',
                      overflow: 'hidden',
                      background: app.bg,
                      border: 0,
                      boxShadow: '0 8px 20px rgba(11,37,89,.16)',
                      borderRadius: '22px',
                      textDecoration: 'none',
                      color: app.textColor,
                      minHeight: '168px'
                    }}
                  >
                    {/* Diagonal translucent bars accent on card */}
                    <span aria-hidden="true" style={{ position: 'absolute', right: '-18px', bottom: '-70px', width: '44px', height: '200px', background: app.barColor, transform: 'rotate(35deg)' }}></span>
                    <span aria-hidden="true" style={{ position: 'absolute', right: '-70px', bottom: '-70px', width: '44px', height: '200px', background: app.barColor, transform: 'rotate(35deg)' }}></span>

                    <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ width: '54px', height: '54px', borderRadius: '16px', background: app.iconBg, color: app.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {app.iconSvg}
                      </span>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={app.arrowColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M7 17L17 7M9 7h8v8"></path>
                      </svg>
                    </span>

                    <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '19px', color: app.textColor }}>
                        {app.name}
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: 1.45, color: app.descColor }}>
                        {app.desc}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </section>

            {/* 3. Campus Events Section (Dark panel with poster cards) */}
            <section aria-labelledby="events-title" style={{ flex: 'none', minWidth: 0, overflow: 'hidden', background: '#14110C', color: '#fff', border: '2px solid #F5A100', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 14px 32px rgba(20,17,12,.35)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px 16px' }}>
                <div style={{ position: 'relative', flex: '0 0 52px', width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(245, 161, 0, 0.12)', border: '1.5px solid rgba(245, 161, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Clean generic calendar & event line-drawing icon */}
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A100" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2.5" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <circle cx="8" cy="15" r="1" fill="#F5A100" />
                    <circle cx="12" cy="15" r="1" fill="#F5A100" />
                    <circle cx="16" cy="15" r="1" fill="#F5A100" />
                  </svg>
                </div>
                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <h2 id="events-title" style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '28px', color: '#fff' }}>
                    Campus events
                  </h2>
                  <p style={{ margin: '2px 0 0', fontSize: '14px', color: '#CFC8BB' }}>Happening on and around campus</p>
                </div>
                <button
                  onClick={() => setAllEventsOpen(true)}
                  style={{
                    height: '46px',
                    padding: '0 22px',
                    borderRadius: '999px',
                    background: '#F5A100',
                    color: '#14110C',
                    fontWeight: 800,
                    fontSize: '15px',
                    border: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  See all events
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </button>
              </div>

              {/* Event Cards Grid */}
              <div className="events-grid" style={{ display: 'grid' }}>
                {topEvents.map((evt) => {
                  return (
                    <div
                      key={evt.id}
                      className="ev-card"
                      style={{ display: 'flex', flexDirection: 'column', gap: '10px', textDecoration: 'none', color: '#fff', minWidth: 0, cursor: 'pointer' }}
                    >
                      {evt.posterImg ? (
                        <span style={{ position: 'relative', display: 'block', aspectRatio: '16/10', borderRadius: '16px', overflow: 'hidden', background: '#F6F1E4' }}>
                          <img src={evt.posterImg} alt={`Poster for ${evt.title}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          {evt.liveNow && (
                            <span style={{ position: 'absolute', top: '10px', left: '10px', padding: '5px 12px', borderRadius: '999px', background: 'rgba(20,17,12,.88)', color: '#fff', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '7px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5A4F' }}></span>
                              Live now
                            </span>
                          )}
                        </span>
                      ) : (
                        <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', aspectRatio: '16/10', borderRadius: '16px', overflow: 'hidden', background: evt.accentBg || '#0B2559', lineHeight: 1 }}>
                          <span aria-hidden="true" style={{ position: 'absolute', right: '-30px', top: '-70px', width: '44px', height: '220px', background: evt.accentBar1 || '#FDB515', transform: 'rotate(35deg)' }}></span>
                          <span aria-hidden="true" style={{ position: 'absolute', right: '-85px', top: '-70px', width: '56px', height: '220px', background: evt.accentBar2 || '#0AA0E6', transform: 'rotate(35deg)' }}></span>
                          <span style={{ position: 'relative', fontSize: '16px', fontWeight: 800, color: evt.month === 'Jan' ? '#FFE08A' : '#FDB515' }}>{evt.month}</span>
                          <span style={{ position: 'relative', marginTop: '4px', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '64px', color: '#fff' }}>{evt.day}</span>
                          <span style={{ position: 'absolute', top: '10px', left: '10px', padding: '5px 12px', borderRadius: '999px', background: '#F5A100', color: '#14110C', fontSize: '13px', fontWeight: 800 }}>Upcoming</span>
                        </span>
                      )}

                      <span className="ev-title" style={{ fontSize: '17px', fontWeight: 800, lineHeight: 1.3 }}>
                        {evt.title}
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#F5A100' }}>
                        {evt.dateLabel}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#CFC8BB' }}>
                        <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: evt.organizerColor, color: '#14110C', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {evt.organizerInitial}
                        </span>
                        {evt.organizer}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* Right Column (Notice Board + Birthday Celebration Card) */}
          <div className="dashboard-right-col" style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            
            {/* 4. Notice Board (Top 3 recent notices + View all) */}
            <section aria-labelledby="notice-title" className="notice-board-card" style={{ flex: 'none', minWidth: 0, overflow: 'hidden', background: '#fff', border: '2px solid #0B2559', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 14px 32px rgba(11,37,89,.16)' }}>
              
              <div className="notice-board-hdr" style={{ background: '#0B2559', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: '0 0 52px', width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.1)', border: '1.5px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Clean generic notice board line-drawing icon */}
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FDB515" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {/* Board outline */}
                    <rect x="3" y="4" width="18" height="16" rx="2.5" />
                    {/* Top hanging wire / hanger */}
                    <path d="M8 4l4-2.5 4 2.5" />
                    {/* Pinned note sheet */}
                    <rect x="6.5" y="8" width="11" height="8.5" rx="1" strokeDasharray="none" />
                    {/* Note pin dot */}
                    <circle cx="12" cy="7" r="1" fill="#FDB515" />
                    {/* Note text lines */}
                    <line x1="8.5" y1="11" x2="15.5" y2="11" />
                    <line x1="8.5" y1="13.5" x2="13.5" y2="13.5" />
                  </svg>
                </div>
                <h2 id="notice-title" style={{ margin: 0, flex: 1, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '28px', color: '#fff' }}>
                  Notice board
                </h2>
                <span style={{ padding: '5px 14px', borderRadius: '999px', background: '#FDB515', color: '#0B2559', fontSize: '14px', fontWeight: 800 }}>
                  Latest 3
                </span>
              </div>

              {topNotices.map((notice) => {
                const isHighlight = notice.isNew;
                return (
                  <article
                    key={notice.id}
                    className="row-item"
                    style={{
                      padding: isHighlight ? '20px' : '16px',
                      border: isHighlight ? '2px solid #F2B418' : '1px solid #E3E9F3',
                      background: isHighlight ? '#FFF4D1' : '#FFFFFF',
                      borderRadius: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: isHighlight ? '10px' : '8px',
                      boxShadow: isHighlight ? '0 6px 16px rgba(253,181,21,.3)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                      {notice.isNew && (
                        <span style={{ padding: '3px 10px', borderRadius: '999px', background: '#FDB515', color: '#0B2559', fontSize: '13px', fontWeight: 800 }}>
                          New
                        </span>
                      )}
                      <span style={{ padding: '3px 10px', borderRadius: '999px', background: notice.tagBg, color: notice.tagColor, fontSize: '13px', fontWeight: 800 }}>
                        {notice.tag}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#5B6785' }}>
                        {notice.date}
                      </span>
                    </div>

                    <h3 style={{
                      margin: 0,
                      fontFamily: isHighlight ? "'Fredoka', sans-serif" : "'Nunito', system-ui, sans-serif",
                      fontWeight: isHighlight ? 600 : 800,
                      fontSize: isHighlight ? '22px' : '17px',
                      color: '#0B2559'
                    }}>
                      {notice.title}
                    </h3>
                    <p className="clamp2" style={{
                      margin: 0,
                      fontFamily: "'Nunito', system-ui, sans-serif",
                      fontSize: isHighlight ? '16px' : '15px',
                      lineHeight: 1.5,
                      color: isHighlight ? '#3A2E0F' : '#46526F'
                    }}>
                      {notice.desc}
                    </p>
                  </article>
                );
              })}

              <button
                onClick={() => setAllNoticesOpen(true)}
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  height: '50px',
                  border: 0,
                  borderRadius: '999px',
                  background: '#0074B8',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                View all notices
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </button>
            </section>

            {/* 5. Birthday Celebration Section */}
            <section aria-labelledby="bday-title" className="bday-card" style={{ position: 'relative', overflow: 'hidden', flex: '1 1 auto', minWidth: 0, background: '#FFF4D1', border: '1px solid #F8DA85', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '10px' }}>
              
              {/* Confetti Elements */}
              <div aria-hidden="true" style={{ position: 'absolute', top: '18px', left: '22px', width: '12px', height: '12px', borderRadius: '50%', background: '#0AA0E6' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', top: '46px', left: '70px', width: '16px', height: '6px', borderRadius: '3px', background: '#D9531E', transform: 'rotate(30deg)' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', top: '20px', left: '46%', width: '10px', height: '10px', background: '#0B2559', transform: 'rotate(20deg)' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', top: '30px', right: '70px', width: '18px', height: '6px', borderRadius: '3px', background: '#23803A', transform: 'rotate(-35deg)' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', top: '18px', right: '24px', width: '12px', height: '12px', borderRadius: '50%', background: '#D9531E' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', top: '96px', right: '30px', width: '10px', height: '10px', background: '#0AA0E6', transform: 'rotate(45deg)' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', top: '110px', left: '26px', width: '16px', height: '6px', borderRadius: '3px', background: '#0B2559', transform: 'rotate(-25deg)' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', bottom: '24px', left: '30px', width: '12px', height: '12px', borderRadius: '50%', background: '#23803A' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', bottom: '40px', right: '34px', width: '16px', height: '6px', borderRadius: '3px', background: '#0AA0E6', transform: 'rotate(40deg)' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', bottom: '18px', right: '90px', width: '10px', height: '10px', background: '#D9531E', transform: 'rotate(15deg)' }}></div>

              {showBirthday ? (
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <p id="bday-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '15px', color: '#7A4B00' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="8" width="18" height="4" rx="1"></rect>
                      <path d="M5 12v8h14v-8M12 8v12M12 8c-2 0-4-1-4-3a2 2 0 0 1 4 0M12 8c2 0 4-1 4-3a2 2 0 0 0-4 0"></path>
                    </svg>
                    Today’s birthday
                  </p>

                  <div style={{ width: '92px', height: '92px', borderRadius: '50%', background: '#0B2559', color: '#fff', border: '5px solid #FDB515', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '40px' }}>
                    A
                  </div>

                  <h3 style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '26px', lineHeight: 1.15, color: '#0B2559' }}>
                    Happy birthday, Aarav!
                  </h3>
                  <p style={{ margin: 0, fontSize: '15px', color: '#5C4A1E' }}>
                    Computer Science · Year 3
                  </p>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.5, color: '#5C4A1E' }}>
                    A quick wish can make their whole day.
                  </p>

                  {!wished ? (
                    <button
                      onClick={() => setWished(true)}
                      style={{
                        marginTop: '6px',
                        height: '48px',
                        padding: '0 24px',
                        border: 0,
                        borderRadius: '999px',
                        background: '#0B2559',
                        color: '#fff',
                        fontFamily: 'inherit',
                        fontWeight: 800,
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"></path>
                      </svg>
                      Send a wish
                    </button>
                  ) : (
                    <p role="status" style={{ margin: '6px 0 0', padding: '12px 20px', borderRadius: '999px', background: '#fff', color: '#1B6B2F', fontWeight: 800, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12l5 5 9-10"></path>
                      </svg>
                      Wish sent. Aarav will love it!
                    </p>
                  )}

                  <button
                    onClick={() => setShowBirthday(false)}
                    style={{ marginTop: '8px', fontSize: '12px', color: '#7A4B00', background: 'transparent', border: 0, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Preview 'No candles today' state
                  </button>
                </div>
              ) : (
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#7A4B00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 21h16M5 21v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M5 17c2 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 5 0M12 13V9M12 9c-1 0-1.6-.8-1.6-1.6S12 5 12 5s1.6 1.6 1.6 2.4S13 9 12 9z"></path>
                  </svg>
                  <h3 id="bday-title" style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '24px', lineHeight: 1.15, color: '#0B2559' }}>
                    No candles today
                  </h3>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.5, color: '#5C4A1E' }}>
                    Nobody’s birthday today, so you pick the reason to celebrate. Finished an assignment? That counts.
                  </p>
                  <button
                    onClick={() => { setShowBirthday(true); setWished(false); }}
                    style={{ marginTop: '8px', fontSize: '12px', color: '#7A4B00', background: 'transparent', border: 0, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Preview birthday state
                  </button>
                </div>
              )}
            </section>

          </div>

        </div>

      </main>

      {/* ─── Footer ─── */}
      <footer style={{ background: '#0B2559', color: '#fff' }}>
        <div className="footer-inner" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '26px' }}>UniOne</span>
          <nav aria-label="Footer" className="footer-nav" style={{ display: 'flex', flexWrap: 'wrap' }}>
            <a href="#policies" onClick={(e) => { e.preventDefault(); onNavigate?.('documents'); }} style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>Uni policies</a>
            <a href="#grievance" onClick={(e) => { e.preventDefault(); onNavigate?.('support'); }} style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>Grievance</a>
            <a href="#help" onClick={(e) => { e.preventDefault(); onNavigate?.('support'); }} style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>Help and support</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate?.('support'); }} style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>Contact us</a>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate?.('privacy'); }} style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>Privacy policy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); onNavigate?.('terms'); }} style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>Terms of service</a>
          </nav>
          <span style={{ fontSize: '14px', color: '#BFE3F7' }}>Powered by Students @DYPIU</span>
        </div>
      </footer>

      {/* ─── Floating Messages Button ─── */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          aria-label="Open messages"
          style={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: 40,
            height: '60px',
            padding: '0 24px 0 20px',
            border: 0,
            borderRadius: '999px',
            background: '#0074B8',
            color: '#fff',
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 500,
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 10px 26px rgba(11,37,89,.35)'
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z"></path>
          </svg>
          Messages
          {totalUnreadCount > 0 && (
            <span style={{ minWidth: '24px', height: '24px', borderRadius: '12px', background: '#FDB515', color: '#0B2559', fontFamily: "'Nunito', sans-serif", fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
              {totalUnreadCount}
            </span>
          )}
        </button>
      )}

      {/* ─── Chat Window (WhatsApp Web / MS Teams style) ─── */}
      <UniOneChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        userInitial={userInitial}
      />

      {/* ─── All Notices Explorer Modal ─── */}
      {allNoticesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden font-nunito">
            <div style={{ background: '#0B2559', color: '#fff', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FDB515" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="2.5" />
                    <path d="M8 4l4-2.5 4 2.5" />
                    <rect x="6.5" y="8" width="11" height="8.5" rx="1" />
                    <circle cx="12" cy="7" r="1" fill="#FDB515" />
                    <line x1="8.5" y1="11" x2="15.5" y2="11" />
                    <line x1="8.5" y1="13.5" x2="13.5" y2="13.5" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontSize: '24px' }}>All University Notices</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#BFE3F7' }}>Official announcements and circulars</p>
                </div>
              </div>
              <button
                onClick={() => setAllNoticesOpen(false)}
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,.15)', border: 0, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {SAMPLE_NOTICES.map((n) => (
                <div key={n.id} style={{ padding: '16px', border: '1px solid #E3E9F3', borderRadius: '16px', background: '#FBFDFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', background: n.tagBg, color: n.tagColor, fontSize: '13px', fontWeight: 800 }}>{n.tag}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#5B6785' }}>{n.date}</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 800, color: '#0B2559' }}>{n.title}</h4>
                  <p style={{ margin: 0, fontSize: '15px', color: '#46526F', lineHeight: 1.5 }}>{n.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid #E3E9F3', background: '#F3F6FB', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setAllNoticesOpen(false)}
                style={{ height: '42px', padding: '0 24px', borderRadius: '999px', background: '#0074B8', color: '#fff', border: 0, fontWeight: 800, cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── All Events Explorer Modal ─── */}
      {allEventsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden font-nunito">
            <div style={{ background: '#14110C', color: '#fff', borderBottom: '2px solid #F5A100', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245, 161, 0, 0.12)', border: '1px solid rgba(245, 161, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5A100" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2.5" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <circle cx="8" cy="15" r="1" fill="#F5A100" />
                    <circle cx="12" cy="15" r="1" fill="#F5A100" />
                    <circle cx="16" cy="15" r="1" fill="#F5A100" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", fontSize: '24px', color: '#F5A100' }}>All Campus Events</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#CFC8BB' }}>Full schedule of university programs</p>
                </div>
              </div>
              <button
                onClick={() => setAllEventsOpen(false)}
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,.15)', border: 0, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {SAMPLE_EVENTS.map((e) => (
                <div key={e.id} style={{ padding: '16px', border: '1px solid #E3E9F3', borderRadius: '16px', background: '#FFFDF9', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#0B2559', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#FDB515' }}>{e.month || '2026'}</span>
                    <span style={{ fontSize: '20px', fontWeight: 800 }}>{e.day || 'Live'}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: '#0B2559' }}>{e.title}</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#F5A100', fontWeight: 700 }}>{e.dateLabel}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#5B6785' }}>Organized by {e.organizer}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid #E3E9F3', background: '#F3F6FB', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setAllEventsOpen(false)}
                style={{ height: '42px', padding: '0 24px', borderRadius: '999px', background: '#0B2559', color: '#fff', border: 0, fontWeight: 800, cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
