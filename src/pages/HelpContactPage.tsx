import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';
import type { UserProfile } from '../types';

interface HelpContactPageProps {
  user?: UserProfile | null;
  onBack?: () => void;
}

export const HelpContactPage: React.FC<HelpContactPageProps> = ({ user, onBack }) => {
  const [name, setName] = useState(() => user?.name || '');
  const [email, setEmail] = useState(() => user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Handle scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = (emailStr: string) => {
    navigator.clipboard.writeText(emailStr);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // Simulate sending message to university IT desk
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubject('');
      setMessage('');
      setTimeout(() => {
        setIsSuccess(false);
      }, 6000);
    }, 700);
  };

  return (
    <div className="w-full min-h-full py-2 sm:py-4 px-1 sm:px-2 font-sans antialiased text-slate-700 space-y-5 sm:space-y-6">
      {/* Top Header: Back button and Title */}
      <div className="flex items-center py-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Dashboard"
          className="inline-flex items-center gap-2 p-1.5 -ml-1.5 text-[#393678] hover:text-[#00afef] hover:bg-white rounded-xl transition-colors cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-lg font-bold font-serif-custom tracking-tight">
            Contact Us
          </span>
        </button>
      </div>

      {/* Responsive Grid: Side-by-side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Contact Cards */}
        <section className="lg:col-span-5 space-y-3 sm:space-y-3.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#393678] font-serif-custom tracking-tight">
            Contact the UniOne Desk
          </h2>

          <div className="space-y-2.5 sm:space-y-3">
            {/* Card 1: Email Support */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 shadow-xs transition-all hover:border-[#faa831]/50 group">
              <div className="w-11 h-11 rounded-xl bg-[#faa831]/10 border border-[#faa831]/30 text-[#faa831] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5 stroke-[2]" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider text-slate-400 uppercase font-mono block">
                  EMAIL SUPPORT
                </span>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <a
                    href="mailto:intranet@dypiu.ac.in"
                    className="text-sm sm:text-base font-bold text-[#393678] hover:text-[#00afef] transition-colors truncate"
                  >
                    intranet@dypiu.ac.in
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail('intranet@dypiu.ac.in')}
                    title="Copy email address"
                    className="p-1 rounded-md text-slate-400 hover:text-[#00afef] hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Official desk for student & faculty queries. Typical reply within 24 hours.
                </p>
              </div>
            </div>

            {/* Card 2: Campus Location */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 shadow-xs transition-all hover:border-[#faa831]/50 group">
              <div className="w-11 h-11 rounded-xl bg-[#faa831]/10 border border-[#faa831]/30 text-[#faa831] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 stroke-[2]" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider text-slate-400 uppercase font-mono block">
                  CAMPUS LOCATION
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#393678] mt-0.5">
                  DYPIU Campus, Pune
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  D. Y. Patil International University, Akurdi, Pune - 411044
                </p>
              </div>
            </div>

            {/* Card 3: Office Hours */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 shadow-xs transition-all hover:border-[#faa831]/50 group">
              <div className="w-11 h-11 rounded-xl bg-[#faa831]/10 border border-[#faa831]/30 text-[#faa831] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5 stroke-[2]" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider text-slate-400 uppercase font-mono block">
                  OFFICE HOURS
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#393678] mt-0.5">
                  Mon – Fri • 9 AM to 5 PM
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Student Affairs & IT Wing, Room 402, Block J.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Send a Direct Message (Precisely level with left cards) */}
        <section className="lg:col-span-7 lg:mt-[44px] bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
          <header className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#393678] font-serif-custom tracking-tight">
              Send a Direct Message
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fill in the details below and we will respond directly to your email.
            </p>
          </header>

        {/* Success Confirmation Banner */}
        {isSuccess && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-emerald-900">Message sent successfully!</p>
              <p className="text-emerald-700">
                Our support team has received your inquiry and will follow up with you directly at{' '}
                <span className="font-semibold underline">{email}</span>.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* 2-Column Row for Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* YOUR NAME */}
            <div className="space-y-1">
              <label
                htmlFor="help-name"
                className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono"
              >
                YOUR NAME
              </label>
              <input
                id="help-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarthak Jayant Kharche"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#faa831] focus:ring-2 focus:ring-[#faa831]/20 transition-all"
              />
            </div>

            {/* EMAIL ADDRESS */}
            <div className="space-y-1">
              <label
                htmlFor="help-email"
                className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono"
              >
                EMAIL ADDRESS
              </label>
              <input
                id="help-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. 20240802084@dypiu.ac.in"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#faa831] focus:ring-2 focus:ring-[#faa831]/20 transition-all font-mono"
              />
            </div>
          </div>

          {/* SUBJECT / PURPOSE */}
          <div className="space-y-1">
            <label
              htmlFor="help-subject"
              className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono"
            >
              SUBJECT / PURPOSE
            </label>
            <input
              id="help-subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Question regarding Intranet Portal / Services"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#faa831] focus:ring-2 focus:ring-[#faa831]/20 transition-all"
            />
          </div>

          {/* YOUR MESSAGE */}
          <div className="space-y-1">
            <label
              htmlFor="help-message"
              className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono"
            >
              YOUR MESSAGE
            </label>
            <textarea
              id="help-message"
              required
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Describe what you need help with..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#faa831] focus:ring-2 focus:ring-[#faa831]/20 transition-all resize-y min-h-[58px]"
            />
          </div>

          {/* SEND MESSAGE Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#faa831] hover:bg-[#e69524] active:bg-[#d68514] disabled:opacity-70 text-slate-950 font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-1"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>SENDING...</span>
              </>
            ) : (
              <>
                <span>SEND MESSAGE</span>
                <Send className="w-4 h-4 stroke-[2.2]" />
              </>
            )}
          </button>
        </form>
      </section>
      </div>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#0A1328] hover:bg-[#393678] text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-200"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};
