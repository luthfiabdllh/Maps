'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { useMapStore } from '@/store/map.store';
import { type Dictionary } from '@/lib/dictionaries/en';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';

interface MapHeaderProps {
  dict: Dictionary;
}

export function MapHeader({ dict }: MapHeaderProps) {
  const { activeCategory, searchQuery, setActiveCategory, setSearchQuery } = useMapStore();

  const categories = [
    { id: 'all', label: dict.map.allCategories },
    { id: 'rides', label: dict.map.categories.rides },
    { id: 'food', label: dict.map.categories.food },
    { id: 'facility', label: dict.map.categories.facility },
    { id: 'gate', label: dict.map.categories.gate },
  ];

  return (
    <div className="absolute top-0 left-0 w-full z-10 bg-linear-to-b from-black/50 to-transparent p-4 pb-8 flex flex-col gap-3 pointer-events-none">
      {/* Top Bar: Search & Theme Toggle */}
      <div className="flex w-full max-w-md mx-auto gap-2">
        <div className="relative w-full pointer-events-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            className="block w-full pl-10 pr-3 py-6 rounded-2xl bg-white/95 dark:bg-black/50 backdrop-blur-sm text-sm placeholder:text-muted-foreground border-0 shadow-lg transition-all"
            placeholder={dict.map.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>

      {/* Category Chips */}
      <div className="w-full overflow-x-auto pb-2 -mb-2 pointer-events-auto scrollbar-hide">
        <div className="flex gap-2 w-max px-2 md:mx-auto">
          {categories.map((category) => {
            const isActive = activeCategory === category.id || (category.id === 'all' && !activeCategory);
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id === 'all' ? null : category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-md ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white/95 dark:bg-black/50 text-foreground hover:bg-gray-100 dark:hover:bg-black/70 backdrop-blur-sm border-0'
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
