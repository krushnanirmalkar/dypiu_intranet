export type NoticeCategory = 'Academic' | 'Administrative' | 'Campus' | 'Urgent';
export type NoticeAudience = 'All' | 'Students' | 'Staff';
export type NoticePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type NoticeStatus = 'draft' | 'published' | 'archived';

export interface AdminNotice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  audience: NoticeAudience;
  priority: NoticePriority;
  status: NoticeStatus;
  author: string;
  publishAt: string;
  expiresAt: string | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentSize?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface AdminApplication {
  id: string;
  name: string;
  shortName: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  roles: string[];
  enabled: boolean;
  displayOrder: number;
  ssoEnabled: boolean;
  highlightColor?: string;
}

export type PolicyCategory = 'Academic' | 'Administrative' | 'IT & Security' | 'Campus & Hostel' | 'Research';
export type PolicyStatus = 'draft' | 'published' | 'archived';

export interface AdminPolicy {
  id: string;
  title: string;
  category: PolicyCategory;
  summary: string;
  content: string;
  version: string;
  status: PolicyStatus;
  effectiveDate: string;
  publishedAt: string | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentSize?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorSub: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  summary: string;
  metadata: {
    ip?: string | null;
    method?: string | null;
    path?: string | null;
    reason?: string | null;
    userRoles?: string[] | null;
    requiredRoles?: string[] | null;
  };
}

export interface DashboardStats {
  activeNotices: number;
  publishedApplications: number;
  activePolicies: number;
  recentActions: number;
}

export interface DashboardOverviewResponse {
  stats: DashboardStats;
  recentNotices: AdminNotice[];
  recentAuditLogs: AuditEvent[];
}

export type AccessRuleTargetType = 'email' | 'role';
export type AccessRuleService = 'notices' | 'policies' | 'applications' | 'audit';
export type AccessLevel = 'read' | 'write' | 'full';
export type AccessRuleStatus = 'active' | 'disabled';

export interface AccessRule {
  id: string;
  name: string;
  targetType: AccessRuleTargetType;
  targetValue: string;
  services: AccessRuleService[];
  accessLevel: AccessLevel;
  status: AccessRuleStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

