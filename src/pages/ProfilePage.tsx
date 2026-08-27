import React from 'react';
import type { UserProfile, UserRole } from '../types';
import {
  Mail,
  GraduationCap,
  ShieldCheck,
  User,
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  currentRole: UserRole;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  currentRole,
}) => {
  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">

          {/* Initials Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-navy-800 text-white flex items-center justify-center border-2 border-navy-800 shadow-md shrink-0">
            <span className="text-2xl sm:text-3xl font-black tracking-wide">
              {initials || <User className="w-8 h-8" />}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-black text-navy-900">
                {user.name}
              </h1>

              <span className="px-2.5 py-0.5 rounded-full bg-navy-800 text-white font-bold text-xs capitalize tracking-wider">
                {currentRole}
              </span>
            </div>

            <p className="text-sm font-bold text-navy-700 mb-4">
              {user.roleTitle}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-navy-600 font-medium pt-3 border-t border-navy-100">

              <span className="flex items-center">
                <GraduationCap className="w-4 h-4 mr-1 text-navy-800" />
                University ID:
                <strong className="ml-1 text-navy-900">
                  {user.collegeId}
                </strong>
              </span>

              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-1 text-navy-800" />
                {user.email}
              </span>

            </div>
          </div>
        </div>
      </div>

      {/* SSO Identity */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">

        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-navy-100">
          <ShieldCheck className="w-5 h-5 text-navy-800" />

          <h3 className="text-lg font-extrabold text-navy-900">
            University Identity & SSO
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 text-xs">

          <div>
            <span className="font-semibold text-navy-400">
              Full Name
            </span>

            <p className="font-bold text-navy-900 text-sm mt-1">
              {user.name}
            </p>
          </div>

          <div>
            <span className="font-semibold text-navy-400">
              Official Institutional Email
            </span>

            <p className="font-bold text-navy-900 mt-1 break-all">
              {user.email}
            </p>
          </div>

          <div>
            <span className="font-semibold text-navy-400">
              University Identification Number
            </span>

            <p className="font-mono font-bold text-navy-900 mt-1">
              {user.collegeId}
            </p>
          </div>

          <div>
            <span className="font-semibold text-navy-400">
              Access Role
            </span>

            <div className="mt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-navy-50 border border-navy-200 text-navy-800 font-bold capitalize">
                {currentRole}
              </span>
            </div>
          </div>

          <div>
            <span className="font-semibold text-navy-400">
              Authentication
            </span>

            <div className="mt-1 flex items-center text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              DYPIU Single Sign-On
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
