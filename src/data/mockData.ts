import type { AchievementItem, EventItem, NotificationItem, ScheduleItem, StatMetric } from '../types';

export const mockAchievements: AchievementItem[] = [
  {
    id: 'ach_1',
    title: 'GDGC WOW Verse Hackathon Winner',
    organization: 'Google Developer Student Clubs',
    date: 'February 2026',
    category: 'Hackathon',
    description: 'Secured 1st position among 150+ teams nationwide for building an AI-powered accessibility tool for neurodivergent learners.',
    verified: true,
    badgeType: 'Trophy',
    role: 'student',
  },
  {
    id: 'ach_2',
    title: 'Academic Excellence Award (Semester V)',
    organization: 'Dean of Academic Affairs',
    date: 'December 2025',
    category: 'Academic',
    description: 'Awarded Meritorious Certificate for achieving a perfect 10.0 SGPA in Semester V CSE Curriculum.',
    verified: true,
    badgeType: 'Medal',
    role: 'student',
  },
  {
    id: 'ach_3',
    title: 'Research Publication - IEEE Xplore',
    organization: 'IEEE International Conference on AI Solutions',
    date: 'November 2025',
    category: 'Research',
    description: 'Co-authored research paper on "Optimized Edge Computing Algorithms for Campus IoT Devices".',
    verified: true,
    badgeType: 'Scroll',
    role: 'student',
  },
  {
    id: 'ach_4',
    title: 'Summer Internship at Google Research',
    organization: 'Google AI Labs',
    date: 'August 2025',
    category: 'Internship',
    description: 'Successfully completed 12-week Software Engineering Internship working on transformer optimization.',
    verified: true,
    badgeType: 'CheckCircle',
    role: 'student',
  },
  {
    id: 'ach_5',
    title: 'AWS Certified Solutions Architect',
    organization: 'Amazon Web Services',
    date: 'July 2025',
    category: 'Certification',
    description: 'Passed Associate level examination validating cloud architecture, security, and scalability skills.',
    verified: true,
    badgeType: 'ShieldCheck',
    role: 'student',
  },
  // Faculty achievements
  {
    id: 'ach_fac_1',
    title: 'Best Research Paper Award - NeurIPS 2025',
    organization: 'Neural Information Processing Systems',
    date: 'December 2025',
    category: 'Research',
    description: 'Recognized for pioneering paper on Federated Learning in Privacy-Preserving Health Networks.',
    verified: true,
    badgeType: 'Trophy',
    role: 'faculty',
  },
  {
    id: 'ach_fac_2',
    title: 'DST SERB Research Grant (₹45 Lakhs)',
    organization: 'Department of Science and Technology',
    date: 'October 2025',
    category: 'Research',
    description: 'Awarded 3-year research funding for AI in Climate Modeling and Smart Grid Energy Systems.',
    verified: true,
    badgeType: 'ShieldCheck',
    role: 'faculty',
  },
  {
    id: 'ach_fac_3',
    title: 'Keynote Speaker at IEEE World AI Congress',
    organization: 'IEEE Computer Society',
    date: 'August 2025',
    category: 'Leadership',
    description: 'Delivered invited keynote address on "Ethics in Generative Autonomous Systems".',
    verified: true,
    badgeType: 'Scroll',
    role: 'faculty',
  }
];

