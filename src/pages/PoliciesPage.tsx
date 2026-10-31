import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, ExternalLink, FileText, Paperclip, Plus, Search, X, ArrowLeft } from 'lucide-react';
import type { AdminPolicy } from '../admin/types/admin';
import type { UserProfile } from '../types';
import { adminApi } from '../admin/services/adminApi';

interface PoliciesPageProps {
  user?: UserProfile | null;
  onOpenCreatePolicy?: () => void;
  onBack?: () => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ user, onOpenCreatePolicy, onBack }) => {
  const [policies, setPolicies] = useState<AdminPolicy[]>([]);
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
        const data = await adminApi.fetchPublishedPolicies();
        setPolicies(data);
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
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#00afef]/10 text-[#00afef] text-[11px] font-extrabold uppercase tracking-wider border border-[#00afef]/20">
              <BookOpen className="w-3 h-3 text-[#00afef]" />
              <span>Governance & Statutes</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#393678] font-serif-custom tracking-tight">
            University Policies & Statutes
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Access official university statutes, academic regulations, information security frameworks, and institutional directives.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canCreatePolicy && onOpenCreatePolicy && (
            <button
              onClick={onOpenCreatePolicy}
              className="flex items-center gap-2 rounded-xl bg-[#00afef] hover:bg-[#0092c7] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Policy</span>
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
            placeholder="Search policies & statutes..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F1F1F7] hover:bg-[#E6E6F0] focus:bg-white border border-transparent focus:border-[#393678] rounded-full text-xs text-slate-700 outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid of Policies */}
      {loading ? (
        <div className="p-12 text-center text-sm font-semibold text-slate-500 bg-white rounded-2xl border border-slate-200/80">
          Loading policy documents…
        </div>
      ) : filteredPolicies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-2 shadow-xs">
          <BookOpen className="mx-auto h-8 w-8 text-slate-300" />
          <h3 className="text-base font-bold text-[#393678]">No policies found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPolicies.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPolicy(p)}
              className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-[#393678]/10 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-[#393678] border border-[#393678]/20">
                    {p.category}
                  </span>
                  {p.version && (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                      v{p.version}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#393678] group-hover:text-[#00afef] transition-colors line-clamp-2 leading-snug">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {p.summary || p.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <Calendar className="h-3 w-3" /> Effective {p.effectiveDate || 'Immediately'}
                </span>

                {p.attachmentUrl && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#00afef]/10 px-2 py-0.5 text-[10px] font-bold text-[#00afef] border border-[#00afef]/20">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs select-none">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#393678] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
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
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-[#393678] leading-snug">
                {selectedPolicy.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Effective Date: {selectedPolicy.effectiveDate || 'Immediately'} · Status: Published
              </p>
            </div>

            {selectedPolicy.summary && (
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-xs font-semibold text-slate-800">
                {selectedPolicy.summary}
              </div>
            )}

            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-xs sm:text-sm font-medium leading-relaxed text-slate-700 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedPolicy.content}
            </div>

            {selectedPolicy.attachmentUrl && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00afef] text-white">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#393678] truncate">
                      {selectedPolicy.attachmentName || 'Official Policy Document'}
                    </p>
                    {selectedPolicy.attachmentSize && (
                      <p className="text-[10px] font-medium text-slate-500">
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
                  className="flex shrink-0 items-center gap-1 rounded-xl bg-[#00afef] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0092c7] transition shadow-xs"
                >
                  View / Download <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className="rounded-xl bg-[#0A1328] hover:bg-[#152347] px-5 py-2.5 text-xs font-bold text-white transition cursor-pointer"
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
