import React, { useState } from 'react';
import { Users, ArrowRight, Cake, Sparkles } from 'lucide-react';

export const CampusLife = () => {
  const [wished, setWished] = useState(false);

  const avatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full min-h-[230px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-[#0057A8] rounded-lg">
            <Users className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold tracking-tight text-[#002B5C] uppercase">
              CAMPUS LIFE
            </h3>
            <p className="text-[10px] text-slate-500 font-normal">
              People to celebrate
            </p>
          </div>
        </div>
        <a
          href="#life"
          className="text-[10px] font-semibold text-[#0057A8] hover:text-[#002B5C] flex items-center gap-1 transition-colors cursor-pointer"
        >
          View all <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Birthday Feature Card */}
      <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-3 relative overflow-hidden flex items-center justify-between my-auto">
        <Sparkles className="absolute top-1.5 left-1.5 w-3 h-3 text-amber-400 opacity-60" />
        <Sparkles className="absolute bottom-1.5 right-10 w-2.5 h-2.5 text-amber-400 opacity-60" />

        {/* Profile + Info */}
        <div className="flex items-center gap-2.5">
          <img
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
            alt="Aarav Sharma"
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-300 shadow-2xs"
          />
          <div>
            <h4 className="text-[11px] font-bold text-[#002B5C]">
              Aarav Sharma
            </h4>
            <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-0.5">
              <span>Birthday Today</span>
              <Cake className="w-3 h-3 text-amber-600 inline" />
            </div>
          </div>
        </div>

        {/* Wish Button */}
        <button
          onClick={() => setWished(!wished)}
          className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
            wished
              ? 'bg-emerald-600 text-white'
              : 'bg-[#FDB515] hover:bg-[#E5A30D] text-[#002B5C]'
          }`}
        >
          <span>{wished ? 'WISHED! 🎉' : 'SEND A WISH'}</span>
          {!wished && <ArrowRight className="w-3 h-3" />}
        </button>
      </div>

      {/* Overlapping Avatars Row */}
      <div className="flex items-center gap-1 pt-1">
        <div className="flex items-center -space-x-2">
          {avatars.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="Student Avatar"
              className="w-6 h-6 rounded-full object-cover border-2 border-white shadow-2xs"
            />
          ))}
          <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white text-slate-700 text-[9px] font-bold flex items-center justify-center shadow-2xs">
            +2
          </div>
        </div>
      </div>
    </div>
  );
};
