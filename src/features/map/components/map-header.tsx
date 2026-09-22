'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { useMapStore } from '@/store/map.store';

const CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: 'rides', label: 'Wahana' },
  { id: 'food', label: 'Kuliner' },
  { id: 'facility', label: 'Fasilitas' },
  { id: 'gate', label: 'Pintu Masuk' },
];

export function MapHeader() {
  const { activeCategory, searchQuery, setActiveCategory, setSearchQuery } = useMapStore();

  return (
    <div className="absolute top-0 left-0 w-full z-10 bg-linear-to-b from-black/50 to-transparent p-4 pb-8 flex flex-col gap-3 pointer-events-none">
      {/* Search Bar */}
      <div className="relative w-full max-w-md mx-auto pointer-events-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-2xl bg-white/95 backdrop-blur-sm text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-lg transition-all"
          placeholder="Cari wahana, makanan, atau fasilitas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Chips */}
      <div className="w-full overflow-x-auto pb-2 -mb-2 pointer-events-auto scrollbar-hide">
        <div className="flex gap-2 w-max px-2 md:mx-auto">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id || (category.id === 'all' && !activeCategory);
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id === 'all' ? null : category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-md ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white/95 text-foreground hover:bg-gray-100 backdrop-blur-sm'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
