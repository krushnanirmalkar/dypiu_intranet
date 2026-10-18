import React from 'react';
import {
  Building2,
  GraduationCap,
  Mail,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  ExternalLink,
  LogOut,
  BadgeCheck
} from 'lucide-react';
import type { UserProfile, UserRole } from '../types';
import { toTitleCase } from '../data/devPreviewData';

interface ProfilePageProps {
  user: UserProfile;
  currentRole: UserRole;
  onBack?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, currentRole, onBack }) => {
  const formattedName = toTitleCase(user.name || 'Sarthak Jayant Kharche');
  const initials = formattedName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-200">
      {/* Back button header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#393678] hover:text-[#00afef] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">
          DYPIU Campus Profile
        </span>
      </div>

      {/* Main Profile Header Card */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden w-full">
        {/* Subtle background brand accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#00afef]/10 via-[#393678]/5 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start relative z-10">
          {/* Avatar or Initial Box */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={formattedName}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-slate-200 shadow-md shrink-0"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[#0A1328] text-2xl font-bold text-white shadow-md">
              {initials}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#393678] font-serif-custom tracking-tight">
                {formattedName}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#00afef]/10 border border-[#00afef]/25 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#00afef]">
                <BadgeCheck className="w-3 h-3" />
                {currentRole}
              </span>
            </div>

            <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">
              {user.roleTitle || 'DYPIU Student'}
            </p>

            <p className="mt-2 text-xs text-slate-500 max-w-3xl leading-relaxed">
              {user.bio || 'Registered member of D Y Patil International University, Akurdi, Pune.'}
            </p>
          </div>
        </div>
      </section>

      {/* Identity & Institutional Data Grid */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5 w-full">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="h-4 w-4 text-[#393678]" />
          <h2 className="text-sm font-bold text-[#393678] tracking-tight">University Identity & Records</h2>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Institutional Email */}
          <div className="flex items-center gap-3.5 rounded-2xl bg-[#F8F9FC] border border-slate-200/60 p-4">
            <div className="w-10 h-10 rounded-xl bg-[#00afef]/15 text-[#00afef] flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Institutional Email</p>
              <p className="mt-0.5 break-all text-xs sm:text-sm font-bold text-[#393678]">{user.email}</p>
            </div>
          </div>

          {/* University ID / PRN */}
          <div className="flex items-center gap-3.5 rounded-2xl bg-[#F8F9FC] border border-slate-200/60 p-4">
            <div className="w-10 h-10 rounded-xl bg-[#f16136]/15 text-[#f16136] flex items-center justify-center shrink-0">
              <GraduationCap className="h-5 w-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">University ID / PRN</p>
              <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#393678]">{user.collegeId || user.id || '20240802084'}</p>
            </div>
          </div>

          {/* Account Status / Role */}
          <div className="flex items-center gap-3.5 rounded-2xl bg-[#F8F9FC] border border-slate-200/60 p-4">
            <div className="w-10 h-10 rounded-xl bg-[#1bb470]/15 text-[#1bb470] flex items-center justify-center shrink-0">
              <BadgeCheck className="h-5 w-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Campus Authorization</p>
              <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#393678]">Verified Active · {currentRole.toUpperCase()}</p>
            </div>
          </div>

          {/* Institution / Department */}
          <div className="flex items-center gap-3.5 rounded-2xl bg-[#F8F9FC] border border-slate-200/60 p-4 sm:col-span-2 lg:col-span-3">
            <div className="w-10 h-10 rounded-xl bg-[#393678]/10 text-[#393678] flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Institution & Department</p>
              <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#393678]">
                {user.department || 'School of Computer Science & Engineering · DYPIU Akurdi, Pune'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Account Security & Fast Actions */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#faa831]/15 text-[#faa831] flex items-center justify-center shrink-0">
            <KeyRound className="h-5 w-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#393678]">Campus Single Sign-On (SSO)</h3>
            <p className="text-[11px] text-slate-500">Manage your central Keycloak credentials and active sessions</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="https://auth.dypiu.ac.in/realms/dypiu/account"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#00afef]/10 text-[#00afef] hover:bg-[#00afef]/20 border border-[#00afef]/25 text-xs font-bold transition-all"
          >
            <span>Service Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => { window.location.href = '/logout'; }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#f16136]/10 text-[#f16136] hover:bg-[#f16136]/20 border border-[#f16136]/25 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </section>
    </div>
  );
};
