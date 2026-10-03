import React from 'react';
import { Filter } from 'lucide-react';

export const CATEGORIES = [
  'All',
  'Programming',
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'Languages',
  'Music',
  'Photography',
  'Video Editing',
  'Business',
  'Academic',
  'Communication',
  'Other',
];

export const PROFICIENCIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

const FilterBar = ({
  selectedCategory,
  onSelectCategory,
  selectedProficiency,
  onSelectProficiency,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 space-y-3">
      {/* Category Pills */}
      <div>
        <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          <Filter className="w-3.5 h-3.5 mr-1 text-indigo-600" />
          <span>Categories</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Proficiency Pills */}
      {selectedProficiency !== undefined && onSelectProficiency && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">
            Proficiency:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {PROFICIENCIES.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectProficiency(lvl)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                  selectedProficiency === lvl
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
