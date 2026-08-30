import React from 'react';
import { Building2, GraduationCap, Mail, ShieldCheck } from 'lucide-react';
import type { UserProfile, UserRole } from '../types';

interface ProfilePageProps {
  user: UserProfile;
  currentRole: UserRole;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, currentRole }) => {
  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <div className="space-y-5">
      <section className="rounded-[22px] border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-navy-800 text-2xl font-black text-white shadow-lg">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-black text-navy-950">{user.name}</h1>
              <span className="rounded-full bg-navy-50 px-2.5 py-1 text-[10px] font-bold capitalize text-navy-700">{currentRole}</span>
            </div>
            <p className="mt-1 text-sm font-bold text-navy-600">{user.roleTitle}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-navy-500">{user.bio}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[22px] border border-navy-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2 border-b border-navy-100 pb-4">
          <ShieldCheck className="h-5 w-5 text-navy-800" />
          <h2 className="text-base font-extrabold text-navy-950">University Identity</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-navy-50 p-4">
            <Mail className="h-5 w-5 text-navy-700" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Institutional email</p>
              <p className="mt-1 break-all text-sm font-bold text-navy-900">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-navy-50 p-4">
            <GraduationCap className="h-5 w-5 text-navy-700" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">University ID</p>
              <p className="mt-1 text-sm font-bold text-navy-900">{user.collegeId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-navy-50 p-4 md:col-span-2">
            <Building2 className="h-5 w-5 text-navy-700" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Institution</p>
              <p className="mt-1 text-sm font-bold text-navy-900">{user.department}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
