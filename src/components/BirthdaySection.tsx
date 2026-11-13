import React, { useState } from 'react';
import {
  Calendar,
  Gift,
  Send,
  Check,
  Sparkles,
  Heart,
  Cake,
  PartyPopper,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface BirthdayPerson {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  wished?: boolean;
}

const SAMPLE_BIRTHDAY_FOLKS: BirthdayPerson[] = [
  {
    id: 'b1',
    name: 'Aarav Sharma',
    role: 'Student · 3rd Year',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    wished: false,
  },
  {
    id: 'b2',
    name: 'Dr. Snehal Kadam',
    role: 'Associate Professor',
    department: 'Department of Bioengineering',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    wished: false,
  },
];

interface BirthdaySectionProps {
  // If empty array passed or null, will demonstrate the heartwarming 'no birthday today' state
  celebrants?: BirthdayPerson[];
}

export const BirthdaySection: React.FC<BirthdaySectionProps> = ({ celebrants: initialCelebrants }) => {
  // Toggle for testing zero birthdays vs having celebrants
  const [people, setPeople] = useState<BirthdayPerson[]>(initialCelebrants ?? SAMPLE_BIRTHDAY_FOLKS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const todayStr = (() => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  })();

  const handleSendWish = (id: string) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, wished: !p.wished } : p))
    );
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2400);
  };

  const hasCelebrants = people.length > 0;
  const currentPerson = hasCelebrants ? people[currentIndex % people.length] : null;

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between overflow-hidden h-full min-h-[175px]">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-100/60 rounded-full blur-2xl pointer-events-none" />

      {/* Floating confetti effect when wish is sent */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center bg-amber-500/10 backdrop-blur-[1px] animate-in fade-in duration-150">
          <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-full shadow-lg border border-amber-300 text-xs font-semibold text-amber-900 animate-bounce">
            <PartyPopper className="w-4 h-4 text-amber-500" />
            <span>Birthday wish delivered with campus cheer! 🎉</span>
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FAA831]/15 text-amber-700 flex items-center justify-center shrink-0">
            <Cake className="w-4 h-4 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                Birthday Celebrations
              </h3>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/70">
                {todayStr}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Campus joy & milestones
            </p>
          </div>
        </div>

        {hasCelebrants && people.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : people.length - 1))}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Previous celebrant"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-400 font-medium">
              {(currentIndex % people.length) + 1}/{people.length}
            </span>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % people.length)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Next celebrant"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Card Content: Either Celebrant or Heartwarming Empty State */}
      <div className="relative z-10">
        {hasCelebrants && currentPerson ? (
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-yellow-50/60 border border-amber-200/80 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={currentPerson.avatar}
                  alt={currentPerson.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 text-xs">🎂</span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {currentPerson.name}
                  </h4>
                  <span className="text-[9px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full">
                    Today
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 truncate mt-0.5">
                  {currentPerson.role}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {currentPerson.department}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSendWish(currentPerson.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                currentPerson.wished
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FAA831] hover:bg-[#e69824] text-slate-950 font-bold'
              }`}
            >
              {currentPerson.wished ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Wished!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Send wish</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Heartwarming state when no birthdays are scheduled */
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00AFEF] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-800">
                A peaceful day on campus!
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                No university birthdays scheduled for today. Every day is a chance to celebrate learning and kindness together.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>DYPIU Campus Culture</span>
        </span>
        <button
          onClick={() => {
            // Toggle demo: empty or with celebrants
            setPeople((prev) => (prev.length === 0 ? SAMPLE_BIRTHDAY_FOLKS : []));
          }}
          className="text-[10px] text-slate-400 hover:text-slate-600 underline"
        >
          {people.length === 0 ? 'Preview with birthdays' : 'Preview calm day'}
        </button>
      </div>
    </div>
  );
};
