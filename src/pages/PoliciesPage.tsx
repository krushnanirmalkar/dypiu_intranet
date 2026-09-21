import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, ExternalLink, FileText, Paperclip, Plus, Search, X } from 'lucide-react';
import type { AdminPolicy } from '../admin/types/admin';
import type { UserProfile } from '../types';
import { adminApi } from '../admin/services/adminApi';

interface PoliciesPageProps {
  user?: UserProfile | null;
  onOpenCreatePolicy?: () => void;
}

const DEFAULT_POLICIES: AdminPolicy[] = [
  {
    id: 'pol-1',
    title: 'DYPIU Campus Information Security Policy',
    category: 'IT & Security',
    summary: 'Guidelines for acceptable use of campus network, accounts, data protection, and cybersecurity compliance.',
    content: 'All students, faculty, and administrative staff must adhere to strict password governance, multi-factor authentication, and multi-tenant data privacy regulations. Unauthorized distribution of internal credentials or scraping of campus databases is strictly prohibited.',
    version: '1.2',
    status: 'published',
    effectiveDate: '2026-01-01',
    publishedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2025-12-15T10:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdBy: 'admin@dypiu.ac.in',
    updatedBy: 'admin@dypiu.ac.in',
  },
  {
    id: 'pol-2',
    title: 'Academic Integrity and Anti-Plagiarism Framework',
    category: 'Academic',
    summary: 'Policy governing originality of submitted course assignments, research papers, and examination conduct.',
    content: 'DYPIU maintains zero tolerance towards academic dishonesty. Submissions containing unauthorized AI generation or uncredited text will be evaluated by the Disciplinary Committee in accordance with UGC guidelines.',
    version: '2.0',
    status: 'published',
    effectiveDate: '2026-02-01',
    publishedAt: '2026-02-01T00:00:00.000Z',
    createdAt: '2026-01-20T11:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    createdBy: 'academics@dypiu.ac.in',
    updatedBy: 'academics@dypiu.ac.in',
  },
  {
    id: 'pol-3',
    title: 'Student Code of Conduct & Hostel Governance',
    category: 'Campus & Hostel',
    summary: 'Rules of conduct, residency guidelines, curfew regulations, and campus decorum.',
    content: 'All resident and non-resident students are expected to maintain exemplary behavior on campus premises. Identity cards must be displayed at all times, and anti-ragging policies are strictly enforced.',
    version: '1.5',
    status: 'published',
    effectiveDate: '2025-08-01',
    publishedAt: '2025-08-01T00:00:00.000Z',
    createdAt: '2025-07-15T10:00:00.000Z',
    updatedAt: '2025-08-01T00:00:00.000Z',
    createdBy: 'hostel@dypiu.ac.in',
    updatedBy: 'hostel@dypiu.ac.in',
  },
];

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ user, onOpenCreatePolicy }) => {
  const [policies, setPolicies] = useState<AdminPolicy[]>(DEFAULT_POLICIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPolicy, setSelectedPolicy] = useState<AdminPolicy | null>(null);

  const canCreatePolicy = Boolean(
    user?.isSuperAdmin || user?.role === 'admin' || user?.permissions?.canManagePolicies
  );

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const data = await adminApi.fetchPolicies({ status: 'published' });
        if (Array.isArray(data) && data.length > 0) {
          setPolicies(data);
        }
      } catch (err) {
        console.error('Failed to load policies page data:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetchPolicies();
  }, []);

  const filteredPolicies = policies.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = ['All', 'Academic', 'Administrative', 'IT & Security', 'Campus & Hostel', 'Research'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Banner Header */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-navy-50 text-navy-800 text-xs font-bold mb-3 border border-navy-200">
            <BookOpen className="w-4 h-4 text-violet-600" />
            <span>Official University Policy & Governance Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">University Policies & Statutes</h1>
          <p className="text-navy-500 text-sm mt-1 max-w-2xl">
            Access official university statutes, academic regulations, information security frameworks, and governance policies.
          </p>
        </div>

        {canCreatePolicy && onOpenCreatePolicy && (
          <button
            onClick={onOpenCreatePolicy}
            className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all shrink-0 self-start md:self-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Policy</span>
          </button>
        )}
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
              placeholder="Search policies & statutes..."
              className="w-full pl-9 pr-3 py-1.5 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-900 focus:outline-none focus:bg-white focus:border-navy-800"
            />
          </div>
        </div>
      </div>

      {/* Grid of Policies */}
      {loading ? (
        <div className="p-12 text-center text-sm font-semibold text-navy-500">
          Loading policy documents…
        </div>
      ) : filteredPolicies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy-100 p-12 text-center space-y-2">
          <BookOpen className="mx-auto h-8 w-8 text-navy-300" />
          <h3 className="text-base font-bold text-navy-900">No policies found</h3>
          <p className="text-xs text-navy-500">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPolicies.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPolicy(p)}
              className="group cursor-pointer rounded-xl border border-[#e5ebf5] bg-white p-4 shadow-[0_3px_10px_rgba(15,35,75,0.035)] transition hover:-translate-y-px hover:border-navy-200 hover:shadow-[0_7px_16px_rgba(15,35,75,0.06)] flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-navy-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-navy-800 border border-navy-200/60">
                    {p.category}
                  </span>
                  {p.version && (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                      v{p.version}
                    </span>
                  )}
                </div>

                <h3 className="text-[13px] font-extrabold text-navy-950 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {p.title}
                </h3>

                <p className="text-[11px] text-navy-600 leading-snug line-clamp-3">
                  {p.summary || p.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-navy-100 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-medium text-navy-400">
                  <Calendar className="h-3 w-3" /> Effective {p.effectiveDate || 'Immediately'}
                </span>

                {p.attachmentUrl && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                    <Paperclip className="h-3 w-3" /> Document
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Policy Detail Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-navy-800 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  {selectedPolicy.category}
                </span>
                {selectedPolicy.version && (
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                    Version {selectedPolicy.version}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className="rounded-full p-1.5 text-navy-400 hover:bg-navy-100 hover:text-navy-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold text-navy-950">
                {selectedPolicy.title}
              </h3>
              <p className="text-xs font-semibold text-navy-500">
                Effective Date: {selectedPolicy.effectiveDate || 'Immediately'} · Status: Published
              </p>
            </div>

            {selectedPolicy.summary && (
              <div className="rounded-xl bg-navy-50/70 border border-navy-100 p-3 text-xs font-semibold text-navy-900">
                {selectedPolicy.summary}
              </div>
            )}

            <div className="rounded-xl bg-navy-50/40 border border-navy-100 p-4 text-xs sm:text-sm font-medium leading-relaxed text-navy-800 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedPolicy.content}
            </div>

            {selectedPolicy.attachmentUrl && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-navy-950 truncate">
                      {selectedPolicy.attachmentName || 'Official Policy Document'}
                    </p>
                    {selectedPolicy.attachmentSize && (
                      <p className="text-[10px] font-medium text-navy-500">
                        Size: {selectedPolicy.attachmentSize}
                      </p>
                    )}
                  </div>
                </div>
                <a
                  href={selectedPolicy.attachmentUrl}
                  download={selectedPolicy.attachmentName || 'policy-document'}
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
                onClick={() => setSelectedPolicy(null)}
                className="rounded-xl bg-navy-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-navy-800 transition"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
