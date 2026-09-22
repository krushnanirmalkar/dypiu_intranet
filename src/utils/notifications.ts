import type { NotificationItem, UserRole } from '../types';

const targetAudienceToRoles = (audience: string): UserRole[] => {
  const norm = (audience || '').toLowerCase();
  if (norm === 'students') return ['student', 'admin', 'super_admin'];
  if (norm === 'staff') return ['staff', 'admin', 'super_admin'];
  return ['student', 'staff', 'admin', 'super_admin'];
};

const mapNotificationTypeToCategory = (type: string): NotificationItem['category'] => {
  const t = (type || '').toLowerCase();
  if (t === 'academic') return 'Academic';
  if (t === 'examination') return 'Examination';
  if (t === 'event') return 'Event';
  if (t === 'achievement') return 'Achievement';
  return 'System';
};

export const normalizeNotifications = (payload: unknown): NotificationItem[] => {
  const source = Array.isArray(payload)
    ? payload
    : typeof payload === 'object' && payload !== null && Array.isArray((payload as { notifications?: unknown }).notifications)
      ? (payload as { notifications: unknown[] }).notifications
      : [];

  return source.flatMap((item, index) => {
    if (typeof item !== 'object' || item === null) return [];
    const notif = item as Record<string, unknown>;
    const id = typeof notif.id === 'string' ? notif.id : `notif-${index}`;
    const title = typeof notif.title === 'string' ? notif.title : 'Notification';
    const message = typeof notif.message === 'string' ? notif.message : '';
    const rawAudience = typeof notif.targetAudience === 'string'
      ? notif.targetAudience
      : typeof notif.target_audience === 'string'
        ? notif.target_audience
        : 'All';
    const rawType = typeof notif.type === 'string' ? notif.type : 'info';
    const createdAt = typeof notif.createdAt === 'string'
      ? notif.createdAt
      : typeof notif.created_at === 'string'
        ? notif.created_at
        : new Date().toISOString();

    let formattedTime = 'Recently';
    try {
      const date = new Date(createdAt);
      if (!isNaN(date.getTime())) {
        const diffMs = Date.now() - date.getTime();
        if (diffMs < 3600000) {
          formattedTime = `${Math.max(1, Math.floor(diffMs / 60000))}m ago`;
        } else if (diffMs < 86400000) {
          formattedTime = `${Math.floor(diffMs / 3600000)}h ago`;
        } else {
          formattedTime = `${Math.floor(diffMs / 86400000)}d ago`;
        }
      }
    } catch {
      // ignore formatting errors
    }

    return [{
      id,
      title,
      message,
      timestamp: formattedTime,
      category: mapNotificationTypeToCategory(rawType),
      isRead: false,
      targetRoles: targetAudienceToRoles(rawAudience),
    }];
  });
};
