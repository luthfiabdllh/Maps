'use client';

import React from 'react';
import { useMapStore } from '@/store/map.store';
import poiDataRaw from "@/lib/data/poi-data.json";
import { type MapData, type POILocation } from "@/types/poi";
import { Clock, Navigation } from 'lucide-react';
import { type Dictionary } from '@/lib/dictionaries/en';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMediaQuery } from '@/hooks/use-media-query';

const { pois: poiData, regions: regionData } = poiDataRaw as MapData;

interface MapDetailPanelProps {
  dict: Dictionary;
}

export function MapDetailPanel({ dict }: MapDetailPanelProps) {
  const { selectedPoiId, clearSelectedPoi } = useMapStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  const selectedPoi = poiData.find(poi => poi.id === selectedPoiId);
  const selectedRegion = regionData.find(region => region.id === selectedPoiId);
  const activeData = selectedPoi || selectedRegion;
  const isPoi = activeData && 'category' in activeData;

  const getCategoryLabel = (cat: string) => {
    if (cat === 'rides') return dict.map.categories.rides;
    if (cat === 'food') return dict.map.categories.food;
    if (cat === 'facility') return dict.map.categories.facility;
    if (cat === 'gate') return dict.map.categories.gate;
    return cat;
  };

  return (
    <Sheet open={!!activeData} onOpenChange={(open) => !open && clearSelectedPoi()}>
      <SheetContent 
        side={isDesktop ? "left" : "bottom"} 
        className="w-full md:w-100 p-0 flex flex-col gap-0 border-none shadow-2xl rounded-t-3xl md:rounded-none h-[85vh] md:h-full z-20 pointer-events-auto"
      >
        <div className="relative w-full h-48 md:h-64 shrink-0 bg-muted">
          {activeData?.thumbnailUrl ? (
            <img src={activeData.thumbnailUrl} alt={activeData.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Skeleton className="w-full h-full absolute inset-0 rounded-none" />
              <div className="z-10 bg-background/80 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium">
                {dict.map.noImage}
              </div>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="flex flex-col gap-4">
            <SheetHeader className="text-left space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
                  {isPoi ? getCategoryLabel((activeData as POILocation).category) : 'Wilayah'}
                </span>
                {isPoi && (activeData as POILocation).meta?.isHalal && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    Halal
                  </span>
                )}
              </div>
              <SheetTitle className="text-2xl font-bold leading-tight">{activeData?.name}</SheetTitle>
              <SheetDescription className="text-sm leading-relaxed mt-2 text-muted-foreground">
                {activeData?.description || dict.common.noResults}
              </SheetDescription>
            </SheetHeader>

            {isPoi && (activeData as POILocation).meta?.openHours && (
              <div className="flex items-center gap-2 text-sm bg-muted/50 p-3 rounded-xl border">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium">Jam Operasional:</span>
                <span>{(activeData as POILocation).meta?.openHours}</span>
              </div>
            )}

            <button className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md active:scale-[0.98]">
              <Navigation className="w-4 h-4" />
              <span>{dict.map.directions}</span>
            </button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
