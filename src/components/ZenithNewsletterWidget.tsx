import React from 'react';
import { Newspaper, BookOpen, Download } from 'lucide-react';

export interface NewsletterIssue {
  id: string;
  issueNumber: string;
  title: string;
  date: string;
  summary: string;
  coverImage?: string;
  pdfUrl?: string;
}

const latestZenithIssue: NewsletterIssue = {
  id: 'zenith_issue_jun_jul_26',
  issueNumber: 'Jun-Jul Edition 2026',
  title: 'Zenith: Official DYPIU Campus Newsletter',
  date: 'Jun-Jul 2026',
  summary: 'Featuring campus highlights, School of Computing research achievements, and student innovations.',
  pdfUrl: "/Zenith Jun-Jul ('26).pdf",
};

export const ZenithNewsletterWidget: React.FC = () => {
  const handleOpenPdf = () => {
    window.open("/Zenith Jun-Jul ('26).pdf", '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-100">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-navy-800 text-white">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-navy-900 leading-none">ZENITH</h3>
              <span className="text-[10px] text-navy-400 font-semibold tracking-wider uppercase">Official Campus Newsletter</span>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/30">
            Latest Issue
          </span>
        </div>

        {/* Issue Card */}
        <div className="bg-gradient-to-br from-navy-50 to-white rounded-xl p-4 border border-navy-100 space-y-2 mb-4">
          <div className="flex items-center justify-between text-[10px] font-bold text-navy-500">
            <span>{latestZenithIssue.issueNumber}</span>
            <span>{latestZenithIssue.date}</span>
          </div>

          <h4 className="text-sm font-extrabold text-navy-900 leading-snug">
            {latestZenithIssue.title}
          </h4>

          <p className="text-xs text-navy-600 leading-relaxed">
            {latestZenithIssue.summary}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center space-x-2 pt-2 border-t border-navy-100">
        <button
          onClick={handleOpenPdf}
          className="flex-1 py-2.5 rounded-xl bg-navy-800 text-white font-bold text-xs hover:bg-navy-900 transition-colors shadow-xs flex items-center justify-center space-x-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read Zenith Jun-Jul ('26)</span>
        </button>

        <a
          href="/Zenith Jun-Jul ('26).pdf"
          download="Zenith Jun-Jul ('26).pdf"
          className="p-2.5 rounded-xl bg-navy-50 text-navy-800 hover:bg-navy-100 border border-navy-200 transition-colors flex items-center justify-center"
          title="Download PDF"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
