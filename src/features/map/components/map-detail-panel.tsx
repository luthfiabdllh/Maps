'use client';

import React from 'react';
import { useMapStore } from '@/store/map.store';
import poiDataRaw from "@/lib/data/poi-data.json";
import { type MapData, type POILocation } from "@/types/poi";
import { X, Clock, Navigation } from 'lucide-react';

const { pois: poiData, regions: regionData } = poiDataRaw as MapData;

export function MapDetailPanel() {
  const { selectedPoiId, clearSelectedPoi } = useMapStore();
  
  const selectedPoi = poiData.find(poi => poi.id === selectedPoiId);
  const selectedRegion = regionData.find(region => region.id === selectedPoiId);
  const activeData = selectedPoi || selectedRegion;
  const isPoi = activeData && 'category' in activeData;

  return (
    <div 
      className={`fixed bottom-0 left-0 w-full z-20 pointer-events-none transition-transform duration-300 ease-in-out md:bottom-auto md:top-24 md:left-4 md:w-96 ${
        activeData ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-[-120%]'
      }`}
    >
      <div className="w-full bg-white rounded-t-3xl md:rounded-3xl shadow-2xl pointer-events-auto flex flex-col max-h-[85vh] overflow-hidden">
        {/* Handle for mobile */}
        <div className="w-full flex justify-center py-3 md:hidden">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {activeData && (
          <>
            {/* Header / Image (Placeholder for now since we don't have actual images) */}
            <div className="relative w-full h-48 bg-gray-200">
              {/* Optional: Add Next/Image later */}
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full p-2 cursor-pointer shadow-sm hover:bg-white transition-colors" onClick={clearSelectedPoi}>
                <X className="w-5 h-5 text-gray-700" />
              </div>
              {activeData.thumbnailUrl ? (
                <img src={activeData.thumbnailUrl} alt={activeData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>[ Foto Thumbnail ]</span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
                    {isPoi ? (activeData as POILocation).category : 'Wilayah'}
                  </span>
                  {isPoi && (activeData as POILocation).meta?.isHalal && (
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-green-100 text-green-700">
                      Halal
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-foreground leading-tight">{activeData.name}</h2>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {activeData.description || 'Tidak ada deskripsi.'}
              </p>

              {/* Meta Info */}
              {isPoi && (activeData as POILocation).meta?.openHours && (
                <div className="flex items-center gap-2 text-sm text-foreground bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">Jam Operasional:</span>
                  <span>{(activeData as POILocation).meta?.openHours}</span>
                </div>
              )}

              {/* Action Button */}
              <button className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md active:scale-[0.98]">
                <Navigation className="w-4 h-4" />
                <span>Arahkan ke Sini</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
