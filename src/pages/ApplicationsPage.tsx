import React, { useState } from 'react';
import type { ApplicationItem } from '../types';
import { ApplicationCard } from '../components/ApplicationCard';
import { Search, Star, ShieldCheck, ArrowLeft } from 'lucide-react';

interface ApplicationsPageProps {
  applications: ApplicationItem[];
  onOpenApp: (app: ApplicationItem) => void;
  onToggleFavorite: (appId: string) => void;
  onBack?: () => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  applications,
  onOpenApp,
  onToggleFavorite,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  const categories = ['All', 'Academic', 'Administration', 'Learning', 'Library', 'Examination', 'Career', 'Research', 'Productivity'];

  const filtered = applications.filter((app) => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = !favoritesOnly || app.isFavorite;
    return matchesCategory && matchesSearch && matchesFavorite;
  });

  const sortedApps = [...filtered].sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-200">
      {/* Page Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {onBack && (
              <>
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#393678] hover:text-[#00afef] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </button>
                <span className="text-slate-300">·</span>
              </>
            )}
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#00afef]/10 text-[#00afef] text-[11px] font-extrabold uppercase tracking-wider border border-[#00afef]/20">
              <ShieldCheck className="w-3 h-3 text-[#00afef]" />
              <span>Campus Digital Services</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#393678] font-serif-custom tracking-tight">
            University Digital Services & Applications
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Access the official university portals, enterprise tools, and cloud services assigned to your student/staff account.
          </p>
        </div>

        {onBack && (
          <div className="shrink-0">
            <button
              onClick={onBack}
              className="rounded-xl bg-[#0A1328] hover:bg-[#152347] text-white px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
            >
              Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-[#393678] text-white shadow-xs' 
                  : 'bg-[#F1F1F7] text-slate-700 hover:bg-[#E6E6F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Search & Favorite Filter */}
        <div className="flex items-center space-x-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 border transition-all shrink-0 cursor-pointer ${
              favoritesOnly 
                ? 'bg-[#faa831] text-white border-[#faa831]' 
                : 'bg-[#F1F1F7] text-slate-700 border-slate-200 hover:bg-[#E6E6F0]'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Favorites</span>
          </button>

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#F1F1F7] hover:bg-[#E6E6F0] focus:bg-white border border-transparent focus:border-[#393678] rounded-full text-xs text-slate-700 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid of Applications */}
      <div className="applications-card-grid">
        {sortedApps.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            onOpenApp={onOpenApp}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
