import React from 'react';
import {
  Grid,
  ArrowRight,
  PhoneCall,
  Globe,
  ShieldCheck,
  Home as HomeIcon,
  Users,
  Search
} from 'lucide-react';
import { LeftEdgeDarkSwoosh, BottomRightCornerSwoosh } from './DecorativeShapes';

export const WebApplications = () => {
  const nodes = [
    {
      id: 'juno',
      name: 'JUNO',
      icon: PhoneCall,
      pos: 'top-1 left-1/2 -translate-x-1/2',
    },
    {
      id: 'udms',
      name: 'UDMS',
      icon: Globe,
      pos: 'top-12 left-10',
    },
    {
      id: 'unisync',
      name: 'UNISYNC',
      icon: ShieldCheck,
      pos: 'top-12 right-10',
    },
    {
      id: 'hostel',
      name: 'HOSTEL DESK',
      icon: HomeIcon,
      pos: 'bottom-12 left-12',
    },
    {
      id: 'club',
      name: 'CLUB ZONE',
      icon: Users,
      pos: 'bottom-12 right-12',
    },
    {
      id: 'other',
      name: 'OTHER APPS',
      icon: Grid,
      pos: 'bottom-1 left-1/2 -translate-x-1/2',
    },
  ];

  return (
    <div className="relative bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full min-h-[300px] overflow-hidden">
      {/* Left edge dark navy swoosh */}
      <LeftEdgeDarkSwoosh />

      {/* Bottom right decorative corner graphic */}
      <BottomRightCornerSwoosh className="w-24 h-16" />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-[#0057A8] rounded-lg">
            <Grid className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold tracking-tight text-[#002B5C] uppercase">
              WEB APPLICATIONS
            </h3>
            <p className="text-[10px] text-slate-500 font-normal">
              Your digital campus, in one place.
            </p>
          </div>
        </div>
        <a
          href="#apps"
          className="text-[10px] font-semibold text-[#0057A8] hover:text-[#002B5C] flex items-center gap-1 transition-colors cursor-pointer"
        >
          View all <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Network / Orbit Diagram Area */}
      <div className="relative w-full h-[220px] my-auto flex items-center justify-center">
        {/* Background Orbit Lines & Connection Dots */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-200/60 stroke-1">
          {/* Elliptical Orbits */}
          <ellipse cx="50%" cy="50%" rx="42%" ry="38%" fill="none" strokeDasharray="3 3" />
          <ellipse cx="50%" cy="50%" rx="26%" ry="22%" fill="none" strokeDasharray="2 2" strokeOpacity="0.4" />

          {/* Connection Lines from Center (50%, 50%) to Nodes */}
          <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50%" cy="32%" r="3" fill="#3B82F6" />

          <line x1="50%" y1="50%" x2="22%" y2="28%" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="35%" cy="40%" r="3" fill="#3B82F6" />

          <line x1="50%" y1="50%" x2="78%" y2="28%" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="65%" cy="40%" r="3" fill="#3B82F6" />

          <line x1="50%" y1="50%" x2="25%" y2="72%" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="36%" cy="62%" r="3" fill="#3B82F6" />

          <line x1="50%" y1="50%" x2="75%" y2="72%" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="64%" cy="62%" r="3" fill="#3B82F6" />

          <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50%" cy="68%" r="3" fill="#3B82F6" />

          <circle cx="18%" cy="46%" r="2" fill="#60A5FA" opacity="0.6" />
          <circle cx="82%" cy="46%" r="2" fill="#60A5FA" opacity="0.6" />
        </svg>

        {/* CENTER MAIN NODE: RESEARCH HUB */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group">
          <div className="bg-gradient-to-br from-[#003B70] via-[#002D62] to-[#001D40] text-white px-6 py-3 rounded-full shadow-md border border-blue-400/30 flex items-center gap-2 group-hover:scale-105 transition-all duration-200">
            <Search className="w-3.5 h-3.5 text-blue-300 stroke-[2.5]" />
            <span className="text-[11px] font-bold tracking-wider uppercase">
              RESEARCH HUB
            </span>
          </div>
        </div>

        {/* SURROUNDING APP NODES */}
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.id}
              className={`absolute ${node.pos} z-10 cursor-pointer group`}
            >
              <div
                className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-full shadow-2xs flex flex-col items-center justify-center gap-0.5 group-hover:bg-slate-100 group-hover:border-slate-300 group-hover:scale-105 transition-all duration-200 min-w-[82px]"
              >
                <Icon className="w-3 h-3 text-[#0057A8] stroke-[2]" />
                <span className="text-[9px] font-semibold tracking-wider uppercase text-slate-700">
                  {node.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
