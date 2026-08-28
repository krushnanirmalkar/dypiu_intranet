export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  avatar: string;
  collegeId: string;
  department: string;
  program?: string;
  yearOrDesignation: string;
  bio: string;
  joinedYear: string;
  phone: string;
}

export interface ApplicationItem {
  id: string;
  name: string;
  description: string;
  category: 'Academic' | 'Administration' | 'Learning' | 'Library' | 'Examination' | 'Career' | 'Research' | 'Productivity';
  iconName: string;
  ssoEnabled: boolean;
  isFavorite: boolean;
  badgeText?: string;
  url: string;
  highlightColor?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  category: 'Hackathon' | 'Academic' | 'Research' | 'Sports' | 'Internship' | 'Certification' | 'Leadership';
  description: string;
  verified: boolean;
  badgeType: string;
  role: UserRole;
  proofUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  isOnline: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'Academic' | 'Examination' | 'Event' | 'Achievement' | 'System';
  isRead: boolean;
  targetRoles: UserRole[];
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
  type: 'Lecture' | 'Exam' | 'Deadline' | 'Meeting' | 'Workshop';
  code?: string;
}

export interface StatMetric {
  label: string;
  value: string | number;
  change?: string;
  subtext?: string;
}
