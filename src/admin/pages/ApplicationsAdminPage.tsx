import React, { useEffect, useState } from 'react';
import {
  Archive,
  ExternalLink,
  Grid2X2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import type { AdminApplication } from '../types/admin';
import { adminApi } from '../services/adminApi';

interface ApplicationsAdminPageProps {
  initialOpenCreate?: boolean;
}

const isValidSafeUrlClient = (urlStr: string): boolean => {
  if (!urlStr || !urlStr.trim()) return false;
  const trimmed = urlStr.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return false;
  }
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return urlStr.startsWith('/') && !urlStr.startsWith('//');
  }
};

export const ApplicationsAdminPage: React.FC<ApplicationsAdminPageProps> = ({ initialOpenCreate = false }) => {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(initialOpenCreate);
  const [editingApp, setEditingApp] = useState<AdminApplication | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('LayoutDashboard');
  const [category, setCategory] = useState('Productivity');
  const [roles, setRoles] = useState<string[]>(['student', 'staff', 'admin']);
  const [enabled, setEnabled] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [ssoEnabled, setSsoEnabled] = useState(true);

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.fetchApplications();
      setApplications(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  const openCreateModal = () => {
    setEditingApp(null);
    setName('');
    setShortName('');
    setDescription('');
    setUrl('');
    setIcon('LayoutDashboard');
    setCategory('Productivity');
    setRoles(['student', 'staff', 'admin']);
    setEnabled(true);
    setDisplayOrder(applications.length + 1);
    setSsoEnabled(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (appItem: AdminApplication) => {
    setEditingApp(appItem);
    setName(appItem.name);
    setShortName(appItem.shortName || appItem.name);
    setDescription(appItem.description || '');
    setUrl(appItem.url);
    setIcon(appItem.icon || 'LayoutDashboard');
    setCategory(appItem.category || 'Productivity');
    setRoles(Array.isArray(appItem.roles) ? appItem.roles : ['student', 'staff', 'admin']);
    setEnabled(appItem.enabled !== false);
    setDisplayOrder(appItem.displayOrder || 1);
    setSsoEnabled(appItem.ssoEnabled !== false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleToggleRole = (r: string) => {
    setRoles((prev) => (prev.includes(r) ? prev.filter((item) => item !== r) : [...prev, r]));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Application name is required.');
      return;
    }
    if (!isValidSafeUrlClient(url)) {
      setFormError('Unsafe or invalid URL. Standard http(s):// or relative paths required.');
      return;
    }
    if (roles.length === 0) {
      setFormError('At least one role must be selected.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (editingApp) {
        await adminApi.updateApplication(editingApp.id, {
          name: name.trim(),
          shortName: shortName.trim() || name.trim(),
          description: description.trim(),
          url: url.trim(),
          icon,
          category,
          roles,
          enabled,
          displayOrder,
          ssoEnabled,
        });
      } else {
        await adminApi.createApplication({
          name: name.trim(),
          shortName: shortName.trim() || name.trim(),
          description: description.trim(),
          url: url.trim(),
          icon,
          category,
          roles,
          enabled,
          displayOrder,
          ssoEnabled,
        });
      }

      setIsModalOpen(false);
      void loadApplications();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save application.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnable = async (appItem: AdminApplication) => {
    try {
      await adminApi.updateApplication(appItem.id, { enabled: !appItem.enabled });
      void loadApplications();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Toggle failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteApplication(id);
      setDeleteConfirmId(null);
      void loadApplications();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const filteredApps = applications.filter((appItem) => {
    if (selectedCategory !== 'ALL' && appItem.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        appItem.name.toLowerCase().includes(q) ||
        appItem.description.toLowerCase().includes(q) ||
        appItem.url.toLowerCase().includes(q)
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
            <Grid2X2 className="h-5 w-5 text-amber-600" /> Application Management
          </h1>
          <p className="mt-1 text-xs text-navy-500 font-medium">
            Configure campus applications, role-based visibility, SSO endpoints, and display orders.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-700 shadow-sm transition"
        >
          <Plus className="h-4 w-4" /> Add Application
        </button>
      </div>

      {/* Filter and Search */}
      <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applications by name, description, URL..."
            className="w-full rounded-xl border border-navy-200 bg-navy-50/50 py-2 pl-9 pr-3 text-xs font-medium text-navy-950 focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-800 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="Academic">Academic</option>
          <option value="Administration">Administration</option>
          <option value="Staff Services">Staff Services</option>
          <option value="Productivity">Productivity</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs font-semibold text-navy-500">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-amber-600 mb-2" />
            Loading applications...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs font-bold text-red-700">{error}</div>
        ) : filteredApps.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-navy-500">
            No applications found matching search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-navy-100 bg-navy-50/70 text-navy-700 uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Application</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">URL Target</th>
                  <th className="px-4 py-3.5">Allowed Roles</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filteredApps.map((appItem) => (
                  <tr key={appItem.id} className="hover:bg-navy-50/40 transition">
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-800 font-bold text-xs">
                          {appItem.shortName ? appItem.shortName.charAt(0) : appItem.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-navy-950 truncate">{appItem.name}</div>
                          <div className="text-[10px] text-navy-500 truncate">{appItem.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-700">
                        {appItem.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <a
                        href={appItem.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 hover:underline truncate max-w-[200px]"
                      >
                        <span className="truncate">{appItem.url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {appItem.roles.map((r) => (
                          <span
                            key={r}
                            className="rounded bg-navy-100 px-1.5 py-0.5 text-[10px] font-bold text-navy-800 uppercase"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => void handleToggleEnable(appItem)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                          appItem.enabled
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                        title="Click to toggle enabled status"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${appItem.enabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>{appItem.enabled ? 'Enabled' : 'Disabled'}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(appItem)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit application"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(appItem.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Delete application"
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
                {editingApp ? 'Edit Application' : 'Add New Application'}
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Application Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Juno ERP"
                  className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-semibold text-navy-950 focus:border-amber-500 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Short Name</label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="e.g. Juno"
                  className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-semibold text-navy-950 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of service..."
                className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-medium text-navy-950 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Destination URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://erp.dypiu.ac.in"
                className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-mono text-navy-950 focus:border-amber-500 focus:bg-white focus:outline-none"
                required
              />
              <p className="mt-1 text-[10px] text-navy-500">Must be valid http(s) URL. Unsafe protocols (javascript:) are blocked.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Administration">Administration</option>
                  <option value="Staff Services">Staff Services</option>
                  <option value="Productivity">Productivity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Icon Identifier</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="GraduationCap, LayoutDashboard, Share2..."
                  className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-mono text-navy-950 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Allowed Roles (Visibility Filter)</label>
              <div className="flex items-center gap-4 pt-1">
                {['student', 'staff', 'admin'].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-navy-950 capitalize">
                    <input
                      type="checkbox"
                      checked={roles.includes(r)}
                      onChange={() => handleToggleRole(r)}
                      className="rounded border-navy-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2 border-t border-navy-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-950">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="rounded border-navy-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Application Enabled</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-950">
                <input
                  type="checkbox"
                  checked={ssoEnabled}
                  onChange={(e) => setSsoEnabled(e.target.checked)}
                  className="rounded border-navy-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Keycloak SSO Enabled</span>
              </label>
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
                className="rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingApp ? 'Update Application' : 'Add Application'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Archive className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-navy-950">Delete Application?</h3>
            <p className="text-xs text-navy-600 font-medium">
              Are you sure you want to remove this application? This action will generate an audit log entry.
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
