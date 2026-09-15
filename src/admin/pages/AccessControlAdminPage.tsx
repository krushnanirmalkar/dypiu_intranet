import React, { useEffect, useState } from 'react';
import {
  Check,
  Key,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import type {
  AccessLevel,
  AccessRule,
  AccessRuleService,
  AccessRuleStatus,
  AccessRuleTargetType,
} from '../types/admin';
import { adminApi } from '../services/adminApi';

interface AccessControlAdminPageProps {
  initialOpenCreate?: boolean;
}

export const AccessControlAdminPage: React.FC<AccessControlAdminPageProps> = ({ initialOpenCreate = false }) => {
  const [rules, setRules] = useState<AccessRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedTargetType, setSelectedTargetType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(initialOpenCreate);
  const [editingRule, setEditingRule] = useState<AccessRule | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [targetType, setTargetType] = useState<AccessRuleTargetType>('email');
  const [targetValue, setTargetValue] = useState('');
  const [services, setServices] = useState<AccessRuleService[]>(['notices', 'policies']);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('write');
  const [status, setStatus] = useState<AccessRuleStatus>('active');

  const loadAccessRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.fetchAccessRules();
      setRules(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load access rules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAccessRules();
  }, []);

  const openCreateModal = () => {
    setEditingRule(null);
    setName('');
    setTargetType('email');
    setTargetValue('');
    setServices(['notices', 'policies']);
    setAccessLevel('write');
    setStatus('active');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: AccessRule) => {
    setEditingRule(rule);
    setName(rule.name);
    setTargetType(rule.targetType);
    setTargetValue(rule.targetValue);
    setServices(rule.services || []);
    setAccessLevel(rule.accessLevel);
    setStatus(rule.status);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleToggleService = (service: AccessRuleService) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Rule name is required.');
      return;
    }
    if (!targetValue.trim()) {
      setFormError('Target role or Gmail/email address is required.');
      return;
    }
    if (services.length === 0) {
      setFormError('Select at least one service to grant access.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (editingRule) {
        await adminApi.updateAccessRule(editingRule.id, {
          name: name.trim(),
          targetType,
          targetValue: targetValue.trim(),
          services,
          accessLevel,
          status,
        });
      } else {
        await adminApi.createAccessRule({
          name: name.trim(),
          targetType,
          targetValue: targetValue.trim(),
          services,
          accessLevel,
          status,
        });
      }

      setIsModalOpen(false);
      void loadAccessRules();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save access rule.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (rule: AccessRule) => {
    const nextStatus: AccessRuleStatus = rule.status === 'active' ? 'disabled' : 'active';
    try {
      await adminApi.updateAccessRule(rule.id, { status: nextStatus });
      void loadAccessRules();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Status toggle failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteAccessRule(id);
      setDeleteConfirmId(null);
      void loadAccessRules();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const filteredRules = rules.filter((r) => {
    if (selectedTargetType !== 'ALL' && r.targetType !== selectedTargetType) return false;
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.targetValue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalEmailRules = rules.filter((r) => r.targetType === 'email').length;
  const totalRoleRules = rules.filter((r) => r.targetType === 'role').length;
  const activeCount = rules.filter((r) => r.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-navy-950 flex items-center gap-2">
            <Key className="h-5 w-5 text-indigo-600" /> Role & Gmail Access Control
          </h1>
          <p className="mt-1 text-xs text-navy-500 font-medium">
            Grant granular role-based or individual Gmail access permissions to services like Notice Board, University Policies, Applications, and Audit Logs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm transition"
        >
          <Plus className="h-4 w-4" /> Add Access Rule
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-navy-400">Total Rules</p>
            <p className="text-xl font-black text-navy-950">{rules.length}</p>
            <p className="text-[11px] font-semibold text-emerald-600">{activeCount} Active Rules</p>
          </div>
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-navy-400">Gmail / Email Rules</p>
            <p className="text-xl font-black text-navy-950">{totalEmailRules}</p>
            <p className="text-[11px] font-medium text-navy-500">Specific email accounts</p>
          </div>
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-navy-400">Role-Based Rules</p>
            <p className="text-xl font-black text-navy-950">{totalRoleRules}</p>
            <p className="text-[11px] font-medium text-navy-500">Staff, Student, Admin roles</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => void loadAccessRules()} className="underline text-red-800">Retry</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by rule name, Gmail, or role value..."
            className="w-full rounded-xl border border-navy-200 bg-navy-50/50 py-2 pl-9 pr-3 text-xs font-medium text-navy-950 focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTargetType}
            onChange={(e) => setSelectedTargetType(e.target.value)}
            className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-800 focus:outline-none"
          >
            <option value="ALL">All Target Types</option>
            <option value="email">Gmail / Email Specific</option>
            <option value="role">Role-Based</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-800 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>

          <button
            onClick={() => void loadAccessRules()}
            className="p-2 rounded-xl border border-navy-200 bg-white text-navy-600 hover:bg-navy-50"
            title="Reload rules"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Rules Table */}
      {loading ? (
        <div className="rounded-2xl border border-navy-100 bg-white p-12 text-center text-xs font-semibold text-navy-500">
          Loading access rules…
        </div>
      ) : filteredRules.length === 0 ? (
        <div className="rounded-2xl border border-navy-100 bg-white p-12 text-center space-y-2">
          <Key className="mx-auto h-8 w-8 text-navy-300" />
          <h3 className="text-sm font-bold text-navy-950">No access rules found</h3>
          <p className="text-xs text-navy-500">Create a rule or adjust your search filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-navy-100 bg-navy-50/60 font-extrabold uppercase text-navy-600">
                <tr>
                  <th className="p-3.5 pl-4">Rule & Target</th>
                  <th className="p-3.5">Target Value</th>
                  <th className="p-3.5">Services Granted</th>
                  <th className="p-3.5">Access Level</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 font-medium text-navy-900">
                {filteredRules.map((r) => (
                  <tr key={r.id} className="hover:bg-navy-50/40 transition-colors">
                    <td className="p-3.5 pl-4">
                      <div className="font-bold text-navy-950">{r.name}</div>
                      <span className={`inline-block mt-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        r.targetType === 'email' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {r.targetType === 'email' ? 'Gmail / Email' : 'Role-Based'}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-xs font-bold text-indigo-900">
                      {r.targetValue}
                    </td>

                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {(r.services || []).map((srv) => (
                          <span
                            key={srv}
                            className="rounded-md bg-navy-100 px-2 py-0.5 text-[10px] font-bold capitalize text-navy-800"
                          >
                            {srv === 'notices' ? 'Notice Board' : srv === 'policies' ? 'Policies' : srv === 'applications' ? 'Apps' : 'Audit Logs'}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                        r.accessLevel === 'full' ? 'bg-emerald-100 text-emerald-800' : r.accessLevel === 'write' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.accessLevel === 'full' ? 'Full Admin' : r.accessLevel === 'write' ? 'Write & Publish' : 'Read Only'}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => void handleToggleStatus(r)}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                          r.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {r.status === 'active' ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    <td className="p-3.5 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(r)}
                          className="rounded-lg p-1.5 text-navy-600 hover:bg-navy-100 hover:text-navy-950"
                          title="Edit rule"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(r.id)}
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                          title="Delete rule"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 pb-3">
              <h3 className="text-base font-black text-navy-950 flex items-center gap-2">
                <Key className="h-4 w-4 text-indigo-600" />
                {editingRule ? 'Edit Access Rule' : 'Create Access Rule'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {formError && (
                <p className="rounded-xl bg-red-50 p-2.5 text-xs font-bold text-red-600 border border-red-200">
                  {formError}
                </p>
              )}

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dean Academics Notice & Policy Grant"
                  className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-medium text-navy-950 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Target Type</label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as AccessRuleTargetType)}
                    className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                  >
                    <option value="email">Gmail / Email Specific</option>
                    <option value="role">Campus Role</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">
                    {targetType === 'email' ? 'Target Gmail / Email Address' : 'Target Role'}
                  </label>
                  {targetType === 'email' ? (
                    <input
                      type="email"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="e.g. user@gmail.com"
                      className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                    />
                  ) : (
                    <select
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                    >
                      <option value="">Select Role...</option>
                      <option value="staff">Staff</option>
                      <option value="student">Student</option>
                      <option value="admin">Administrator</option>
                      <option value="super_admin">Super Administrator</option>
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-2">Granted Services</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'notices', label: 'Notice Board & Circulars' },
                    { id: 'policies', label: 'University Policies' },
                    { id: 'applications', label: 'Application Directory' },
                    { id: 'audit', label: 'Security Audit Logs' },
                  ].map((srv) => {
                    const checked = services.includes(srv.id as AccessRuleService);
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => handleToggleService(srv.id as AccessRuleService)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold text-left transition ${
                          checked
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                            : 'bg-navy-50/40 border-navy-200 text-navy-600 hover:bg-navy-50'
                        }`}
                      >
                        <span className={`flex h-4 w-4 items-center justify-center rounded border ${
                          checked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-navy-300 bg-white'
                        }`}>
                          {checked && <Check className="h-3 w-3" />}
                        </span>
                        <span>{srv.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Access Level</label>
                  <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
                    className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                  >
                    <option value="read">Read Only</option>
                    <option value="write">Write & Publish</option>
                    <option value="full">Full Admin Control</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AccessRuleStatus)}
                    className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-semibold text-navy-950 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
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
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingRule ? 'Update Access Rule' : 'Save Access Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-navy-950">Remove Access Rule?</h3>
            <p className="text-xs text-navy-600 font-medium">
              Are you sure you want to remove this role/Gmail access control rule? Affected accounts will lose elevated access to the selected services.
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
                Remove Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
