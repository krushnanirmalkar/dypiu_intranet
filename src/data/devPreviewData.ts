import type { ApplicationItem, UserRole } from '../types';

export interface AuthenticatedUser {
  sub?: string;
  name: string;
  email: string;
  role?: UserRole;
  roles?: UserRole[];
}

export const DEV_PREVIEW_USER: AuthenticatedUser = {
  sub: 'dev-preview-user',
  name: 'Krushna Nirmalkar',
  email: 'preview@dypiu.ac.in',
  role: 'student',
};

export const DEV_PREVIEW_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'juno',
    name: 'Juno',
    description: 'Access academic resources, materials and track your progress.',
    category: 'Academic',
    iconName: 'GraduationCap',
    ssoEnabled: true,
    isFavorite: true,
    url: 'https://erp.dypiu.ac.in',
    highlightColor: 'from-indigo-500/20 to-blue-500/5 border-indigo-200 text-indigo-600',
  },
  {
    id: 'unisync',
    name: 'UniSync',
    description: 'University communication, updates and collaboration.',
    category: 'Productivity',
    iconName: 'Share2',
    ssoEnabled: true,
    isFavorite: true,
    url: 'https://unisync.dypiu.ac.in',
    highlightColor: 'from-emerald-500/20 to-green-500/5 border-emerald-200 text-emerald-600',
  },
  {
    id: 'udms',
    name: 'UDMS',
    description: 'Secure access to university documents and digital services.',
    category: 'Administration',
    iconName: 'FileText',
    ssoEnabled: true,
    isFavorite: true,
    url: 'https://udms.dypiu.ac.in',
    highlightColor: 'from-amber-500/20 to-orange-500/5 border-amber-200 text-amber-600',
  },
  {
    id: 'digital-library-preview',
    name: 'Digital Library',
    description: 'Browse university books, journals and research resources.',
    category: 'Library',
    iconName: 'Library',
    ssoEnabled: true,
    isFavorite: false,
    url: '#',
  },
  {
    id: 'exam-portal-preview',
    name: 'Exam Portal',
    description: 'View examination schedules, forms and academic results.',
    category: 'Examination',
    iconName: 'ClipboardCheck',
    ssoEnabled: true,
    isFavorite: false,
    url: '#',
  },
  {
    id: 'campus-connect-preview',
    name: 'Campus Connect',
    description: 'Discover campus groups, people and student activities.',
    category: 'Productivity',
    iconName: 'Users',
    ssoEnabled: true,
    isFavorite: false,
    url: '#',
  },
  {
    id: 'research-hub-preview',
    name: 'Research Hub',
    description: 'Explore research projects, publications and opportunities.',
    category: 'Research',
    iconName: 'Microscope',
    ssoEnabled: true,
    isFavorite: false,
    url: '#',
  },
  {
    id: 'career-centre-preview',
    name: 'Career Centre',
    description: 'Access internships, placements and career development tools.',
    category: 'Career',
    iconName: 'Briefcase',
    ssoEnabled: true,
    isFavorite: false,
    url: '#',
  },
  {
    id: 'student-services-preview',
    name: 'Student Services',
    description: 'Find essential student support and administrative services.',
    category: 'Administration',
    iconName: 'Building2',
    ssoEnabled: true,
    isFavorite: false,
    url: '#',
  },
];
