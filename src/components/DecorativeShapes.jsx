import React from 'react';

/**
 * Decorative corner swoosh graphics matching DYPIU brand style:
 * Blue (#003B70 / #0057A8), Cyan (#00A6E8), Yellow (#FDB515), Orange (#F7941D)
 */

export const TopRightHeaderShape = ({ className = "h-full w-28 sm:w-36 md:w-44" }) => (
  <div className={`absolute top-0 right-0 pointer-events-none z-0 overflow-hidden ${className}`}>
    <svg
      viewBox="0 0 160 80"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path d="M160 0H20C55 25 85 55 105 80H160V0Z" fill="#FDB515" />
      <path d="M160 0H60C85 25 110 55 130 80H160V0Z" fill="#00A6E8" />
      <path d="M160 0H100C120 25 138 55 148 80H160V0Z" fill="#003B70" />
    </svg>
  </div>
);

export const BottomRightCornerSwoosh = ({ className = "w-24 h-16" }) => (
  <div className={`absolute bottom-0 right-0 pointer-events-none overflow-hidden rounded-br-2xl ${className}`}>
    <svg viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Outer yellow layer */}
      <path d="M100 0C60 25 35 45 0 70H100V0Z" fill="#FDB515" />
      {/* Cyan layer */}
      <path d="M100 15C70 32 48 50 15 70H100V15Z" fill="#00A6E8" />
      {/* Royal blue layer */}
      <path d="M100 32C80 44 65 57 38 70H100V32Z" fill="#003B70" />
    </svg>
  </div>
);

export const LeftEdgeDarkSwoosh = () => (
  <div className="absolute top-1/3 left-0 pointer-events-none w-6 h-20 overflow-hidden">
    <svg viewBox="0 0 24 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M0 0C16 20 24 35 24 50C24 65 14 72 0 80V0Z" fill="#002D62" />
    </svg>
  </div>
);

export const TopRightYellowBadgeShape = () => (
  <div className="absolute top-0 right-0 pointer-events-none w-14 h-14 overflow-hidden rounded-tr-2xl">
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M60 0H0C25 0 60 35 60 60V0Z" fill="#FDB515" />
    </svg>
  </div>
);

export const BottomLeftBlueYellowSwoosh = () => (
  <div className="absolute bottom-0 left-0 pointer-events-none w-16 h-16 overflow-hidden rounded-bl-2xl">
    <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M0 70V0C10 25 35 55 70 70H0Z" fill="#003B70" />
      <path d="M0 70V20C8 35 25 58 50 70H0Z" fill="#00A6E8" />
    </svg>
  </div>
);
