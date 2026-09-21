import type {
  AccessRule,
  AdminApplication,
  AdminNotice,
  AdminPolicy,
  AuditEvent,
  DashboardOverviewResponse,
} from '../types/admin';

// -------------------------
// Dev Preview Initial State
// -------------------------
const initialDevNotices: AdminNotice[] = [
  {
    id: 'notice-1',
    title: 'Mid-Term Semester Registration & Fee Payment Portal Open',
    content: 'Students are advised to complete mid-term registration and clear pending tuition dues before the deadline. Late fees will apply after the designated date.',
    category: 'Urgent',
    audience: 'Students',
    priority: 'High',
    status: 'published',
    author: 'Registrar Office',
    publishAt: '2026-09-10T09:00:00.000Z',
    expiresAt: null,
    createdAt: '2026-09-10T08:30:00.000Z',
    updatedAt: '2026-09-10T08:30:00.000Z',
    createdBy: 'registrar@dypiu.ac.in',
    updatedBy: 'registrar@dypiu.ac.in',
  },
  {
    id: 'notice-2',
    title: 'Central Library Operating Hours Extended Until Midnight',
    content: 'Library reading halls will remain open until midnight for the upcoming mid-semester examinations. Quiet study zones will be enforced.',
    category: 'Academic',
    audience: 'All',
    priority: 'Medium',
    status: 'published',
    author: 'Library Administration',
    publishAt: '2026-09-08T10:00:00.000Z',
    expiresAt: null,
    createdAt: '2026-09-08T09:15:00.000Z',
    updatedAt: '2026-09-08T09:15:00.000Z',
    createdBy: 'library@dypiu.ac.in',
    updatedBy: 'library@dypiu.ac.in',
  },
  {
    id: 'notice-3',
    title: 'Scheduled Campus Network Maintenance',
    content: 'Routine network maintenance will take place Saturday from 02:00 AM to 04:00 AM. Intermittent Wi-Fi disruptions may occur during this window.',
    category: 'Administrative',
    audience: 'All',
    priority: 'Low',
    status: 'published',
    author: 'IT Helpdesk',
    publishAt: '2026-09-05T14:00:00.000Z',
    expiresAt: null,
    createdAt: '2026-09-05T13:45:00.000Z',
    updatedAt: '2026-09-05T13:45:00.000Z',
    createdBy: 'it@dypiu.ac.in',
    updatedBy: 'it@dypiu.ac.in',
  },
];

const initialDevApplications: AdminApplication[] = [
  {
    id: 'udms',
    name: 'UDMS',
    shortName: 'UDMS',
    description: 'University Digital Management System',
    url: 'https://udms.dypiu.ac.in',
    icon: 'LayoutDashboard',
    category: 'Administration',
    roles: ['student', 'staff', 'admin'],
    enabled: true,
    displayOrder: 1,
    ssoEnabled: true,
    highlightColor: 'from-amber-500/20 to-orange-500/5 border-amber-200 text-amber-600',
  },
  {
    id: 'juno',
    name: 'Juno',
    shortName: 'Juno',
    description: 'Student Information & Academic Lifecycle Services',
    url: 'https://erp.dypiu.ac.in',
    icon: 'GraduationCap',
    category: 'Academic',
    roles: ['student', 'staff', 'admin'],
    enabled: true,
    displayOrder: 2,
    ssoEnabled: true,
    highlightColor: 'from-indigo-500/20 to-blue-500/5 border-indigo-200 text-indigo-600',
  },
  {
    id: 'unisync',
    name: 'UniSync',
    shortName: 'UniSync',
    description: 'Unified Campus Communication & Collaboration Hub',
    url: 'https://unisync.dypiu.ac.in',
    icon: 'Share2',
    category: 'Productivity',
    roles: ['student', 'staff', 'admin'],
    enabled: true,
    displayOrder: 3,
    ssoEnabled: true,
    highlightColor: 'from-emerald-500/20 to-green-500/5 border-emerald-200 text-emerald-600',
  },
  {
    id: 'faculty-appraisal',
    name: 'Faculty and Staff Appraisal',
    shortName: 'Appraisal',
    description: 'Faculty and Staff Appraisal System',
    url: 'https://pbas.dypiu.ac.in',
    icon: 'ClipboardCheck',
    category: 'Staff Services',
    roles: ['staff', 'admin'],
    enabled: true,
    displayOrder: 4,
    ssoEnabled: true,
  },
  {
    id: 'academic-audit',
    name: 'Academic and Administrative Audit',
    shortName: 'Academic Audit',
    description: 'Academic and Administrative Audit System',
    url: 'https://pbas.dypiu.ac.in/AAA',
    icon: 'FileCheck',
    category: 'Staff Services',
    roles: ['staff', 'admin'],
    enabled: true,
    displayOrder: 5,
    ssoEnabled: true,
  },
];

