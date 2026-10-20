import React from 'react';
import { ArrowLeft, ShieldAlert, Mail, FileCheck, Shield, KeyRound, Globe } from 'lucide-react';

interface TermsConditionsPageProps {
  onBack?: () => void;
}

export const TermsConditionsPage: React.FC<TermsConditionsPageProps> = ({ onBack }) => {
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
            Terms of Service
          </h1>
          <p className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#00afef] uppercase">
            EFFECTIVE DATE: AUGUST 2026 • DYPIU UNIONE INTRANET
          </p>
        </header>

        {/* Section 1: Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <span>1. Acceptance of Terms</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            By logging into or accessing <strong className="text-[#393678] font-semibold">UniOne Intranet</strong>{' '}
            (<span className="inline-block bg-slate-100 text-[#00afef] font-mono text-[11px] sm:text-xs px-2 py-0.5 rounded border border-slate-200">
              intranet.dypiu.ac.in
            </span>), you agree to comply with and be bound by these Terms of Service and applicable university IT regulations. UniOne is developed and operated under the authority of{' '}
            <strong className="text-[#393678] font-semibold">D. Y. Patil International University (DYPIU), Akurdi, Pune</strong>. If you do not agree to these terms, you are not authorized to use the platform.
          </p>
        </section>

        {/* Section 2: Eligibility & Account Security */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#00afef]" />
            <span>2. Eligibility & Account Security</span>
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm pl-2 text-slate-600">
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <div>
                Access to UniOne is granted exclusively to registered students, faculty, administrative staff, and authorized contractors possessing valid DYPIU credentials{' '}
                <span className="inline-block bg-slate-100 text-[#00afef] font-mono text-[11px] px-1.5 py-0.2 rounded border border-slate-200">
                  (@dypiu.ac.in)
                </span>.
              </div>
            </li>
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <div>
                You are strictly responsible for maintaining the confidentiality of your Single Sign-On (SSO) credentials and active sessions. Credential sharing or lending account access to unauthorized third parties is strictly prohibited.
              </div>
            </li>
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#00afef] font-bold mt-1">•</span>
              <div>
                Any suspected unauthorized access, session compromise, or security anomalies must be reported immediately to the university IT Helpdesk.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3: Acceptable Use Policy */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00afef]" />
            <span>3. Acceptable Use Policy</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Users agree <strong className="text-[#f16136] font-bold uppercase">NOT</strong> to engage in any of the following prohibited activities:
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm pl-2 text-slate-600">
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#f16136] font-bold mt-1">•</span>
              <div>
                Attempting unauthorized privilege escalation to administrative panels, notice publication queues, or role management consoles.
              </div>
            </li>
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#f16136] font-bold mt-1">•</span>
              <div>
                Deploying automated scrapers, web crawlers, or harvesting tools to collect campus directory listings, student records, or staff email contacts.
              </div>
            </li>
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#f16136] font-bold mt-1">•</span>
              <div>
                Interfering with intranet server infrastructure, introducing malicious scripts or payloads, or executing denial-of-service attempts.
              </div>
            </li>
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#f16136] font-bold mt-1">•</span>
              <div>
                Publishing, broadcasting, or transmitting inaccurate, unauthorized, defamatory, or unlawful circulars or materials across the university portal.
              </div>
            </li>
            <li className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#f16136] font-bold mt-1">•</span>
              <div>
                Bypassing or attempting to circumvent SSO authentication gateways, session limits, or security filters.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 4: Accuracy of Submitted Information */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#00afef]" />
            <span>4. Accuracy & Integrity of Information</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            Authorized publishers (departments, school deans, committee coordinators) must ensure that official circulars, examination announcements, and administrative guidelines uploaded to UniOne are truthful, verified, and officially sanctioned. Impersonating university officials or fabricating circular notices constitutes serious misconduct subject to disciplinary proceedings.
          </p>
        </section>

        {/* Section 5: Intellectual Property */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight">
            5. Intellectual Property & Ownership
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            All visual identities, logos, crests, brand tokens, interface layouts, and software architectures associated with DYPIU UniOne Intranet are the exclusive property of D. Y. Patil International University. Unauthorized reproduction, modification, decompilation, or external distribution is prohibited without prior written approval from university administration.
          </p>
        </section>

        {/* Section 6: Service Availability & Third-Party Portals */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00afef]" />
            <span>6. Service Availability & Campus Portals</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            UniOne provides single-click navigation links to internal university management software (including Juno ERP, UDMS, and the Library Portal). While DYPIU endeavors to ensure continuous availability, individual third-party services and campus ERPs may undergo scheduled maintenance or unexpected technical downtime independent of the UniOne Intranet shell.
          </p>
        </section>

        {/* Section 7: Suspension & Termination */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#f16136]" />
            <span>7. Suspension & Access Revocation</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            University IT administrators reserve the right to immediately suspend, restrict, or revoke intranet access privileges for any account involved in security violations, unacceptable use, academic dishonesty, or violation of university disciplinary codes.
          </p>
        </section>

        {/* Section 8: Disclaimers & Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight">
            8. Disclaimers & Limitation of Liability
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            UniOne Intranet is provided &ldquo;as is&rdquo; for informational and institutional workflow support. DYPIU makes reasonable efforts to ensure accuracy and continuous availability but does not warrant error-free operations. DYPIU shall not be liable for losses or academic inconvenience resulting from network outages, third-party ERP downtime, or compromised personal user devices.
          </p>
        </section>

        {/* Section 9: Amendments & Governing Law */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#393678] tracking-tight">
            9. Amendments & Governing Law
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            These terms are governed by the statutory regulations of D. Y. Patil International University, Akurdi, Pune, and applicable laws of India. University authorities reserve the right to revise these terms to reflect technological enhancements or administrative updates.
          </p>
        </section>

        {/* Section 10: Inquiries & Contact */}
        <section className="bg-[#F8F9FC] border border-slate-200/80 rounded-2xl p-5 space-y-2">
          <h3 className="text-sm font-bold text-[#393678] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#00afef]" />
            <span>Questions & Institutional Inquiries</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            For questions regarding these Terms of Service or to report intranet system irregularities, please contact:
          </p>
          <div className="text-xs text-slate-700 space-y-0.5 pt-1">
            <p className="font-bold text-[#393678]">IT Directorate & Administration</p>
            <p>D. Y. Patil International University (DYPIU)</p>
            <p>Sector 29, Nigdi Pradhikaran, Akurdi, Pune, Maharashtra 411044</p>
            <p className="text-[#00afef] font-mono mt-1 font-semibold">it.support@dypiu.ac.in · admin@dypiu.ac.in</p>
          </div>
        </section>
      </div>
    </div>
  );
};
