import React from 'react';
import type { UserRole } from '../types';
import { AnnouncementSection } from './AnnouncementSection';

interface ActivityHubProps { currentRole: UserRole; }
export const ActivityHub: React.FC<ActivityHubProps> = ({ currentRole }) => <AnnouncementSection currentRole={currentRole} />;