const initialDevPolicies: AdminPolicy[] = [
  {
    id: 'pol-1',
    title: 'DYPIU Campus Information Security Policy',
    category: 'IT & Security',
    summary: 'Guidelines for acceptable use of campus network, accounts, data protection, and cybersecurity compliance.',
    content: 'All students, faculty, and administrative staff must adhere to strict password governance, multi-factor authentication, and multi-tenant data privacy regulations...',
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
    content: 'DYPIU maintains zero tolerance towards academic dishonesty. Submissions containing unauthorized AI generation or uncredited text will be evaluated by the Disciplinary Committee...',
    version: '2.0',
    status: 'published',
    effectiveDate: '2026-02-01',
    publishedAt: '2026-02-01T00:00:00.000Z',
    createdAt: '2026-01-20T11:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    createdBy: 'academics@dypiu.ac.in',
    updatedBy: 'academics@dypiu.ac.in',
  },
];

const initialDevAuditLogs: AuditEvent[] = [
  {
    id: 'audit-preview-1',
    timestamp: new Date().toISOString(),
    actorSub: 'dev-preview-user',
    actorEmail: 'preview@dypiu.ac.in',
    action: 'system.preview_loaded',
    resourceType: 'system',
    resourceId: 'dev-preview',
    summary: 'Loaded Super Admin Portal in local Dev Preview mode.',
    metadata: {
      ip: '127.0.0.1',
      method: 'GET',
      path: '/admin',
    },
  },
];

const initialDevAccessRules: AccessRule[] = [
  {
    id: 'rule-1',
    name: 'Super Admin Full Control',
    targetType: 'role',
    targetValue: 'super_admin',
    services: ['notices', 'policies', 'applications', 'audit'],
    accessLevel: 'full',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdBy: 'system@dypiu.ac.in',
    updatedBy: 'system@dypiu.ac.in',
  },
  {
    id: 'rule-2',
    name: 'Dean Academics Gmail Access',
    targetType: 'email',
    targetValue: 'dean.academics@gmail.com',
    services: ['notices', 'policies'],
    accessLevel: 'write',
    status: 'active',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    createdBy: 'admin@dypiu.ac.in',
    updatedBy: 'admin@dypiu.ac.in',
  },
  {
    id: 'rule-3',
    name: 'Staff Circulars & Notices Access',
    targetType: 'role',
    targetValue: 'staff',
    services: ['notices', 'policies'],
    accessLevel: 'read',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
    createdBy: 'admin@dypiu.ac.in',
    updatedBy: 'admin@dypiu.ac.in',
  },
];

const STORAGE_KEYS = {
  NOTICES: 'dypiu_dev_notices_v3',
  APPLICATIONS: 'dypiu_dev_applications_v3',
  POLICIES: 'dypiu_dev_policies_v3',
  AUDIT: 'dypiu_dev_audit_v3',
  ACCESS_RULES: 'dypiu_dev_access_rules_v3',
};

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val) as T;
  } catch {
    // fallback
  }
  return defaultVal;
}

function setStored(key: string, val: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // fallback
  }
}

