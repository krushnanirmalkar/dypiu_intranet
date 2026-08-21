import React, { useState } from 'react';
import type { ApplicationItem, UserRole } from '../types';
import { ApplicationCard } from '../components/ApplicationCard';
import { Search, Star, ShieldCheck } from 'lucide-react';

interface ApplicationsPageProps {
  applications: ApplicationItem[];
  currentRole: UserRole;
  onOpenApp: (app: ApplicationItem) => void;
  onToggleFavorite: (appId: string) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  applications,
  currentRole,
  onOpenApp,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  const categories = ['All', 'Academic', 'Administration', 'Learning', 'Library', 'Examination', 'Career', 'Research', 'Productivity'];

  const roleFiltered = applications.filter((app) =>
    app.targetRoles.includes(currentRole)
  );

  const filtered = roleFiltered.filter((app) => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = !favoritesOnly || app.isFavorite;
    return matchesCategory && matchesSearch && matchesFavorite;
  });

  // Sort favorites to top if all view
  const sortedApps = [...filtered].sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Banner Header */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-navy-50 text-navy-800 text-xs font-bold mb-3 border border-navy-200">
            <ShieldCheck className="w-4 h-4" />
            <span>Single Sign-On (SSO) Central Application Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">University Digital Services & Applications</h1>
          <p className="text-navy-500 text-sm mt-1 max-w-2xl">
            Access all university digital services (Juno, UniSync, Canvas LMS, ERP, Examination, Library) without re-authenticating.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-navy-800 text-white shadow-sm' 
                  : 'bg-navy-50 text-navy-700 hover:bg-navy-100 border border-navy-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Search & Favorite Filter */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 border transition-all ${
              favoritesOnly 
                ? 'bg-navy-800 text-white border-navy-800' 
                : 'bg-navy-50 text-navy-700 border-navy-200 hover:bg-navy-100'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Favorites</span>
          </button>

          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-9 pr-3 py-1.5 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-900 focus:outline-none focus:bg-white focus:border-navy-800"
            />
          </div>
        </div>
      </div>

      {/* Grid of Applications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
