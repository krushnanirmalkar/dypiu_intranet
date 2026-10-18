import React from 'react';
import { TopRightYellowBadgeShape, BottomLeftBlueYellowSwoosh } from './DecorativeShapes';
import dypiuCampusHero from '../assets/dypiu_campus_hero.jpg';

const thoughts = [
  "“You don’t have to figure everything out today. Just take the next step.”",
  "“Excellence is not a skill, it’s an attitude.”",
  "“The secret of getting ahead is getting started.”",
  "“Small daily improvements over time lead to stunning results.”",
  "“Focus on progress, not perfection.”",
  "“Opportunities don't happen, you create them.”",
  "“Discipline is the bridge between goals and accomplishment.”",
  "“Education is the passport to the future, for tomorrow belongs to those who prepare for it today.”",
  "“Believe you can and you're halfway there.”",
  "“Curiosity is the wick in the candle of learning.”",
  "“Success is the sum of small efforts, repeated day in and day out.”",
  "“The expert in anything was once a beginner.”",
  "“What you do today can improve all your tomorrows.”",
  "“Learn continuously. There is always ‘one more thing’ to learn.”"
];

export const WelcomeHero = (/** @type {any} */ { user } = {}) => {
  // Deterministic daily thought that changes automatically every calendar day
  const todayThought = (() => {
    const now = new Date();
    const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
    return thoughts[Math.abs(dayNumber) % thoughts.length];
  })();

  const rawFirstName = user?.name ? user.name.trim().split(/\s+/)[0] : 'Sarthak';
  const displayName = rawFirstName
    ? rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1).toLowerCase()
    : 'Sarthak';

  return (
    <div className="relative bg-gradient-to-r from-[#F1F1F7] via-[#F5F8FC] to-[#E6F4FC] rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden p-3.5 sm:p-5 min-h-[155px] sm:min-h-[165px] flex flex-col justify-between">
      {/* Decorative corner swoosh bottom-left */}
      <BottomLeftBlueYellowSwoosh />

      {/* Top Heading */}
      <div className="relative z-10 mb-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#393678] font-serif-custom tracking-tight">
          Welcome back, {displayName}
        </h1>
      </div>

      {/* Hero content & Background Campus Image */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Quote Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/80 rounded-xl p-2.5 sm:p-3 shadow-2xs w-full max-w-sm sm:max-w-md hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-[#00afef] tracking-wider uppercase">
              ✨ A LITTLE SOMETHING
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-relaxed italic">
            {todayThought}
          </p>
        </div>
      </div>

      {/* Right side Campus Building Image & Yellow badge */}
      <div className="absolute top-0 right-0 bottom-0 w-1/3 sm:w-2/5 overflow-hidden rounded-r-xl pointer-events-none">
        <img
          src={dypiuCampusHero}
          alt="DYPIU Campus Building"
          className="w-full h-full object-cover object-center opacity-60 sm:opacity-90 mix-blend-multiply"
        />
        {/* Sky gradient overlay blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F1F1F7] via-[#F1F1F7]/70 sm:via-transparent to-transparent" />
        {/* Top-right yellow triangle accent */}
        <TopRightYellowBadgeShape />
      </div>
    </div>
  );
};