function getDevAccessRules(): AccessRule[] {
  return getStored<AccessRule[]>(STORAGE_KEYS.ACCESS_RULES, initialDevAccessRules);
}
function saveDevAccessRules(rules: AccessRule[]): void {
  setStored(STORAGE_KEYS.ACCESS_RULES, rules);
}

function getDevNotices(): AdminNotice[] {
  return getStored<AdminNotice[]>(STORAGE_KEYS.NOTICES, initialDevNotices);
}
function saveDevNotices(notices: AdminNotice[]): void {
  setStored(STORAGE_KEYS.NOTICES, notices);
}

function getDevApplications(): AdminApplication[] {
  return getStored<AdminApplication[]>(STORAGE_KEYS.APPLICATIONS, initialDevApplications);
}
function saveDevApplications(apps: AdminApplication[]): void {
  setStored(STORAGE_KEYS.APPLICATIONS, apps);
}

function getDevPolicies(): AdminPolicy[] {
  return getStored<AdminPolicy[]>(STORAGE_KEYS.POLICIES, initialDevPolicies);
}
function saveDevPolicies(policies: AdminPolicy[]): void {
  setStored(STORAGE_KEYS.POLICIES, policies);
}

function getDevAuditLogs(): AuditEvent[] {
  return getStored<AuditEvent[]>(STORAGE_KEYS.AUDIT, initialDevAuditLogs);
}
function saveDevAuditLogs(logs: AuditEvent[]): void {
  setStored(STORAGE_KEYS.AUDIT, logs);
}

async function fetchWithDevFallback<T>(url: string, options?: RequestInit, devFallbackSupplier?: () => T): Promise<T> {
  const isDevMode = import.meta.env.DEV;

  try {
    const response = await fetch(url, options);

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      if (isDevMode && devFallbackSupplier) {
        return devFallbackSupplier();
      }
      throw new Error('Server returned non-JSON response.');
    }

    if (response.status === 401) {
      if (isDevMode && devFallbackSupplier) return devFallbackSupplier();
      window.location.href = '/login';
      throw new Error('Authentication required.');
    }

    if (response.status === 403) {
      if (isDevMode && devFallbackSupplier) return devFallbackSupplier();
      throw new Error('Access denied. Administrator privileges required.');
    }

    if (!response.ok) {
      let errorMsg = `API request failed (${response.status})`;
      try {
        const errJson = await response.json() as { error?: string; message?: string };
        if (errJson.error) errorMsg = errJson.error;
        else if (errJson.message) errorMsg = errJson.message;
      } catch {
        // ignore
      }
      if (isDevMode && devFallbackSupplier) return devFallbackSupplier();
      throw new Error(errorMsg);
    }

    return response.json() as Promise<T>;
  } catch (err: unknown) {
    if (isDevMode && devFallbackSupplier) {
      return devFallbackSupplier();
    }
    throw err;
  }
}

