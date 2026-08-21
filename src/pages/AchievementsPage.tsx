import React, { useState } from 'react';
import type { AchievementItem, UserRole } from '../types';
import { AchievementCard } from '../components/AchievementCard';
import { Award, Plus, Search, X, Upload, CheckCircle2 } from 'lucide-react';

interface AchievementsPageProps {
  achievements: AchievementItem[];
  currentRole: UserRole;
  onAddAchievement: (newAch: Partial<AchievementItem>) => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  achievements,
  currentRole,
  onAddAchievement,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDetail, setSelectedDetail] = useState<AchievementItem | null>(null);

  // Modal Form State
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    category: 'Hackathon',
    date: 'February 2026',
    description: '',
    proofFileName: '',
  });

  const categories = ['All', 'Hackathon', 'Academic', 'Research', 'Sports', 'Internship', 'Certification', 'Leadership'];

  const filtered = achievements.filter((ach) => {
    const matchesRole = ach.role === currentRole || ach.role === 'student';
    const matchesCategory = selectedCategory === 'All' || ach.category === selectedCategory;
    const matchesSearch = ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ach.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ach.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.organization) return;

    onAddAchievement({
      title: formData.title,
      organization: formData.organization,
      category: formData.category as any,
      date: formData.date,
      description: formData.description,
      verified: true,
      badgeType: formData.category === 'Hackathon' ? 'Trophy' : formData.category === 'Research' ? 'Scroll' : 'Medal',
      role: currentRole,
    });

    setIsModalOpen(false);
    setFormData({
      title: '',
      organization: '',
      category: 'Hackathon',
      date: 'February 2026',
      description: '',
      proofFileName: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-navy-50 text-navy-800 text-xs font-bold mb-3 border border-navy-200">
            <Award className="w-4 h-4" />
            <span>Digital Academic & Professional Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">My Achievements</h1>
          <p className="text-navy-500 text-sm mt-1 max-w-xl">
            A verified record of your academic distinctions, hackathon victories, research publications, certifications, and extracurricular milestones.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-navy-800 text-white font-extrabold text-sm hover:bg-navy-900 transition-all shadow-md flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Achievement</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
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

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search achievements..."
            className="w-full pl-9 pr-3 py-1.5 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-900 focus:outline-none focus:bg-white focus:border-navy-800"
          />
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ach) => (
          <AchievementCard 
            key={ach.id} 
            achievement={ach} 
            onSelect={(item) => setSelectedDetail(item)}
          />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-navy-100 relative">
            <button 
              onClick={() => setSelectedDetail(null)}
              className="absolute top-4 right-4 p-1 text-navy-400 hover:text-navy-900 rounded-lg hover:bg-navy-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-xl bg-navy-800 text-white font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500">{selectedDetail.category}</span>
                <h3 className="text-lg font-extrabold text-navy-900">{selectedDetail.title}</h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-navy-700 bg-navy-50 p-4 rounded-xl border border-navy-100 mb-6">
              <div>
                <span className="font-semibold text-navy-400">Issuing Organization / Event:</span>
                <p className="font-bold text-navy-900 text-sm">{selectedDetail.organization}</p>
              </div>
              <div>
                <span className="font-semibold text-navy-400">Date Received:</span>
                <p className="font-bold text-navy-900">{selectedDetail.date}</p>
              </div>
              <div>
                <span className="font-semibold text-navy-400">Verification Status:</span>
                <p className="font-bold text-navy-800 flex items-center mt-0.5">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-navy-800" />
                  Dean Office Digitally Verified & Signed
                </p>
              </div>
              <div>
                <span className="font-semibold text-navy-400">Summary & Impact:</span>
                <p className="text-navy-800 leading-relaxed mt-0.5">{selectedDetail.description}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedDetail(null)}
              className="w-full py-2.5 rounded-xl bg-navy-800 text-white font-bold text-xs hover:bg-navy-900 transition-colors"
            >
              Close Record View
            </button>
          </div>
        </div>
      )}

      {/* Add Achievement Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-navy-100 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-navy-400 hover:text-navy-900 rounded-lg hover:bg-navy-50"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-navy-900 mb-1">Add New Achievement</h3>
            <p className="text-xs text-navy-500 mb-6">
              Submit your award, paper, hackathon rank, or certification for university verification.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Achievement Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Winner at Smart India Hackathon"
                  className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-900 focus:bg-white focus:border-navy-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-900 focus:bg-white focus:border-navy-800 focus:outline-none"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Academic">Academic</option>
                    <option value="Research">Research</option>
                    <option value="Sports">Sports</option>
                    <option value="Internship">Internship</option>
                    <option value="Certification">Certification</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Date Received *</label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. February 2026"
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-900 focus:bg-white focus:border-navy-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Issuing Organization / Event *</label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Google Developer Student Clubs / IEEE"
                  className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-900 focus:bg-white focus:border-navy-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Description & Impact</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe your achievement, project details, or rank..."
                  className="w-full px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-900 focus:bg-white focus:border-navy-800 focus:outline-none"
                />
              </div>

              {/* Certificate Upload Placeholder */}
              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Certificate / Verification Proof</label>
                <div className="border-2 border-dashed border-navy-200 rounded-xl p-4 text-center bg-navy-50/50 hover:bg-navy-50 cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 mx-auto text-navy-400 mb-1" />
                  <p className="text-xs font-semibold text-navy-700">Click to upload PDF or image proof</p>
                  <p className="text-[10px] text-navy-400 mt-0.5">Maximum file size: 10MB (PDF, PNG, JPG)</p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-navy-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-navy-50 text-navy-700 font-bold text-xs hover:bg-navy-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-navy-800 text-white font-bold text-xs hover:bg-navy-900 shadow-md"
                >
                  Submit Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
