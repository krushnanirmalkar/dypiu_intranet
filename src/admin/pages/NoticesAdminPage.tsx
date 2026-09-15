import React, { useEffect, useState } from 'react';
import {
  Archive,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Megaphone,
  Paperclip,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type {
  AdminNotice,
  NoticeAudience,
  NoticeCategory,
  NoticePriority,
  NoticeStatus,
} from '../types/admin';
import { adminApi } from '../services/adminApi';

interface NoticesAdminPageProps {
  initialOpenCreate?: boolean;
}

export const NoticesAdminPage: React.FC<NoticesAdminPageProps> = ({ initialOpenCreate = false }) => {
  const [notices, setNotices] = useState<AdminNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedAudience, setSelectedAudience] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(initialOpenCreate);
  const [editingNotice, setEditingNotice] = useState<AdminNotice | null>(null);
  const [previewNotice, setPreviewNotice] = useState<AdminNotice | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('Academic');
  const [audience, setAudience] = useState<NoticeAudience>('All');
  const [priority, setPriority] = useState<NoticePriority>('Medium');
  const [status, setStatus] = useState<NoticeStatus>('published');

  // TTL & Attachment fields
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentSize, setAttachmentSize] = useState('');
  const [ttlOption, setTtlOption] = useState<'never' | '7' | '30' | '90' | 'custom'>('never');
  const [customExpiryDate, setCustomExpiryDate] = useState('');

  const loadNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.fetchNotices();
      setNotices(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load notices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotices();
  }, []);

  const openCreateModal = () => {
    setEditingNotice(null);
    setTitle('');
    setContent('');
    setCategory('Academic');
    setAudience('All');
    setPriority('Medium');
    setStatus('published');
    setAttachmentUrl('');
    setAttachmentName('');
    setAttachmentSize('');
    setTtlOption('never');
    setCustomExpiryDate('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (n: AdminNotice) => {
    setEditingNotice(n);
    setTitle(n.title);
    setContent(n.content);
    setCategory(n.category);
    setAudience(n.audience);
    setPriority(n.priority);
    setStatus(n.status);
    setAttachmentUrl(n.attachmentUrl || '');
    setAttachmentName(n.attachmentName || '');
    setAttachmentSize(n.attachmentSize || '');

    if (!n.expiresAt) {
      setTtlOption('never');
      setCustomExpiryDate('');
    } else {
      setTtlOption('custom');
      setCustomExpiryDate(new Date(n.expiresAt).toISOString().split('T')[0]);
    }

    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setFormError('Attachment file size must be under 8MB.');
      return;
    }

    let formattedSize = '';
    if (file.size < 1024 * 1024) {
      formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
    } else {
      formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachmentUrl(reader.result);
        setAttachmentName(file.name);
        setAttachmentSize(formattedSize);
        setFormError(null);
      }
    };
    reader.onerror = () => {
      setFormError('Failed to read selected file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    setAttachmentUrl('');
    setAttachmentName('');
    setAttachmentSize('');
  };

  const calculateExpiresAt = (): string | null => {
    if (ttlOption === 'never') return null;
    const now = Date.now();
    if (ttlOption === '7') return new Date(now + 7 * 86400000).toISOString();
    if (ttlOption === '30') return new Date(now + 30 * 86400000).toISOString();
    if (ttlOption === '90') return new Date(now + 90 * 86400000).toISOString();
    if (ttlOption === 'custom' && customExpiryDate) {
      return new Date(`${customExpiryDate}T23:59:59.999Z`).toISOString();
    }
    return null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Notice title is required.');
      return;
    }
    if (!content.trim()) {
      setFormError('Notice content is required.');
      return;
    }

    setSaving(true);
    setFormError(null);

    const calculatedExpiry = calculateExpiresAt();

    try {
      if (editingNotice) {
        await adminApi.updateNotice(editingNotice.id, {
          title: title.trim(),
          content: content.trim(),
          category,
          audience,
          priority,
          status,
          expiresAt: calculatedExpiry,
          attachmentUrl: attachmentUrl.trim() || null,
          attachmentName: attachmentName.trim() || null,
          attachmentSize: attachmentSize.trim() || null,
        });
      } else {
        await adminApi.createNotice({
          title: title.trim(),
          content: content.trim(),
          category,
          audience,
          priority,
          status,
          expiresAt: calculatedExpiry,
          attachmentUrl: attachmentUrl.trim() || null,
          attachmentName: attachmentName.trim() || null,
          attachmentSize: attachmentSize.trim() || null,
        });
      }

      setIsModalOpen(false);
      void loadNotices();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save notice.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (notice: AdminNotice) => {
    const nextStatus: NoticeStatus = notice.status === 'published' ? 'draft' : 'published';
    try {
      await adminApi.updateNotice(notice.id, { status: nextStatus });
      void loadNotices();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteNotice(id);
      setDeleteConfirmId(null);
      void loadNotices();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const filteredNotices = notices.filter((n) => {
    if (selectedCategory !== 'ALL' && n.category !== selectedCategory) return false;
    if (selectedAudience !== 'ALL' && n.audience !== selectedAudience) return false;
    if (selectedStatus !== 'ALL' && n.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.createdBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getExpiryLabel = (n: AdminNotice) => {
    if (!n.expiresAt) return { text: 'No Expiry (Permanent)', isExpired: false };
    const expTime = new Date(n.expiresAt).getTime();
    if (isNaN(expTime)) return { text: 'No Expiry', isExpired: false };

    const isExpired = expTime <= Date.now();
    const formattedDate = new Date(n.expiresAt).toLocaleDateString();
    return {
      text: isExpired ? `Expired on ${formattedDate}` : `Expires: ${formattedDate}`,
      isExpired,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy-950 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-blue-600" /> Notice Management
          </h1>
          <p className="mt-1 text-xs text-navy-500 font-medium">
            Publish, update, and manage official university notices with document attachments and TTL expiry dates.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition"
        >
          <Plus className="h-4 w-4" /> Create Notice
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notice titles, content, authors..."
            className="w-full rounded-xl border border-navy-200 bg-navy-50/50 py-2 pl-9 pr-3 text-xs font-medium text-navy-950 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-800 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Administrative">Administrative</option>
            <option value="Campus">Campus</option>
            <option value="Urgent">Urgent</option>
          </select>

          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-800 focus:outline-none"
          >
            <option value="ALL">All Audiences</option>
            <option value="All">Target: All</option>
            <option value="Students">Target: Students</option>
            <option value="Staff">Target: Staff</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-800 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Main Notice Table */}
      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs font-semibold text-navy-500">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-blue-600 mb-2" />
            Loading notices...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs font-bold text-red-700">{error}</div>
        ) : filteredNotices.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-navy-500">
            No notices found matching the filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-navy-100 bg-navy-50/70 text-navy-700 uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Title & Attachment</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Audience</th>
                  <th className="px-4 py-3.5">Status & TTL Expiry</th>
                  <th className="px-4 py-3.5">Created</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filteredNotices.map((n) => {
                  const expiry = getExpiryLabel(n);
                  return (
                    <tr key={n.id} className="hover:bg-navy-50/40 transition">
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="flex items-center gap-1.5 font-bold text-navy-950 truncate">
                          <span className="truncate">{n.title}</span>
                          {n.attachmentUrl && (
                            <span className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 shrink-0" title={`Attached Document: ${n.attachmentName || 'Document'}${n.attachmentSize ? ` (${n.attachmentSize})` : ''}`}>
                              <Paperclip className="h-3 w-3" /> {n.attachmentSize ? `Doc (${n.attachmentSize})` : 'Doc'}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-navy-500 truncate">{n.content}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 font-bold text-blue-700">
                          {n.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-navy-800">{n.audience}</td>
                      <td className="px-4 py-3.5 space-y-1">
                        <div>
                          <button
                            onClick={() => void handleToggleStatus(n)}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                              n.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                            title="Click to toggle published / draft"
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${n.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span className="capitalize">{n.status}</span>
                          </button>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold ${
                              expiry.isExpired
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : n.expiresAt
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-navy-400 font-medium'
                            }`}
                          >
                            <Clock className="h-2.5 w-2.5" />
                            {expiry.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-navy-600">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewNotice(n)}
                            className="p-1.5 rounded-lg text-navy-600 hover:bg-navy-100 hover:text-navy-950 transition"
                            title="Preview notice"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(n)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Edit notice"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(n.id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                            title="Delete notice"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
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
              <label className="block text-xs font-bold text-navy-900 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notice title..."
                className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-semibold text-navy-950 focus:border-blue-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Content Body</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Write full notice description..."
                className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-medium text-navy-950 focus:border-blue-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            {/* Document Attachment File Upload */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Paperclip className="h-4 w-4 text-blue-600" />
                  <span>Document Attachment Option</span>
                </div>
                {attachmentUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Remove Attachment
                  </button>
                )}
              </div>

              {attachmentUrl ? (
                <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-white p-3 shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-navy-950 truncate">
                        {attachmentName || 'Attached Document'}
                      </p>
                      <p className="text-[10px] font-medium text-navy-500">
                        {attachmentSize ? `Size: ${attachmentSize}` : 'Document attached'}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    Attached
                  </span>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl p-4 bg-white hover:bg-blue-50/50 cursor-pointer transition text-center">
                  <Upload className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-navy-900">Upload Document / File</span>
                  <span className="text-[10px] text-navy-500 font-medium mt-0.5">
                    Click to select PDF, DOC, DOCX, PNG, JPG, or TXT (Max 8MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* TTL Expiry Settings */}
            <div className="rounded-xl border border-navy-100 bg-navy-50/50 p-3.5 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-navy-900">
                <Clock className="h-4 w-4 text-navy-600" />
                <span>Notice TTL Expiry Settings</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-navy-900 mb-1">Expiry TTL Preset</label>
                  <select
                    value={ttlOption}
                    onChange={(e) => setTtlOption(e.target.value as 'never' | '7' | '30' | '90' | 'custom')}
                    className="w-full rounded-xl border border-navy-200 bg-white p-2 text-xs font-semibold text-navy-950 focus:outline-none"
                  >
                    <option value="never">No Expiry (Permanent Notice)</option>
                    <option value="7">Expire in 7 Days</option>
                    <option value="30">Expire in 30 Days</option>
                    <option value="90">Expire in 90 Days</option>
                    <option value="custom">Custom Expiry Date</option>
                  </select>
                </div>

                {ttlOption === 'custom' && (
                  <div>
                    <label className="block text-[11px] font-bold text-navy-900 mb-1">Select Custom Expiry Date</label>
                    <input
                      type="date"
                      value={customExpiryDate}
                      onChange={(e) => setCustomExpiryDate(e.target.value)}
                      className="w-full rounded-xl border border-navy-200 bg-white p-2 text-xs font-semibold text-navy-950 focus:outline-none"
                      required={ttlOption === 'custom'}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                  className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Campus">Campus</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as NoticeAudience)}
                  className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                >
                  <option value="All">All (Students & Staff)</option>
                  <option value="Students">Students Only</option>
                  <option value="Staff">Staff Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NoticePriority)}
                  className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as NoticeStatus)}
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
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingNotice ? 'Update Notice' : 'Publish Notice'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview Modal */}
      {previewNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                Notice Preview
              </span>
              <button
                onClick={() => setPreviewNotice(null)}
                className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="text-lg font-black text-navy-950">{previewNotice.title}</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-navy-500">
              <span>Target: {previewNotice.audience}</span>
              <span>·</span>
              <span>Category: {previewNotice.category}</span>
              <span>·</span>
              <span>By {previewNotice.author}</span>
            </div>

            <div className="rounded-xl bg-navy-50 p-4 text-xs leading-relaxed text-navy-800 whitespace-pre-wrap">
              {previewNotice.content}
            </div>

            {/* Document Attachment Download Box */}
            {previewNotice.attachmentUrl && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-navy-950 truncate">
                      {previewNotice.attachmentName || 'Attached Document'}
                    </p>
                    {previewNotice.attachmentSize && (
                      <p className="text-[10px] font-medium text-navy-500">
                        {previewNotice.attachmentSize}
                      </p>
                    )}
                  </div>
                </div>
                <a
                  href={previewNotice.attachmentUrl}
                  download={previewNotice.attachmentName || 'notice-attachment'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  View Attachment <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-navy-100 text-xs text-navy-500">
              <span>{getExpiryLabel(previewNotice).text}</span>
              <button
                onClick={() => setPreviewNotice(null)}
                className="rounded-xl bg-navy-900 px-4 py-2 font-bold text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Archive className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-navy-950">Delete Notice?</h3>
            <p className="text-xs text-navy-600 font-medium">
              Are you sure you want to delete this notice? This action will generate an audit log entry.
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
