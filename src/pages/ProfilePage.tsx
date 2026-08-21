import React from 'react';
import type { UserProfile, UserRole } from '../types';
import { Mail, Building2, GraduationCap, ShieldCheck } from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  currentRole: UserRole;
  onRoleSwitch: (role: UserRole) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  currentRole,
  onRoleSwitch,
}) => {

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-navy-800 shadow-md"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-black text-navy-900">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-navy-800 text-white font-bold text-xs capitalize tracking-wider">
                {user.role}
              </span>
              <button 
                onClick={() => onRoleSwitch(user.role === 'student' ? 'faculty' : 'student')}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-navy-50 text-navy-800 border border-navy-200 font-semibold text-xs hover:bg-navy-800 hover:text-white transition-colors"
                title="Click to toggle role"
              >
                <ShieldCheck className="w-3 h-3 mr-1" />
                Switch to {user.role === 'student' ? 'Faculty' : 'Student'} View
              </button>
            </div>

            <p className="text-sm font-bold text-navy-700 mb-2">{user.roleTitle}</p>
            <p className="text-xs text-navy-500 max-w-2xl leading-relaxed mb-4">{user.bio}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-navy-600 font-medium pt-2 border-t border-navy-100">
              <span className="flex items-center">
                <GraduationCap className="w-4 h-4 mr-1 text-navy-800" />
                ID: <strong className="ml-1 text-navy-900">{user.collegeId}</strong>
              </span>
              <span className="flex items-center">
                <Building2 className="w-4 h-4 mr-1 text-navy-800" />
                {user.department}
              </span>
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-1 text-navy-800" />
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Portfolio Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentRole === 'student' ? (
          <>
            <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
              <p className="text-xs font-semibold text-navy-400">Total Achievements</p>
              <h3 className="text-2xl font-black text-navy-900 mt-1">5 Verified</h3>
              <p className="text-[10px] text-navy-500 mt-0.5">3 Hackathons, 2 Academic</p>
            </div>
            <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
              <p className="text-xs font-semibold text-navy-400">Certifications</p>
              <h3 className="text-2xl font-black text-navy-900 mt-1">4 Badges</h3>
              <p className="text-[10px] text-navy-500 mt-0.5">AWS, Google AI, IEEE</p>
            </div>
            <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
              <p className="text-xs font-semibold text-navy-400">CGPA Record</p>
              <h3 className="text-2xl font-black text-navy-900 mt-1">9.42 / 10.0</h3>
              <p className="text-[10px] text-navy-500 mt-0.5">Semester VI Ongoing</p>
            </div>
            <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
              <p className="text-xs font-semibold text-navy-400">Events Attended</p>
              <h3 className="text-2xl font-black text-navy-900 mt-1">12 Workshops</h3>
              <p className="text-[10px] text-navy-500 mt-0.5">Technical & Cultural</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
              <p className="text-xs font-semibold text-navy-400">Research Publications</p>
              <h3 className="text-2xl font-black text-navy-900 mt-1">15 Papers</h3>
              <p className="text-[10px] text-navy-500 mt-0.5">NeurIPS, IEEE Xplore</p>
            </div>
            <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
              <p className="text-xs font-semibold text-navy-400">Active Grants</p>
              <h3 className="text-2xl font-black text-navy-900 mt-1">₹45 Lakhs</h3>
              <p className="text-[10px] text-navy-500 mt-0.5">DST SERB Approved</p>
            </div>
            <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
              <p className="text-xs font-semibold text-navy-400">Courses Taught</p>
              <h3 className="text-2xl font-black text-navy-900 mt-1">3 Courses</h3>
              <p className="text-[10px] text-navy-500 mt-0.5">184 Enrolled Students</p>
            </div>
            <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
              <p className="text-xs font-semibold text-navy-400">Faculty Distinction</p>
              <h3 className="text-2xl font-black text-navy-900 mt-1">Senior Lead</h3>
              <p className="text-[10px] text-navy-500 mt-0.5">School of Computing</p>
            </div>
          </>
        )}
      </div>

      {/* Academic Record Summary */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
        <h3 className="text-lg font-extrabold text-navy-900 mb-4 pb-2 border-b border-navy-100">
          Academic Credentials & SSO Binding
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-navy-400">Full Name</span>
              <p className="font-bold text-navy-900 text-sm">{user.name}</p>
            </div>
            <div>
              <span className="font-semibold text-navy-400">University Identification Number</span>
              <p className="font-mono font-bold text-navy-900">{user.collegeId}</p>
            </div>
            <div>
              <span className="font-semibold text-navy-400">Official Institutional Email</span>
              <p className="font-bold text-navy-900">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="font-semibold text-navy-400">School / Department</span>
              <p className="font-bold text-navy-900">{user.department}</p>
            </div>
            <div>
              <span className="font-semibold text-navy-400">Program / Designation</span>
              <p className="font-bold text-navy-900">{user.program || user.yearOrDesignation}</p>
            </div>
            <div>
              <span className="font-semibold text-navy-400">Single Sign-On SSO Hash</span>
              <p className="font-mono text-[11px] text-navy-600 bg-navy-50 px-2 py-1 rounded border border-navy-100 truncate">
                sso_token_sha256_9a4f210b88e1e77f...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
