import { create } from 'zustand';

interface MapState {
  selectedPoiId: string | null;
  activeCategory: string | null;
  searchQuery: string;
  setSelectedPoiId: (id: string | null) => void;
  clearSelectedPoi: () => void;
  setActiveCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedPoiId: null,
  activeCategory: null,
  searchQuery: '',
  setSelectedPoiId: (id) => set({ selectedPoiId: id }),
  clearSelectedPoi: () => set({ selectedPoiId: null }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
