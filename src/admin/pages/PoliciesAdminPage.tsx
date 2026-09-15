import React, { useEffect, useState } from 'react';
import {
  Archive,
  BookOpen,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import type { AdminPolicy, PolicyCategory, PolicyStatus } from '../types/admin';
import { adminApi } from '../services/adminApi';

interface PoliciesAdminPageProps {
  initialOpenCreate?: boolean;
}

export const PoliciesAdminPage: React.FC<PoliciesAdminPageProps> = ({ initialOpenCreate = false }) => {
  const [policies, setPolicies] = useState<AdminPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(initialOpenCreate);
  const [editingPolicy, setEditingPolicy] = useState<AdminPolicy | null>(null);
  const [previewPolicy, setPreviewPolicy] = useState<AdminPolicy | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PolicyCategory>('Administrative');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('1.0');
  const [status, setStatus] = useState<PolicyStatus>('published');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  const loadPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.fetchPolicies();
      setPolicies(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load policies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPolicies();
  }, []);

  const openCreateModal = () => {
    setEditingPolicy(null);
    setTitle('');
    setCategory('Administrative');
    setSummary('');
    setContent('');
    setVersion('1.0');
    setStatus('published');
    setEffectiveDate(new Date().toISOString().split('T')[0]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: AdminPolicy) => {
    setEditingPolicy(p);
    setTitle(p.title);
    setCategory(p.category);
    setSummary(p.summary || '');
    setContent(p.content || '');
    setVersion(p.version || '1.0');
    setStatus(p.status);
    setEffectiveDate(p.effectiveDate || new Date().toISOString().split('T')[0]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Policy title is required.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (editingPolicy) {
        await adminApi.updatePolicy(editingPolicy.id, {
          title: title.trim(),
          category,
          summary: summary.trim(),
          content: content.trim(),
          version: version.trim() || '1.0',
          status,
          effectiveDate,
        });
      } else {
        await adminApi.createPolicy({
          title: title.trim(),
          category,
          summary: summary.trim(),
          content: content.trim(),
          version: version.trim() || '1.0',
          status,
          effectiveDate,
        });
      }

      setIsModalOpen(false);
      void loadPolicies();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save policy.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (policy: AdminPolicy) => {
    const nextStatus: PolicyStatus = policy.status === 'published' ? 'draft' : 'published';
    try {
      await adminApi.updatePolicy(policy.id, { status: nextStatus });
      void loadPolicies();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Status toggle failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deletePolicy(id);
      setDeleteConfirmId(null);
      void loadPolicies();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const filteredPolicies = policies.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.version.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy-950 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-600" /> University Policy Management
          </h1>
          <p className="mt-1 text-xs text-navy-500 font-medium">
            Draft, version, publish, and maintain official DYPIU academic, administrative, and security governance frameworks.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-violet-700 shadow-sm transition"
        >
          <Plus className="h-4 w-4" /> Create Policy
        </button>
      </div>

      {/* Search and Filter */}
      <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search policies by title, summary, version..."
            className="w-full rounded-xl border border-navy-200 bg-navy-50/50 py-2 pl-9 pr-3 text-xs font-medium text-navy-950 focus:border-violet-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-800 focus:outline-none"
        >
          <option value="ALL">All Policy Categories</option>
          <option value="Academic">Academic</option>
          <option value="Administrative">Administrative</option>
          <option value="IT & Security">IT & Security</option>
          <option value="Campus & Hostel">Campus & Hostel</option>
          <option value="Research">Research</option>
        </select>
      </div>

      {/* Policies Table */}
      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs font-semibold text-navy-500">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-violet-600 mb-2" />
            Loading policies...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs font-bold text-red-700">{error}</div>
        ) : filteredPolicies.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-navy-500">
            No policies found matching search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-navy-100 bg-navy-50/70 text-navy-700 uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Policy Title</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Version</th>
                  <th className="px-4 py-3.5">Effective Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filteredPolicies.map((p) => (
                  <tr key={p.id} className="hover:bg-navy-50/40 transition">
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="font-bold text-navy-950 truncate">{p.title}</div>
                      <div className="text-[10px] text-navy-500 truncate">{p.summary}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block rounded-md bg-violet-50 px-2 py-0.5 font-bold text-violet-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-extrabold text-navy-800">
                      v{p.version}
                    </td>
                    <td className="px-4 py-3.5 text-navy-600">{p.effectiveDate}</td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => void handleToggleStatus(p)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                          p.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${p.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="capitalize">{p.status}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewPolicy(p)}
                          className="p-1.5 rounded-lg text-navy-600 hover:bg-navy-100 transition"
                          title="View policy text"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit policy"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Archive policy"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSave}
            className="w-full max-w-xl rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <h2 className="text-base font-black text-navy-950">
                {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{formError}</div>
            )}

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Policy Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. DYPIU Information Security Governance"
                className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-semibold text-navy-950 focus:border-violet-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PolicyCategory)}
                  className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Administrative">Administrative</option>
                  <option value="IT & Security">IT & Security</option>
                  <option value="Campus & Hostel">Campus & Hostel</option>
                  <option value="Research">Research</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0"
                  className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-mono font-bold text-navy-950 focus:border-violet-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Policy Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="Short summary of governance guidelines..."
                className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-medium text-navy-950 focus:border-violet-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Full Policy Document Text</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Full text of policy rules..."
                className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-medium text-navy-950 focus:border-violet-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Effective Date</label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PolicyStatus)}
                  className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-navy-600 hover:text-navy-950"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-bold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingPolicy ? 'Update Policy' : 'Publish Policy'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview Modal */}
      {previewPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <span className="inline-block rounded-md bg-violet-50 px-2 py-0.5 text-xs font-bold text-violet-700">
                Policy Document (v{previewPolicy.version})
              </span>
              <button
                onClick={() => setPreviewPolicy(null)}
                className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="text-lg font-black text-navy-950">{previewPolicy.title}</h3>
            <p className="text-xs font-semibold text-navy-500">
              Category: {previewPolicy.category} · Effective: {previewPolicy.effectiveDate}
            </p>
            <p className="text-xs font-medium text-navy-700 italic bg-navy-50 p-2.5 rounded-lg border border-navy-100">
              {previewPolicy.summary}
            </p>

            <div className="rounded-xl bg-white border border-navy-100 p-4 text-xs leading-relaxed text-navy-800 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {previewPolicy.content}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewPolicy(null)}
                className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Archive className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-navy-950">Archive Policy?</h3>
            <p className="text-xs text-navy-600 font-medium">
              Are you sure you want to delete/archive this policy document? This action will log an audit event.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-navy-200 bg-white px-4 py-2 text-xs font-bold text-navy-800"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleDelete(deleteConfirmId)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Archive Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