export const mockEvents: EventItem[] = [
  {
    id: 'evt_1',
    title: 'Tech Talk: Future of AI in Education',
    date: '24 Aug 2026',
    time: '11:00 AM',
    location: 'Main University Auditorium & Live Stream',
    category: 'Symposium',
    isOnline: false,
  },
  {
    id: 'evt_2',
    title: 'Hackathon 2026',
    date: '29 Aug 2026',
    time: '09:00 AM',
    location: 'Incubation & Innovation Lab',
    category: 'Competition',
    isOnline: false,
  },
  {
    id: 'evt_3',
    title: 'Placement Preparation Workshop by Microsoft Engineers',
    date: 'Mar 10, 2026',
    time: '02:00 PM - 05:00 PM',
    location: 'Virtual Classroom (MS Teams)',
    category: 'Career',
    isOnline: true,
  },
  {
    id: 'evt_4',
    title: 'Faculty Development Program: Hybrid Pedagogy',
    date: 'Mar 15, 2026',
    time: '10:00 AM - 01:00 PM',
    location: 'Faculty Seminar Room 3B',
    category: 'FDP',
    isOnline: false,
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Assignment Deadline Approaching',
    message: 'Machine Learning Project Proposal submission closes in 24 hours on Canvas LMS.',
    timestamp: '10 mins ago',
    category: 'Academic',
    isRead: false,
    targetRoles: ['student'],
  },
  {
    id: 'notif_2',
    title: 'End-Semester Exam Schedule Published',
    message: 'The official datesheet for May 2026 End-Sem exams is now available on the Exam Portal.',
    timestamp: '2 hours ago',
    category: 'Examination',
    isRead: false,
    targetRoles: ['student', 'faculty'],
  },
  {
    id: 'notif_3',
    title: 'New Research Grant Guidelines Uploaded',
    message: 'Faculty members can submit seed funding proposals for FY 2026-27 until March 31.',
    timestamp: '5 hours ago',
    category: 'System',
    isRead: false,
    targetRoles: ['faculty'],
  },
  {
    id: 'notif_4',
    title: 'Achievement Verification Approved',
    message: 'Your certificate for "GDGC WOW Verse Hackathon Winner" was verified by the Dean Office.',
    timestamp: '1 day ago',
    category: 'Achievement',
    isRead: true,
    targetRoles: ['student', 'faculty'],
  }
];

export const mockStudentSchedule: ScheduleItem[] = [
  {
    id: 'sch_1',
    time: '09:00 AM - 10:30 AM',
    title: 'Deep Learning & Neural Networks Lecture',
    location: 'CS Hall 402',
    type: 'Lecture',
    code: 'CSE-304',
  },
  {
    id: 'sch_2',
    time: '11:00 AM - 01:00 PM',
    title: 'Cloud Computing Lab (Group A)',
    location: 'Advanced Computing Lab 2',
    type: 'Lecture',
    code: 'CSE-306L',
  },
  {
    id: 'sch_3',
    time: '02:30 PM - 03:30 PM',
    title: 'Software Engineering Assignment Review',
    location: 'Online Canvas Submission',
    type: 'Deadline',
    code: 'CSE-302',
  },
  {
    id: 'sch_4',
    time: '04:00 PM - 05:30 PM',
    title: 'Robotics & AI Club Weekly Sync',
    location: 'Student Activity Center',
    type: 'Meeting',
  }
];

export const mockFacultySchedule: ScheduleItem[] = [
  {
    id: 'fsch_1',
    time: '09:30 AM - 11:00 AM',
    title: 'Advanced AI Algorithms (B.Tech 3rd Year)',
    location: 'Lecture Theatre 1',
    type: 'Lecture',
    code: 'CSE-501',
  },
  {
    id: 'fsch_2',
    time: '11:30 AM - 01:00 PM',
    title: 'Departmental Research Committee Meeting',
    location: 'Conference Room B',
    type: 'Meeting',
  },
  {
    id: 'fsch_3',
    time: '02:00 PM - 04:00 PM',
    title: 'M.Tech Thesis Defense Reviews',
    location: 'Postgraduate Seminar Room',
    type: 'Exam',
  }
];

export const mockStudentStats: StatMetric[] = [
  { label: 'Current Semester', value: 'Sem VI' },
  { label: 'Cumulative CGPA', value: '9.42', subtext: 'Top 5% of Batch' },
  { label: 'Attendance Average', value: '94.5%', change: '+1.2% this month' },
  { label: 'Upcoming Exams', value: '3 Papers', subtext: 'Starts Mar 18' },
];

export const mockFacultyStats: StatMetric[] = [
  { label: 'Classes Today', value: '3 Sessions', subtext: '1 Lab, 2 Lectures' },
  { label: 'Total Students Mapped', value: '184', subtext: 'Across 3 Courses' },
  { label: 'Pending Evaluations', value: '28 Papers', change: '8 due today' },
  { label: 'Active Research Grants', value: '₹45 Lakhs', subtext: 'DST SERB Approved' },
];