export const adminApi = {
  // Dashboard
  async fetchDashboard(): Promise<DashboardOverviewResponse> {
    return fetchWithDevFallback<DashboardOverviewResponse>(
      '/api/admin/dashboard',
      { credentials: 'include' },
      () => {
        const notices = getDevNotices();
        const apps = getDevApplications();
        const policies = getDevPolicies();
        const audit = getDevAuditLogs();
        return {
          stats: {
            activeNotices: notices.filter((n) => n.status === 'published').length,
            publishedApplications: apps.filter((a) => a.enabled).length,
            activePolicies: policies.filter((p) => p.status === 'published').length,
            recentActions: audit.length,
          },
          recentNotices: notices.slice(0, 5),
          recentAuditLogs: audit.slice(0, 5),
        };
      },
    );
  },

  // Notices
  async fetchNotices(params?: { category?: string; audience?: string; status?: string }): Promise<AdminNotice[]> {
    const res = await fetchWithDevFallback<AdminNotice[] | { notices: AdminNotice[] }>(
      `/api/admin/notices${params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`,
      { credentials: 'include' },
      () => {
        let result = getDevNotices();
        if (params?.category && params.category !== 'ALL') result = result.filter((n) => n.category === params.category);
        if (params?.audience && params.audience !== 'ALL') result = result.filter((n) => n.audience === params.audience || n.audience === 'All');
        if (params?.status && params.status !== 'ALL') result = result.filter((n) => n.status === params.status);
        return result;
      },
    );
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as { notices?: AdminNotice[] }).notices)) return (res as { notices: AdminNotice[] }).notices;
    return [];
  },

  async createNotice(notice: Partial<AdminNotice>): Promise<AdminNotice> {
    const newNotice: AdminNotice = {
      id: `notice-${Date.now()}`,
      title: notice.title || 'New Notice',
      content: notice.content || '',
      category: notice.category || 'Academic',
      audience: notice.audience || 'All',
      priority: notice.priority || 'Medium',
      status: notice.status || 'published',
      author: notice.author || 'Super Admin',
      publishAt: notice.publishAt || new Date().toISOString(),
      expiresAt: notice.expiresAt || null,
      attachmentUrl: notice.attachmentUrl || null,
      attachmentName: notice.attachmentName || null,
      attachmentSize: notice.attachmentSize || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'preview@dypiu.ac.in',
      updatedBy: 'preview@dypiu.ac.in',
    };

    const res = await fetchWithDevFallback<AdminNotice | { notice: AdminNotice }>(
      '/api/admin/notices',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(notice),
      },
      () => {
        const notices = getDevNotices();
        notices.unshift(newNotice);
        saveDevNotices(notices);

        const audit = getDevAuditLogs();
        audit.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorSub: 'dev-preview-user',
          actorEmail: 'preview@dypiu.ac.in',
          action: 'notice.created',
          resourceType: 'notice',
          resourceId: newNotice.id,
          summary: `Created notice '${newNotice.title}'`,
          metadata: { ip: '127.0.0.1', method: 'POST', path: '/api/admin/notices' },
        });
        saveDevAuditLogs(audit);
        return newNotice;
      },
    );
    if (res && typeof res === 'object' && 'notice' in res && res.notice) return res.notice;
    return res as AdminNotice;
  },

  async updateNotice(id: string, updates: Partial<AdminNotice>): Promise<AdminNotice> {
    const res = await fetchWithDevFallback<AdminNotice | { notice: AdminNotice }>(
      `/api/admin/notices/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      },
      () => {
        const notices = getDevNotices();
        const index = notices.findIndex((n) => n.id === id);
        if (index === -1) throw new Error('Notice not found');
        const updated = { ...notices[index], ...updates, updatedAt: new Date().toISOString() };
        notices[index] = updated;
        saveDevNotices(notices);

        const audit = getDevAuditLogs();
        audit.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorSub: 'dev-preview-user',
          actorEmail: 'preview@dypiu.ac.in',
          action: updates.status ? `notice.${updates.status}` : 'notice.updated',
          resourceType: 'notice',
          resourceId: id,
          summary: `Updated notice '${updated.title}'`,
          metadata: { ip: '127.0.0.1', method: 'PUT', path: `/api/admin/notices/${id}` },
        });
        saveDevAuditLogs(audit);
        return updated;
      },
    );
    if (res && typeof res === 'object' && 'notice' in res && res.notice) return res.notice;
    return res as AdminNotice;
  },

  async deleteNotice(id: string): Promise<void> {
    await fetchWithDevFallback<{ success: boolean }>(
      `/api/admin/notices/${id}`,
      { method: 'DELETE', credentials: 'include' },
      () => {
        const notices = getDevNotices().filter((n) => n.id !== id);
        saveDevNotices(notices);

        const audit = getDevAuditLogs();
        audit.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorSub: 'dev-preview-user',
          actorEmail: 'preview@dypiu.ac.in',
          action: 'notice.deleted',
          resourceType: 'notice',
          resourceId: id,
          summary: `Deleted notice ${id}`,
          metadata: { ip: '127.0.0.1', method: 'DELETE', path: `/api/admin/notices/${id}` },
        });
        saveDevAuditLogs(audit);
        return { success: true };
      },
    );
  },

  // Applications
  async fetchApplications(): Promise<AdminApplication[]> {
    const res = await fetchWithDevFallback<AdminApplication[] | { applications: AdminApplication[] }>(
      '/api/admin/applications',
      { credentials: 'include' },
      () => getDevApplications(),
    );
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as { applications?: AdminApplication[] }).applications)) return (res as { applications: AdminApplication[] }).applications;
    return [];
  },

  async createApplication(app: Partial<AdminApplication>): Promise<AdminApplication> {
    const apps = getDevApplications();
    const newApp: AdminApplication = {
      id: app.id || `app-${Date.now()}`,
      name: app.name || 'New Application',
      shortName: app.shortName || app.name || 'App',
      description: app.description || '',
      url: app.url || 'https://dypiu.ac.in',
      icon: app.icon || 'LayoutDashboard',
      category: app.category || 'Productivity',
      roles: app.roles || ['student', 'staff', 'admin'],
      enabled: app.enabled !== false,
      displayOrder: app.displayOrder || apps.length + 1,
      ssoEnabled: app.ssoEnabled !== false,
    };

    const res = await fetchWithDevFallback<AdminApplication | { application: AdminApplication }>(
      '/api/admin/applications',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(app),
      },
      () => {
        apps.push(newApp);
        saveDevApplications(apps);

        const audit = getDevAuditLogs();
        audit.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorSub: 'dev-preview-user',
          actorEmail: 'preview@dypiu.ac.in',
          action: 'application.created',
          resourceType: 'application',
          resourceId: newApp.id,
          summary: `Created application '${newApp.name}'`,
          metadata: { ip: '127.0.0.1', method: 'POST', path: '/api/admin/applications' },
        });
        saveDevAuditLogs(audit);
        return newApp;
      },
    );
    if (res && typeof res === 'object' && 'application' in res && res.application) return res.application;
    return res as AdminApplication;
  },

  async updateApplication(id: string, updates: Partial<AdminApplication>): Promise<AdminApplication> {
    const res = await fetchWithDevFallback<AdminApplication | { application: AdminApplication }>(
      `/api/admin/applications/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      },
      () => {
        const apps = getDevApplications();
        const index = apps.findIndex((a) => a.id === id);
        if (index === -1) throw new Error('Application not found');
        const updated = { ...apps[index], ...updates };
        apps[index] = updated;
        saveDevApplications(apps);

        const audit = getDevAuditLogs();
        audit.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorSub: 'dev-preview-user',
          actorEmail: 'preview@dypiu.ac.in',
          action: updates.enabled !== undefined ? (updates.enabled ? 'application.enabled' : 'application.disabled') : 'application.updated',
          resourceType: 'application',
          resourceId: id,
          summary: `Updated application '${updated.name}'`,
          metadata: { ip: '127.0.0.1', method: 'PUT', path: `/api/admin/applications/${id}` },
        });
        saveDevAuditLogs(audit);
        return updated;
      },
    );
    if (res && typeof res === 'object' && 'application' in res && res.application) return res.application;
    return res as AdminApplication;
  },

  async deleteApplication(id: string): Promise<void> {
    await fetchWithDevFallback<{ success: boolean }>(
      `/api/admin/applications/${id}`,
      { method: 'DELETE', credentials: 'include' },
      () => {
        const apps = getDevApplications().filter((a) => a.id !== id);
        saveDevApplications(apps);

        const audit = getDevAuditLogs();
        audit.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorSub: 'dev-preview-user',
          actorEmail: 'preview@dypiu.ac.in',
          action: 'application.deleted',
          resourceType: 'application',
          resourceId: id,
          summary: `Deleted application ${id}`,
          metadata: { ip: '127.0.0.1', method: 'DELETE', path: `/api/admin/applications/${id}` },
        });
        saveDevAuditLogs(audit);
        return { success: true };
      },
    );
  },

  // Policies
  async fetchPolicies(params?: { category?: string; status?: string }): Promise<AdminPolicy[]> {
    const res = await fetchWithDevFallback<AdminPolicy[] | { policies: AdminPolicy[] }>(
      `/api/admin/policies${params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`,
      { credentials: 'include' },
      () => {
        let result = getDevPolicies();
        if (params?.category && params.category !== 'ALL') result = result.filter((p) => p.category === params.category);
        if (params?.status && params.status !== 'ALL') result = result.filter((p) => p.status === params.status);
        return result;
      },
    );
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as { policies?: AdminPolicy[] }).policies)) return (res as { policies: AdminPolicy[] }).policies;
    return [];
  },

  async createPolicy(policy: Partial<AdminPolicy>): Promise<AdminPolicy> {
    const newPolicy: AdminPolicy = {
      id: policy.id || `pol-${Date.now()}`,
      title: policy.title || 'New Policy',
      category: policy.category || 'Administrative',
      summary: policy.summary || '',
      content: policy.content || '',
      version: policy.version || '1.0',
      status: policy.status || 'published',
      effectiveDate: policy.effectiveDate || new Date().toISOString().split('T')[0],
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'preview@dypiu.ac.in',
      updatedBy: 'preview@dypiu.ac.in',
    };

    const res = await fetchWithDevFallback<AdminPolicy | { policy: AdminPolicy }>(
      '/api/admin/policies',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(policy),
      },
      () => {
        const policies = getDevPolicies();
        policies.unshift(newPolicy);
        saveDevPolicies(policies);

        const audit = getDevAuditLogs();
        audit.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorSub: 'dev-preview-user',
          actorEmail: 'preview@dypiu.ac.in',
          action: 'policy.created',
          resourceType: 'policy',
          resourceId: newPolicy.id,
          summary: `Created policy '${newPolicy.title}'`,
          metadata: { ip: '127.0.0.1', method: 'POST', path: '/api/admin/policies' },
        });
        saveDevAuditLogs(audit);
        return newPolicy;
      },
    );
    if (res && typeof res === 'object' && 'policy' in res && res.policy) return res.policy;
    return res as AdminPolicy;
  },

  async updatePolicy(id: string, updates: Partial<AdminPolicy>): Promise<AdminPolicy> {
    const res = await fetchWithDevFallback<AdminPolicy | { policy: AdminPolicy }>(
      `/api/admin/policies/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      },
      () => {
        const policies = getDevPolicies();
        const index = policies.findIndex((p) => p.id === id);
        if (index === -1) throw new Error('Policy not found');
        const updated = { ...policies[index], ...updates, updatedAt: new Date().toISOString() };
        policies[index] = updated;
        saveDevPolicies(policies);

        const audit = getDevAuditLogs();
        audit.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorSub: 'dev-preview-user',
          actorEmail: 'preview@dypiu.ac.in',
          action: updates.status ? `policy.${updates.status}` : 'policy.updated',
          resourceType: 'policy',
          resourceId: id,
          summary: `Updated policy '${updated.title}'`,
          metadata: { ip: '127.0.0.1', method: 'PUT', path: `/api/admin/policies/${id}` },
        });
        saveDevAuditLogs(audit);
        return updated;
      },
    );
    if (res && typeof res === 'object' && 'policy' in res && res.policy) return res.policy;
    return res as AdminPolicy;
  },

  async deletePolicy(id: string): Promise<void> {
    await fetchWithDevFallback<{ success: boolean }>(
      `/api/admin/policies/${id}`,
      { method: 'DELETE', credentials: 'include' },
      () => {
        const policies = getDevPolicies().filter((p) => p.id !== id);
        saveDevPolicies(policies);

        const audit = getDevAuditLogs();
        audit.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorSub: 'dev-preview-user',
          actorEmail: 'preview@dypiu.ac.in',
          action: 'policy.archived',
          resourceType: 'policy',
          resourceId: id,
          summary: `Archived policy ${id}`,
          metadata: { ip: '127.0.0.1', method: 'DELETE', path: `/api/admin/policies/${id}` },
        });
        saveDevAuditLogs(audit);
        return { success: true };
      },
    );
  },

  // Audit Logs
  async fetchAuditLogs(params?: { action?: string; resourceType?: string; search?: string }): Promise<AuditEvent[]> {
    return fetchWithDevFallback<AuditEvent[]>(
      `/api/admin/audit${params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`,
      { credentials: 'include' },
      () => {
        let result = getDevAuditLogs();
        if (params?.resourceType && params.resourceType !== 'ALL') {
          result = result.filter((e) => e.resourceType === params.resourceType);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          result = result.filter(
            (e) =>
              e.summary.toLowerCase().includes(q) ||
              e.action.toLowerCase().includes(q) ||
              e.actorEmail.toLowerCase().includes(q),
          );
        }
        return result;
      },
    );
  },

  // Access Rules Management
  async fetchAccessRules(params?: { targetType?: string; status?: string; search?: string }): Promise<AccessRule[]> {
    const res = await fetchWithDevFallback<AccessRule[] | { rules: AccessRule[] }>(
      `/api/admin/access-rules${params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`,
      { credentials: 'include' },
      () => {
        let result = getDevAccessRules();
        if (params?.targetType && params.targetType !== 'ALL') {
          result = result.filter((r) => r.targetType === params.targetType);
        }
        if (params?.status && params.status !== 'ALL') {
          result = result.filter((r) => r.status === params.status);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          result = result.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.targetValue.toLowerCase().includes(q),
          );
        }
        return result;
      },
    );
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as { rules?: AccessRule[] }).rules)) return (res as { rules: AccessRule[] }).rules;
    return [];
  },

  async createAccessRule(ruleData: Omit<AccessRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<AccessRule> {
    const res = await fetchWithDevFallback<AccessRule | { rule: AccessRule }>(
      '/api/admin/access-rules',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(ruleData),
      },
      () => {
        const rules = getDevAccessRules();
        const now = new Date().toISOString();
        const newRule: AccessRule = {
          ...ruleData,
          id: `rule-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
          createdBy: 'dev-admin@dypiu.ac.in',
          updatedBy: 'dev-admin@dypiu.ac.in',
        };
        rules.unshift(newRule);
        saveDevAccessRules(rules);

        const audit = getDevAuditLogs();
        audit.unshift({
          id: `audit-${Date.now()}`,
          timestamp: now,
          actorSub: 'dev-preview-user',
          actorEmail: 'preview@dypiu.ac.in',
          action: 'access_rule.created',
          resourceType: 'access_rule',
          resourceId: newRule.id,
          summary: `Created access rule '${newRule.name}' for ${newRule.targetType}:${newRule.targetValue}`,
          metadata: { ip: '127.0.0.1', method: 'POST', path: '/api/admin/access-rules' },
        });
        saveDevAuditLogs(audit);

        return newRule;
      },
    );
    if (res && typeof res === 'object' && 'rule' in res) return (res as { rule: AccessRule }).rule;
    return res as AccessRule;
  },

  async updateAccessRule(id: string, updates: Partial<AccessRule>): Promise<AccessRule> {
    const res = await fetchWithDevFallback<AccessRule | { rule: AccessRule }>(
      `/api/admin/access-rules/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      },
      () => {
        const rules = getDevAccessRules();
        const index = rules.findIndex((r) => r.id === id);
        if (index === -1) throw new Error('Access rule not found');
        const updated: AccessRule = {
          ...rules[index],
          ...updates,
          updatedAt: new Date().toISOString(),
          updatedBy: 'dev-admin@dypiu.ac.in',
        };
        rules[index] = updated;
        saveDevAccessRules(rules);
        return updated;
      },
    );
    if (res && typeof res === 'object' && 'rule' in res) return (res as { rule: AccessRule }).rule;
    return res as AccessRule;
  },

  async deleteAccessRule(id: string): Promise<{ success: boolean }> {
    return fetchWithDevFallback<{ success: boolean }>(
      `/api/admin/access-rules/${id}`,
      { method: 'DELETE', credentials: 'include' },
      () => {
        const rules = getDevAccessRules();
        const next = rules.filter((r) => r.id !== id);
        saveDevAccessRules(next);
        return { success: true };
      },
    );
  },
};
