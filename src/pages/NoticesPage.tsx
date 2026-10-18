import React, { useEffect, useState } from 'react';
import { Bell, Clock, ExternalLink, Paperclip, Plus, Search, X, ArrowLeft } from 'lucide-react';
import type { AdminNotice } from '../admin/types/admin';
import type { UserProfile } from '../types';
import { adminApi } from '../admin/services/adminApi';

interface NoticesPageProps {
  user?: UserProfile | null;
  onOpenCreateNotice?: () => void;
  onBack?: () => void;
}

const DEFAULT_NOTICES: AdminNotice[] = [
  {
    id: 'n-1',
    title: 'End Semester Exam Schedule Released for Spring 2026',
    content: 'The official datesheet for May 2026 End-Semester Examinations has been published. All students are advised to check their respective course exam schedules, hall ticket eligibility status, and room allocations on the Examination Engine portal.',
    category: 'Academic',
    audience: 'All',
    priority: 'High',
    status: 'published',
    author: 'Controller of Examinations',
    publishAt: new Date().toISOString(),
    expiresAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'admin@dypiu.ac.in',
    updatedBy: 'admin@dypiu.ac.in',
  },
  {
    id: 'n-2',
    title: 'DYPIU Seed Research Grant Applications Open for AY 2026-27',
    content: 'Applications are officially open for the DYPIU Seed Research Grant for AY 2026-27. Faculty members and postgraduate scholars are invited to submit interdisciplinary project proposals with funding up to ₹5,000,000.',
    category: 'Administrative',
    audience: 'Staff',
    priority: 'Medium',
    status: 'published',
    author: 'Dean Research & Innovation',
    publishAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    expiresAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'research@dypiu.ac.in',
    updatedBy: 'research@dypiu.ac.in',
  },
  {
    id: 'n-3',
    title: 'Scheduled Campus Network & IT Maintenance',
    content: 'A planned system maintenance upgrade will take place across campus IT infrastructure on Saturday from 11:30 PM to 04:00 AM.',
    category: 'Campus',
    audience: 'All',
    priority: 'Low',
    status: 'published',
    author: 'IT Infrastructure Desk',
    publishAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'it@dypiu.ac.in',
    updatedBy: 'it@dypiu.ac.in',
  },
];

const categoryColorMap: Record<string, string> = {
  Academic: 'bg-[#00afef]/10 text-[#00afef] border-[#00afef]/25',
  Administrative: 'bg-[#faa831]/10 text-[#faa831] border-[#faa831]/25',
  Campus: 'bg-[#1bb470]/10 text-[#1bb470] border-[#1bb470]/25',
  Urgent: 'bg-[#f16136]/10 text-[#f16136] border-[#f16136]/25',
};

export const NoticesPage: React.FC<NoticesPageProps> = ({ user, onOpenCreateNotice, onBack }) => {
  const [notices, setNotices] = useState<AdminNotice[]>(DEFAULT_NOTICES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedNotice, setSelectedNotice] = useState<AdminNotice | null>(null);

  const canCreateNotice = Boolean(
    user?.isSuperAdmin || user?.role === 'admin' || user?.permissions?.canManageNotices
  );

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const data = await adminApi.fetchNotices({ status: 'published' });
        if (Array.isArray(data) && data.length > 0) {
          setNotices(data);
        }
      } catch (err) {
        console.error('Failed to load notices page data:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetchNotices();
  }, []);

  const filteredNotices = notices.filter((n) => {
    if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.author && n.author.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const categories = ['All', 'Academic', 'Administrative', 'Campus', 'Urgent'];

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-200">
      {/* Page Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {onBack && (
              <>
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#393678] hover:text-[#00afef] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </button>
                <span className="text-slate-300">·</span>
              </>
            )}
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#f16136]/10 text-[#f16136] text-[11px] font-extrabold uppercase tracking-wider border border-[#f16136]/20">
              <Bell className="w-3 h-3 text-[#f16136]" />
              <span>Official Circulars</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#393678] font-serif-custom tracking-tight">
            University Notice Board
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Access all official university circulars, examination notifications, academic schedules, and administrative attachments.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canCreateNotice && onOpenCreateNotice && (
            <button
              onClick={onOpenCreateNotice}
              className="flex items-center gap-2 rounded-xl bg-[#f16136] hover:bg-[#d94820] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Notice</span>
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-xl bg-[#0A1328] hover:bg-[#152347] text-white px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
            >
              Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#393678] text-white shadow-xs'
                  : 'bg-[#F1F1F7] text-slate-700 hover:bg-[#E6E6F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices & circulars..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F1F1F7] hover:bg-[#E6E6F0] focus:bg-white border border-transparent focus:border-[#393678] rounded-full text-xs text-slate-700 outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid of Notices */}
      {loading ? (
        <div className="p-12 text-center text-sm font-semibold text-slate-500 bg-white rounded-2xl border border-slate-200/80">
          Loading notices…
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-2 shadow-xs">
          <Bell className="mx-auto h-8 w-8 text-slate-300" />
          <h3 className="text-base font-bold text-[#393678]">No notices found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotices.map((n) => {
            const pubDate = new Date(n.publishAt || n.createdAt);
            const timeStr = pubDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const tagStyle = categoryColorMap[n.category] || 'bg-[#00afef]/10 text-[#00afef] border-[#00afef]/25';

            return (
              <div
                key={n.id}
                onClick={() => setSelectedNotice(n)}
                className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-md px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider border ${tagStyle}`}>
                      {n.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Clock className="h-3 w-3" /> {timeStr}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#393678] group-hover:text-[#00afef] transition-colors line-clamp-2 leading-snug">
                    {n.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {n.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 truncate">
                    {n.author || 'University Office'}
                  </span>

                  {n.attachmentUrl && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#00afef]/10 px-2 py-0.5 text-[10px] font-bold text-[#00afef] border border-[#00afef]/20">
                      <Paperclip className="h-3 w-3" /> Attachment
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs select-none">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#393678] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  {selectedNotice.category}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                  Priority: {selectedNotice.priority}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-[#393678] leading-snug">
                {selectedNotice.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Issued by {selectedNotice.author || 'University Office'} · {new Date(selectedNotice.publishAt || selectedNotice.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-xs sm:text-sm font-medium leading-relaxed text-slate-700 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedNotice.content}
            </div>

            {selectedNotice.attachmentUrl && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00afef] text-white">
                    <Paperclip className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#393678] truncate">
                      {selectedNotice.attachmentName || 'Notice Attachment Document'}
                    </p>
                    {selectedNotice.attachmentSize && (
                      <p className="text-[10px] font-medium text-slate-500">
                        Size: {selectedNotice.attachmentSize}
                      </p>
                    )}
                  </div>
                </div>
                <a
                  href={selectedNotice.attachmentUrl}
                  download={selectedNotice.attachmentName || 'notice-document'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center gap-1 rounded-xl bg-[#00afef] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0092c7] transition shadow-xs"
                >
                  View / Download <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="rounded-xl bg-[#0A1328] hover:bg-[#152347] px-5 py-2.5 text-xs font-bold text-white transition cursor-pointer"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
