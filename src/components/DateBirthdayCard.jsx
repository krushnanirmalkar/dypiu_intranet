import React, { useState } from 'react';
import { Calendar, Gift, Send, Check } from 'lucide-react';
import { BottomRightCornerSwoosh } from './DecorativeShapes';

export const DateBirthdayCard = (/** @type {any} */ { dateText = '' } = {}) => {
  const [wished, setWished] = useState(false);

  const displayDate = dateText || (() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = today.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${day} ${month}`;
  })();

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between h-full min-h-[165px] overflow-hidden select-none">
      {/* Decorative corner swoosh */}
      <BottomRightCornerSwoosh className="w-16 h-12 z-0" />

      <div className="relative z-10 space-y-3">
        {/* Top: Today Date Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00afef]/10 text-[#00afef] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                TODAY
              </span>
              <h2 className="text-xl font-bold text-[#393678] tracking-tight leading-none mt-0.5">
                {displayDate}
              </h2>
            </div>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="border-t border-slate-100 my-1.5" />

        {/* Bottom: Birthday Update & Wish Block */}
        <div>
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <div className="flex items-center gap-1 text-[9px] font-extrabold text-[#faa831] uppercase tracking-wider">
              <Gift className="w-3 h-3 stroke-[2.5]" />
              <span>BIRTHDAY TODAY</span>
            </div>
            <a
              href="#birthdays"
              className="text-[10px] font-bold text-[#f16136] hover:underline cursor-pointer"
            >
              See more &rarr;
            </a>
          </div>

          <div className="p-2.5 rounded-xl bg-[#faa831]/10 border border-[#faa831]/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/images/avatars/student-aarav.jpg"
                alt="Aarav Sharma"
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-white shadow-2xs"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#393678] truncate leading-tight">
                  Aarav Sharma
                </h4>
                <p className="text-[9.5px] text-slate-500 font-medium truncate mt-0.5">
                  CSE Student · 3rd Year
                </p>
              </div>
            </div>

            <button
              onClick={() => setWished(!wished)}
              className={`shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                wished
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-[#faa831] hover:bg-[#e09425] text-white shadow-xs'
              }`}
            >
              {wished ? (
                <>
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Wished!</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 stroke-[2.2]" />
                  <span>Send Wish</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
