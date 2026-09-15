import React, { useEffect, useState } from 'react';
import { Bell, Clock, ExternalLink, Paperclip, Search, X } from 'lucide-react';
import type { AdminNotice } from '../admin/types/admin';
import { adminApi } from '../admin/services/adminApi';

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

export const NoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<AdminNotice[]>(DEFAULT_NOTICES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedNotice, setSelectedNotice] = useState<AdminNotice | null>(null);

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Banner Header */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-navy-50 text-navy-800 text-xs font-bold mb-3 border border-navy-200">
            <Bell className="w-4 h-4 text-orange-600" />
            <span>Official University Announcements & Circulars</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">University Notice Board</h1>
          <p className="text-navy-500 text-sm mt-1 max-w-2xl">
            Access all official university notices, exam datesheets, administrative orders, and official attachments.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-navy-800 text-white shadow-sm'
                  : 'bg-navy-50 text-navy-700 hover:bg-navy-100 border border-navy-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center space-x-3 w-full md:w-auto shrink-0">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars & notices..."
              className="w-full pl-9 pr-3 py-1.5 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-900 focus:outline-none focus:bg-white focus:border-navy-800"
            />
          </div>
        </div>
      </div>

      {/* Grid of Notices */}
      {loading ? (
        <div className="p-12 text-center text-sm font-semibold text-navy-500">
          Loading notices…
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy-100 p-12 text-center space-y-2">
          <Bell className="mx-auto h-8 w-8 text-navy-300" />
          <h3 className="text-base font-bold text-navy-900">No notices found</h3>
          <p className="text-xs text-navy-500">Try adjusting your search query or category filter.</p>
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

            return (
              <div
                key={n.id}
                onClick={() => setSelectedNotice(n)}
                className="group cursor-pointer rounded-xl border border-[#e5ebf5] bg-white p-4 shadow-[0_3px_10px_rgba(15,35,75,0.035)] transition hover:-translate-y-px hover:border-navy-200 hover:shadow-[0_7px_16px_rgba(15,35,75,0.06)] flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-navy-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-navy-800 border border-navy-200/60">
                      {n.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-navy-400">
                      <Clock className="h-3 w-3" /> {timeStr}
                    </span>
                  </div>

                  <h3 className="text-[13px] font-extrabold text-navy-950 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {n.title}
                  </h3>

                  <p className="text-[11px] text-navy-600 leading-snug line-clamp-3">
                    {n.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-navy-500 truncate">
                    {n.author || 'University Office'}
                  </span>

                  {n.attachmentUrl && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-navy-800 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  {selectedNotice.category}
                </span>
                <span className="rounded-md bg-navy-50 px-2 py-0.5 text-[10px] font-bold text-navy-700 border border-navy-200">
                  Priority: {selectedNotice.priority}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="rounded-full p-1.5 text-navy-400 hover:bg-navy-100 hover:text-navy-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold text-navy-950">
                {selectedNotice.title}
              </h3>
              <p className="text-xs font-semibold text-navy-500">
                Issued by {selectedNotice.author || 'University Office'} · {new Date(selectedNotice.publishAt || selectedNotice.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-navy-50/60 border border-navy-100 p-4 text-xs sm:text-sm font-medium leading-relaxed text-navy-800 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedNotice.content}
            </div>

            {selectedNotice.attachmentUrl && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Paperclip className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-navy-950 truncate">
                      {selectedNotice.attachmentName || 'Notice Attachment Document'}
                    </p>
                    {selectedNotice.attachmentSize && (
                      <p className="text-[10px] font-medium text-navy-500">
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
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs"
                >
                  View / Download <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="rounded-xl bg-navy-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-navy-800 transition"
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
