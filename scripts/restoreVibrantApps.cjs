const fs = require('fs');

let code = fs.readFileSync('src/components/UniOneDashboardPage.tsx', 'utf8');

const p1 = code.indexOf('export const SAMPLE_APPS: UniOneApp[] = [');
const p2 = code.indexOf('export const SAMPLE_NOTICES: UniOneNotice[] = [');

if (p1 === -1 || p2 === -1) {
  console.error('Could not find delimiters');
  process.exit(1);
}

const replacement = `export const SAMPLE_APPS: UniOneApp[] = [
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
];`;

code = code.slice(0, p1) + replacement + '\n\n' + code.slice(p2);
fs.writeFileSync('src/components/UniOneDashboardPage.tsx', code, 'utf8');
console.log('Restored original colorful cards.');
