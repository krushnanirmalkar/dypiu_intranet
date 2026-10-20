import React from 'react';
import { ArrowLeft, Shield, Lock, Mail, Database, Bell, UserCheck, KeyRound } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack?: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <div className="w-full min-h-full py-2 sm:py-4 px-1 sm:px-2 font-sans antialiased text-slate-700">
      {/* Back Button */}
      {onBack && (
        <div className="mb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#393678] hover:text-[#00afef] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      )}

      {/* Main Document Container - Matches DYPIU Intranet Design System */}
      <div className="w-full bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 sm:space-y-8">
        {/* Document Header */}
        <header className="border-b border-slate-100 pb-5 sm:pb-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#393678] font-serif-custom tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#00afef] uppercase">
            EFFECTIVE DATE: AUGUST 2026 • DYPIU UNIONE INTRANET
          </p>
        </header>

        {/* Section 1: Introduction */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <span>1. Introduction</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            Welcome to <strong className="text-[#393678] font-semibold">UniOne Intranet</strong>, the centralized digital campus portal for{' '}
            <strong className="text-[#393678] font-semibold">D. Y. Patil International University (DYPIU), Akurdi, Pune</strong>, accessible at{' '}
            <span className="inline-block bg-slate-100 text-[#00afef] font-mono text-[11px] sm:text-xs px-2 py-0.5 rounded border border-slate-200">
              intranet.dypiu.ac.in
            </span>. UniOne Intranet serves as the official hub connecting students, faculty, administrators, and staff to university circulars, institutional notices, academic services, and directory resources.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            DYPIU respects your privacy and is dedicated to safeguarding personal and academic data processed through UniOne. This Privacy Policy outlines the information we process, how it is utilized, access control protocols, and your rights as a member of the university community.
          </p>
        </section>

        {/* Section 2: Information We Process */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <Database className="w-4 h-4 text-[#00afef]" />
            <span>2. Information Collected Through the Intranet</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            To provide personalized intranet access, role-appropriate information, and secure single sign-on (SSO), UniOne collects and synchronizes the following categories of data:
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm pl-2 text-slate-600">
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <div>
                <strong className="text-[#393678] font-semibold">User Identity & Academic Profile:</strong> Full name, official university email address{' '}
                <span className="inline-block bg-slate-100 text-[#00afef] font-mono text-[11px] px-1.5 py-0.2 rounded border border-slate-200">
                  (@dypiu.ac.in)
                </span>, Permanent Registration Number (PRN / Student ID), Department / School (e.g., Computer Science & Engineering, Bioengineering, Design), Academic Program, and assigned role (Student, Faculty, Staff, Administrator).
              </div>
            </li>
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <div>
                <strong className="text-[#393678] font-semibold">Notice & Communication Data:</strong> Official announcements, notices, and circulars viewed, bookmarked, or published by authorized faculty and administrative officers.
              </div>
            </li>
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <div>
                <strong className="text-[#393678] font-semibold">Service Navigation & Quick-Access Preferences:</strong> Interaction records with university digital services (such as Juno ERP, UDMS, DYPIU Library Portal, and IT Service Desk) used to optimize the intranet quick-launcher.
              </div>
            </li>
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <div>
                <strong className="text-[#393678] font-semibold">Authentication & Security Logs:</strong> Authentication timestamps, session tokens, IP addresses, browser client information, and access logs recorded to safeguard institutional systems and prevent unauthorized access.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3: How Information is Used */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#00afef]" />
            <span>3. How We Use Intranet Information</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            Information processed within UniOne Intranet is utilized exclusively for genuine university operations, education delivery, and campus communication:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm pl-2 text-slate-600">
            <li className="flex items-start gap-2.5">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <span>Authenticating authorized students, faculty, and administrative staff through university Single Sign-On (SSO).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <span>Delivering targeted academic circulars, examination schedules, administrative guidelines, and urgent campus alerts.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <span>Providing single-click authenticated redirection to internal campus portals (Juno ERP, UDMS, Library, IT Helpdesk).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <span>Facilitating official campus contact lookup via the university directory for academic and administrative collaboration.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <span>Maintaining security audits and monitoring system integrity to safeguard university data from unauthorized access.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Authentication & Access Control */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#00afef]" />
            <span>4. Authentication & Access Control</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            Access to UniOne Intranet is restricted to active members of the DYPIU community with verified university credentials. Authentication is governed by campus Keycloak Single Sign-On (SSO) utilizing signed JSON Web Tokens (JWT) and secure HTTP-only cookies. Role-Based Access Control (RBAC) ensures users only access resources, admin panels, and publish tools corresponding to their verified administrative or academic roles.
          </p>
        </section>

        {/* Section 5: Data Storage & Security Practices */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#00afef]" />
            <span>5. Data Storage & Security Practices</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            UniOne Intranet employs standard institutional security safeguards:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm pl-2 text-slate-600">
            <li className="flex items-start gap-2.5">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <span>Transport Layer Security (TLS/HTTPS) encryption for all client-to-server data transmission.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <span>Segregated internal databases and access keys stored in private server environments without client exposure.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <span>Cross-Site Request Forgery (CSRF) protections and strict session timeouts to prevent session hijacking.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <span>Periodic vulnerability assessments and system patch management performed by university IT administrators.</span>
            </li>
          </ul>
        </section>

        {/* Section 6: Information Sharing & Authorized Access */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00afef]" />
            <span>6. Information Sharing & Authorized Access</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            <strong className="text-[#393678] font-semibold">We never sell, rent, or monetize your personal data.</strong> Information collected by UniOne Intranet is shared only within authorized university departments, academic deans, and IT administrators on a strict need-to-know basis to fulfill educational and statutory administrative functions.
          </p>
        </section>

        {/* Section 7: Cookies, Sessions & Local Storage */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight">
            7. Cookies & Session Technologies
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            UniOne Intranet uses only essential session cookies and local storage tokens required for platform functionality:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm pl-2 text-slate-600">
            <li className="flex items-start gap-2.5">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <div>
                <strong className="text-[#393678] font-semibold">Authentication Cookies:</strong> Secure cookies maintaining authenticated SSO sessions across intranet views.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <div>
                <strong className="text-[#393678] font-semibold">UI Preferences:</strong> Local storage keys storing interface preferences (such as notice filters and pinned services).
              </div>
            </li>
          </ul>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            UniOne does not use commercial advertising cookies, cross-site trackers, or third-party behavioral profiling scripts.
          </p>
        </section>

        {/* Section 8: Data Retention & User Rights */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#00afef]" />
            <span>8. Data Retention & User Privacy Rights</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            Intranet user records remain active for the duration of your official enrollment or employment with DYPIU. Following graduation or cessation of employment, intranet access credentials are decommissioned according to institutional IT exit policies, while statutory academic records are preserved as mandated by university regulations.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            You have the right to review your registered profile information and request corrections for inaccurate academic or directory details through the university registrar or your department administration.
          </p>
        </section>

        {/* Section 9: Contact Information */}
        <section className="bg-[#F8F9FC] border border-slate-200/80 rounded-2xl p-5 space-y-2">
          <h3 className="text-sm font-bold text-[#393678] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#00afef]" />
            <span>Privacy Inquiries & Support</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            For questions regarding intranet data privacy practices, profile corrections, or IT security concerns, please reach out to the university administration:
          </p>
          <div className="text-xs text-slate-700 space-y-0.5 pt-1">
            <p className="font-bold text-[#393678]">IT Directorate & Data Administration</p>
            <p>D. Y. Patil International University (DYPIU)</p>
            <p>Sector 29, Nigdi Pradhikaran, Akurdi, Pune, Maharashtra 411044</p>
            <p className="text-[#00afef] font-mono mt-1 font-semibold">it.support@dypiu.ac.in · intranet@dypiu.ac.in</p>
          </div>
        </section>
      </div>
    </div>
  );
};
