import React from 'react';

export const FooterDecoration = () => {
  return (
    <footer className="relative w-full pt-8 pb-4 px-8 overflow-hidden select-none pointer-events-none">
      {/* Horizontal subtle architectural drawing & waves */}
      <div className="absolute inset-x-0 bottom-0 h-24 overflow-hidden opacity-40">
        {/* Wave SVG */}
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-full object-cover"
        >
          <path
            d="M0 60C240 20 480 80 720 50C960 20 1200 70 1440 40V100H0V60Z"
            fill="url(#wave-gradient-1)"
            opacity="0.4"
          />
          <path
            d="M0 40C360 80 720 20 1080 60C1260 80 1380 50 1440 45V100H0V40Z"
            fill="url(#wave-gradient-2)"
            opacity="0.3"
          />
          <defs>
            <linearGradient id="wave-gradient-1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93C5FD" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#60A5FA" stopOpacity="0.2" />
              <stop offset="1" stopColor="#2563EB" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="wave-gradient-2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#BFDBFE" stopOpacity="0.5" />
              <stop offset="1" stopColor="#93C5FD" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Faint architectural campus line-art in bottom-left/center */}
        <svg
          viewBox="0 0 1000 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-2 left-10 w-[700px] h-auto stroke-blue-400/40 stroke-1"
        >
          <path d="M50 100 L50 40 L150 40 L150 100 M60 100 L60 55 L85 55 L85 100 M115 100 L115 55 L140 55 L140 100 M100 40 L100 15 L80 30 M100 15 L120 30" />
          <path d="M150 60 L350 60 L350 100 M180 100 L180 75 L210 75 L210 100 M240 100 L240 75 L270 75 L270 100 M300 100 L300 75 L330 75 L330 100" />
          <path d="M350 30 L450 30 L450 100 M380 100 L380 45 L420 45 L420 100 M400 30 L400 10 M380 20 L400 10 L420 20" />
          <path d="M450 70 L650 70 L650 100 M480 100 L480 80 L520 80 L520 100 M560 100 L560 80 L600 80 L600 100" />
          <line x1="20" y1="100" x2="700" y2="100" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Footer Text on Right */}
      <div className="relative z-10 flex items-center justify-end gap-3 text-xs font-semibold text-slate-500 pointer-events-auto">
        <span>DYPIU</span>
        <span className="text-slate-300">|</span>
        <span>Akurdi, Pune</span>
        <span className="w-8 h-[2px] bg-[#0057A8] rounded-full inline-block ml-1" />
      </div>
    </footer>
  );
};
