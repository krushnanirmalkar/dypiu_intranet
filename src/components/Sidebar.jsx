import React, { useState } from 'react';
import {
  Home,
  Search,
  Building,
  Users,
  MessageSquare,
  HelpCircle,
  PhoneCall,
  Globe,
  ShieldCheck,
  Grid,
  ChevronRight,
  X,
  FileText,
  Download
} from 'lucide-react';

export const Sidebar = (/** @type {any} */ {
  isOpen = false,
  onClose,
  applications: propApplications,
  policies: propPolicies,
  onOpenApp,
  onNavigate,
  user
} = {}) => {
  const [activeItem, setActiveItem] = useState('Home');
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const defaultWebApplications = [
    {
      id: 'policies',
      name: 'University Policies',
      icon: FileText,
      desc: 'Rules & Directives',
      url: '#policies'
    },
    {
      id: 'research',
      name: 'Research Hub',
      icon: Search,
      desc: 'Library & Journals',
      url: 'https://library.dypiu.ac.in'
    },
    {
      id: 'juno',
      name: 'Juno Portal',
      icon: PhoneCall,
      desc: 'Campus Support',
      url: 'https://erp.dypiu.ac.in'
    },
    {
      id: 'udms',
      name: 'UDMS System',
      icon: Globe,
      desc: 'Data Management',
      url: 'https://udms.dypiu.ac.in'
    },
    {
      id: 'unisync',
      name: 'UniSync Portal',
      icon: ShieldCheck,
      desc: 'Real-time Sync',
      url: 'https://unisync.dypiu.ac.in'
    },
    {
      id: 'hostel',
      name: 'Hostel Desk',
      icon: Building,
      desc: 'Accommodation',
      url: 'https://hostel.dypiu.ac.in'
    },
    {
      id: 'club',
      name: 'Club Zone',
      icon: Users,
      desc: 'Societies & Events',
      url: 'https://clubs.dypiu.ac.in'
    },
    {
      id: 'support',
      name: 'IT Helpdesk',
      icon: HelpCircle,
      desc: 'Tech Assistance',
      url: 'https://helpdesk.dypiu.ac.in'
    }
  ];

  const iconLookup = {
    FileText,
    Search,
    PhoneCall,
    Globe,
    ShieldCheck,
    Building,
    Users,
    HelpCircle,
    GraduationCap: Building,
    BookOpen: Search,
    Laptop: Globe,
    Bookmark: FileText
  };

  const webApplications = (propApplications && propApplications.length > 0)
    ? propApplications.slice(0, 8).map((app) => ({
        id: app.id,
        name: app.name,
        icon: iconLookup[app.iconName || app.icon] || FileText,
        desc: app.description || 'Digital Campus Service',
        url: app.url
      }))
    : defaultWebApplications;

  const menuSections = [
    {
      title: 'UTILITY',
      items: [
        { label: 'Uni Policies', icon: FileText },
        { label: 'Grievance', icon: MessageSquare },
        { label: 'Help & Support', icon: HelpCircle }
      ]
    },
  ];

  const handleAppClick = (app) => {
    setActiveItem(app.name);
    if (app.id === 'policies' || app.name.toLowerCase().includes('policies')) {
      setIsPoliciesOpen(true);
    } else if (onOpenApp) {
      onOpenApp(app);
    } else if (app.url && /^https?:\/\//i.test(app.url)) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const handleItemClick = (label) => {
    setActiveItem(label);
    if (label === 'Uni Policies') {
      setIsPoliciesOpen(true);
    } else if (label === 'Admin Portal') {
      onNavigate?.('admin');
    } else if (label === 'Help & Support') {
      window.open('https://helpdesk.dypiu.ac.in', '_blank', 'noopener,noreferrer');
    } else if (label === 'Grievance') {
      window.open('https://grievance.dypiu.ac.in', '_blank', 'noopener,noreferrer');
    }
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const directoryList = [
    { name: 'Dr. Ananya Sharma', role: 'Dean Academics' },
    { name: 'Prof. Rahul Deshmukh', role: 'CSE Faculty' },
    { name: 'Ms. Priya Nair', role: 'Registrar Office' },
    { name: 'Dr. Vikram Patil', role: 'Research & Innovation Head' },
  ];

  const defaultPoliciesList = [
    {
      title: 'Academic Integrity & Examination Code',
      category: 'ACADEMICS',
      desc: 'Guidelines on attendance, mid-term evaluations, and examination ethics.'
    },
    {
      title: 'IT Infrastructure & Wi-Fi Policy',
      category: 'INFRASTRUCTURE',
      desc: 'Acceptable use policy for campus high-speed network and digital portal access.'
    },
    {
      title: 'Student Code of Conduct & Safety Directives',
      category: 'CAMPUS LIFE',
      desc: 'Disciplinary guidelines, anti-ragging regulations, and campus ID protocols.'
    },
    {
      title: 'Hostel & Residential Regulations 2026',
      category: 'HOSTEL',
      desc: 'Rules regarding entry timings, guest policies, and warden assistance.'
    }
  ];

  const policiesList = (propPolicies && propPolicies.length > 0)
    ? propPolicies.map((p) => ({
        title: p.title,
        category: (p.category || 'GENERAL').toUpperCase(),
        desc: p.summary || p.content || ''
      }))
    : defaultPoliciesList;

  const filteredDirectory = directoryList.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar (Drawer on mobile/tablet, fixed static side panel on desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[#0A1328] text-white flex flex-col shrink-0 h-screen lg:h-full border-r border-[#040A14] transition-transform duration-300 ease-in-out overflow-y-auto lg:overflow-hidden lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-3 flex-1 flex flex-col justify-start lg:justify-between pb-16 lg:pb-3">
          {/* Mobile Header with Close Button */}
          <div className="flex items-center justify-between px-2 pt-1 pb-1 lg:hidden border-b border-white/10 mb-0.5">
            <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase">
              DYPIU Navigation
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Home Item */}
          <button
            onClick={() => {
              setActiveItem('Home');
              onNavigate?.('dashboard');
              if (window.innerWidth < 1024 && onClose) onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeItem === 'Home'
                ? 'bg-[#00afef] text-white shadow-md shadow-[#00afef]/20'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Home</span>
          </button>

          {/* WEB APPLICATIONS SECTION */}
          <div className="space-y-2 pt-1">
            {/* Section Header */}
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                WEB APPLICATIONS
              </h3>
              <span className="text-[9px] font-semibold bg-white/5 text-slate-400 px-2 py-0.5 rounded-full border border-white/10">
                {webApplications.length} APPS
              </span>
            </div>

            {/* Apps Cards 2-Column Grid (White card with exact top-right sharp square icon block) */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {webApplications.map((app) => {
                const Icon = app.icon;
                const isActive = activeItem === app.name;
                return (
                  <button
                    key={app.id}
                    onClick={() => handleAppClick(app)}
                    className={`relative p-2.5 sm:p-3 bg-white rounded-lg shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group text-left flex flex-col justify-between min-h-[88px] sm:min-h-[96px] border border-slate-100 overflow-hidden ${
                      isActive
                        ? 'ring-2 ring-[#00afef] ring-offset-2 ring-offset-[#0A1328] scale-[1.02]'
                        : 'hover:scale-[1.02]'
                    }`}
                  >
                    {/* Top Right Exact Sharp Square Icon Badge */}
                    <div className="absolute top-0 right-0 w-9 h-9 sm:w-10 sm:h-10 bg-[#f16136] rounded-tr-lg rounded-none flex items-center justify-center text-white shadow-2xs group-hover:bg-[#d94820] transition-colors">
                      <Icon className="w-4 h-4 stroke-[2.5]" />
                    </div>

                    {/* Top Left Title */}
                    <div className="pr-8 sm:pr-9 pt-0.5">
                      <h4 className="text-[10.5px] font-extrabold text-[#393678] uppercase tracking-tight leading-tight group-hover:text-[#f16136] transition-colors">
                        {app.name}
                      </h4>
                    </div>

                    {/* Bottom Subtitle */}
                    <p className="text-[9px] text-slate-500 font-medium truncate mt-1">
                      {app.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#00afef]/30 to-transparent my-2" />

          {/* Menu Sections (Uni Policies, Grievance & Help & Support) */}
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleItemClick(item.label)}
                      className={`w-full flex items-center gap-3 px-3 py-2 sm:py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#00afef] text-white'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 stroke-[1.75]" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Mobile Bottom Spacing & Brand Marker */}
          <div className="pt-2 pb-2 text-center text-[9.5px] text-slate-500 lg:hidden font-medium">
            DYPIU UniOne Portal &copy; 2026
          </div>
        </div>
      </aside>

      {/* Communication Channel Modal */}
      {isCommunicationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs select-none">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0A1328] p-5 text-white relative">
              <h3 className="text-base font-bold text-white tracking-tight">
                Communication Channel
              </h3>
              <p className="text-xs text-slate-300 font-normal mt-0.5">
                Search the campus directory
              </p>
              <button
                onClick={() => setIsCommunicationOpen(false)}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-3 bg-white">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search directory names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:border-[#00afef] outline-none transition-all"
                />
              </div>

              {/* Directory List */}
              <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-0.5 pt-1">
                {filteredDirectory.length > 0 ? (
                  filteredDirectory.map((person, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/80 hover:border-slate-200 transition-colors cursor-pointer group"
                    >
                      <h4 className="text-xs font-bold text-[#393678] group-hover:text-[#00afef] transition-colors">
                        {person.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {person.role}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No directory contacts found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uni Policies Modal */}
      {isPoliciesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs select-none">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0A1328] p-5 text-white relative">
              <h3 className="text-base font-bold text-white tracking-tight">
                DYPIU University Policies
              </h3>
              <p className="text-xs text-slate-300 font-normal mt-0.5">
                Official academic, IT, and campus regulations
              </p>
              <button
                onClick={() => setIsPoliciesOpen(false)}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-3 bg-white">
              <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {policiesList.map((policy, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-[#00afef]/40 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-bold text-[#00afef] bg-[#00afef]/10 px-2 py-0.5 rounded-md uppercase">
                        {policy.category}
                      </span>
                      <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00afef] transition-colors" />
                    </div>
                    <h4 className="text-xs font-bold text-[#393678] mt-1.5 group-hover:text-[#00afef] transition-colors">
                      {policy.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {policy.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsPoliciesOpen(false)}
                  className="px-4 py-2 bg-[#0A1328] hover:bg-[#002B5C] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Close Policies
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
