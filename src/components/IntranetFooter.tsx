import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface IntranetFooterProps {
  onNavigate?: (route: string) => void;
  onScrollTop?: () => void;
  className?: string;
}

export const IntranetFooter: React.FC<IntranetFooterProps> = ({
  onNavigate,
  className = ''
}) => {
  const [showCredits, setShowCredits] = useState(false);
  const creditsRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowCredits(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setShowCredits(false);
    }, 300);
  };

  // Close credits tooltip on outside click / cleanup
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (creditsRef.current && !creditsRef.current.contains(event.target as Node)) {
        setShowCredits(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const students = [
    {
      name: 'Sarthak Kharche',
      linkedin: 'https://www.linkedin.com/in/sarthak-kharche/'
    },
    {
      name: 'Krushna Nirmalkar',
      linkedin: 'https://www.linkedin.com/in/krushna-nirmalkar/'
    }
  ];

  return (
    <footer
      className={`relative w-full bg-[#0A1328] text-white border-t border-[#040A14] px-4 sm:px-6 py-2.5 sm:py-3 select-none shrink-0 ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand & Tagline without logo and without blue intranet tag */}
        <div className="text-center sm:text-left">
          <span className="font-extrabold text-sm tracking-tight text-white font-serif-custom">
            UniOne
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            Empowering DYPIU campus communications, services, and management.
          </p>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-slate-300 font-medium">
          <button
            type="button"
            onClick={() => onNavigate?.('support')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contact Us
          </button>
          <span className="text-slate-600 select-none">•</span>
          <button
            type="button"
            onClick={() => onNavigate?.('dashboard')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Team
          </button>
          <span className="text-slate-600 select-none mx-0.5">|</span>
          <button
            type="button"
            onClick={() => onNavigate?.('privacy')}
            className="hover:text-white transition-colors cursor-pointer underline-offset-2 hover:underline"
          >
            Privacy Policy
          </button>
          <span className="text-slate-600 select-none">•</span>
          <button
            type="button"
            onClick={() => onNavigate?.('terms')}
            className="hover:text-white transition-colors cursor-pointer underline-offset-2 hover:underline"
          >
            Terms of Service
          </button>
        </div>

        {/* Right: Powered by Students @ DYPIU with persistent hover popup */}
        <div
          className="relative inline-flex items-center"
          ref={creditsRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Hover / Tap Tooltip Popup with same background color (#0A1328) as footer */}
          {showCredits && (
            <div
              role="tooltip"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="absolute bottom-full pb-2 right-0 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="w-64 sm:w-68 bg-[#0A1328] border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl text-left">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#faa831] font-mono mb-2 flex items-center justify-between">
                  <span>BUILT BY STUDENTS</span>
                  <span className="text-slate-400 font-normal">@DYPIU</span>
                </div>

                <div className="space-y-1">
                  {students.map((student) => (
                    <a
                      key={student.name}
                      href={student.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg border-b border-slate-800/80 last:border-0 gap-3 group/student hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <span className="text-xs font-bold text-white group-hover/student:text-[#faa831] tracking-wide truncate transition-colors">
                        {student.name}
                      </span>
                      <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 group-hover/student:text-white transition-colors flex items-center gap-1 shrink-0">
                        <span>LINKEDIN</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover/student:opacity-100" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Trigger Text */}
          <button
            type="button"
            onClick={() => setShowCredits(!showCredits)}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 cursor-pointer group py-1 bg-transparent border-0"
          >
            <span className="tracking-wider text-[10px] opacity-80">POWERED BY</span>
            <span className="font-bold text-[#faa831] group-hover:text-[#ffbe5b] underline underline-offset-4 decoration-[#faa831]/60 transition-colors">
              STUDENTS @DYPIU
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};
