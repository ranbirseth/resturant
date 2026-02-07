import React from 'react';
import { Layers } from 'lucide-react';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm font-sans">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="text-primary-billing" size={18} />
          <h2 className="text-lg font-black text-gray-800 tracking-tight">Sections</h2>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Filter Menu</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
            activeCategory === null 
            ? 'bg-primary-billing text-white shadow-lg shadow-orange-100' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${activeCategory === null ? 'bg-white' : 'bg-gray-200'}`} />
          All Items
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm text-left ${
              activeCategory === cat 
              ? 'bg-primary-billing text-white shadow-lg shadow-orange-100' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
             <div className={`w-2 h-2 rounded-full ${activeCategory === cat ? 'bg-white' : 'bg-gray-200'}`} />
             {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
