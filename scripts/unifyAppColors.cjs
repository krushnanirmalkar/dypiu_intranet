const fs = require('fs');
let code = fs.readFileSync('src/components/UniOneDashboardPage.tsx', 'utf8');

// Target the SAMPLE_APPS array definition
const startIdx = code.indexOf('export const SAMPLE_APPS: UniOneApp[] = [');
const endIdx = code.indexOf('];\r\n\r\nexport const SAMPLE_NOTICES', startIdx) !== -1
  ? code.indexOf('];\r\n\r\nexport const SAMPLE_NOTICES', startIdx)
  : code.indexOf('];\n\nexport const SAMPLE_NOTICES', startIdx);

const updatedAppsArray = `export const SAMPLE_APPS: UniOneApp[] = [
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
    bg: '#0074B8',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,.92)',
    barColor: 'rgba(255,255,255,.16)',
    iconBg: 'rgba(255,255,255,.22)',
    iconColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    url: 'https://unisync.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="8" r="3"></circle>
        <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"></path>
        <circle cx="17" cy="9" r="2.5"></circle>
        <path d="M17 14c2.5 0 4 1.7 4 4"></path>
      </svg>
    )
  },
  {
    id: 'udms',
    name: 'Digital Documents',
    desc: 'Your secure digital document repository',
    bg: '#0074B8',
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
    bg: '#0074B8',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,.92)',
    barColor: 'rgba(255,255,255,.16)',
    iconBg: 'rgba(255,255,255,.22)',
    iconColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    url: 'https://library.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1z"></path>
        <path d="M12 6v13"></path>
      </svg>
    )
  },
  {
    id: 'exams',
    name: 'Exams and Results',
    desc: 'Schedules, hall tickets and marks',
    bg: '#0074B8',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,.92)',
    barColor: 'rgba(255,255,255,.16)',
    iconBg: 'rgba(255,255,255,.22)',
    iconColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    url: 'https://exam.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="4" width="14" height="17" rx="2"></rect>
        <path d="M9 4V3h6v1"></path>
        <path d="M9 13l2 2 4-4"></path>
      </svg>
    )
  },
  {
    id: 'fees',
    name: 'Fees and Payments',
    desc: 'Dues, receipts and scholarships',
    bg: '#0074B8',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,.92)',
    barColor: 'rgba(255,255,255,.16)',
    iconBg: 'rgba(255,255,255,.22)',
    iconColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    url: 'https://fees.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2"></rect>
        <path d="M3 10h18M7 15h4"></path>
      </svg>
    )
  },
  {
    id: 'timetable',
    name: 'Timetable',
    desc: 'Your daily schedule and attendance',
    bg: '#0074B8',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,.92)',
    barColor: 'rgba(255,255,255,.16)',
    iconBg: 'rgba(255,255,255,.22)',
    iconColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    url: 'https://timetable.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2"></rect>
        <path d="M3 10h18M8 3v4M16 3v4M8 14h2M14 14h2M8 17.5h2"></path>
      </svg>
    )
  },
  {
    id: 'placements',
    name: 'Placements',
    desc: 'Drives, openings and career help',
    bg: '#0074B8',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,.92)',
    barColor: 'rgba(255,255,255,.16)',
    iconBg: 'rgba(255,255,255,.22)',
    iconColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    url: 'https://placements.dypiu.ac.in',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="7" width="18" height="13" rx="2"></rect>
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"></path>
      </svg>
    )
  }
]`;

if (startIdx !== -1 && endIdx !== -1) {
  code = code.slice(0, startIdx) + updatedAppsArray + code.slice(endIdx);
  fs.writeFileSync('src/components/UniOneDashboardPage.tsx', code, 'utf8');
  console.log('Successfully unified app card colors to #0074B8!');
} else {
  console.log('Could not find slice range for SAMPLE_APPS', startIdx, endIdx);
}
