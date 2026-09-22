'use client';

import React from 'react';
import { useMapStore } from '@/store/map.store';
import { type Dictionary } from '@/lib/dictionaries/en';
import ExpandableSearchBar from '@/components/animate-ui/primitives/effects/ExpandableSearchBar';
import { ThemeToggle } from '@/components/theme-toggle';

interface MapHeaderProps {
  dict: Dictionary;
}

export function MapHeader({ dict }: MapHeaderProps) {
  const { activeCategory, setActiveCategory, setSearchQuery } = useMapStore();

  const categories = [
    { id: 'all', label: dict.map.allCategories },
    { id: 'rides', label: dict.map.categories.rides },
    { id: 'food', label: dict.map.categories.food },
    { id: 'facility', label: dict.map.categories.facility },
    { id: 'gate', label: dict.map.categories.gate },
  ];

  return (
    <div className="absolute top-0 left-0 w-full z-10 p-4 pb-8 flex flex-col gap-3 pointer-events-none">
      {/* Top Bar: Search & Theme Toggle */}
      <div className="flex w-full justify-end items-center gap-2 pointer-events-auto">
        <ExpandableSearchBar
          expandDirection="left"
          width={250}
          placeholder={dict.map.searchPlaceholder}
          onSearch={(q) => setSearchQuery(q)}
        />
        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>

      {/* Category Chips */}
      {/* <div className="w-full overflow-x-auto pb-2 -mb-2 pointer-events-auto scrollbar-hide">
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
                    : 'bg-background/95 text-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-sm border-0'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div> */}
    </div>
  );
}
