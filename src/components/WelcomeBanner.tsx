import React from 'react';
import type { UserProfile } from '../types';

interface WelcomeBannerProps {
  user: UserProfile;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user }) => {
  const firstName = user.name.trim().split(/\s+/)[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';

  return (
    <section className="relative h-[218px] overflow-hidden rounded-[18px] border border-navy-100 bg-white shadow-[0_8px_24px_rgba(15,35,75,0.045)] sm:h-[232px] lg:h-[242px]">
      <img src="/dypiu-campus-banner-v2.png" alt="Panoramic view of the D Y Patil International University campus entrance" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0.14)_24%,rgba(255,255,255,0)_42%)]" />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1000 240"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="banner-sweep-fill" x1="0%" y1="100%" x2="100%" y2="35%">
            <stop offset="0%" stopColor="#142B82" />
            <stop offset="55%" stopColor="#101F73" />
            <stop offset="100%" stopColor="#071452" />
          </linearGradient>
          <linearGradient id="banner-sweep-edge" x1="0%" y1="100%" x2="100%" y2="35%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2458D8" />
          </linearGradient>
        </defs>
        <path
          d="M 735 246 C 820 244, 935 219, 1008 178 L 1008 246 Z"
          fill="url(#banner-sweep-fill)"
          stroke="url(#banner-sweep-edge)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative flex h-full max-w-md flex-col justify-center px-6 sm:px-9 lg:px-11">
        <p className="text-2xl font-extrabold tracking-tight text-navy-950 sm:text-[27px]">{greeting}</p>
        <h1 className="mt-0.5 text-[30px] font-black leading-none tracking-tight text-blue-600 sm:text-[34px]">{firstName}!</h1>
        <p className="mt-3 text-xs font-medium text-navy-700 sm:text-sm">Let’s make today productive.</p>
        <span className="mt-4 h-0.5 w-11 rounded-full bg-blue-600" />
      </div>
    </section>
  );
};
