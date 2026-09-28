'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useMapStore } from '@/store/map.store';
import poiDataRaw from "@/lib/data/poi-data.json";
import { type MapData, type POILocation } from "@/types/poi";
import { Clock, MapPin, Map, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DynamicLucideIcon } from '../lib/icon-resolver';
import { type Dictionary } from '@/lib/dictionaries/en';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMediaQuery } from '@/hooks/use-media-query';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

const { pois: poiData, regions: regionData } = poiDataRaw as MapData;

interface MapDetailPanelProps {
  dict: Dictionary;
}

interface ImageSliderProps {
  images: string[];
  alt: string;
  noImageText: string;
}

function ImageSlider({ images, alt, noImageText }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2 bg-muted relative">
        <Skeleton className="w-full h-full absolute inset-0 rounded-none" />
        <div className="z-10 bg-background/80 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium">
          {noImageText}
        </div>
      </div>
    );
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      // Swiped left -> next image
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (diff < -40) {
      // Swiped right -> prev image
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-muted group select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div
        className="w-full h-full flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, idx) => (
          <div key={idx} className="w-full h-full shrink-0 relative bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} ${idx + 1}`}
              className="w-full h-full object-cover"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows (visible if more than 1 image) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous photo"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-md z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next photo"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-md z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-2 py-1 rounded-full bg-black/35 backdrop-blur-sm">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-4 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Counter Badge */}
          <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-black/55 backdrop-blur-md text-[11px] font-semibold text-white tracking-wide shadow-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

export function MapDetailPanel({ dict }: MapDetailPanelProps) {
  const { selectedPoiId, clearSelectedPoi } = useMapStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const dragControls = useDragControls();

  const selectedPoi = poiData.find((poi) => poi.id === selectedPoiId);
  const selectedRegion = regionData.find((region) => region.id === selectedPoiId);
  const activeData = selectedPoi || selectedRegion;
  const isPoi = activeData && 'category' in activeData;

  const images = useMemo(() => {
    if (!activeData) return [];
    if (activeData.images && activeData.images.length > 0) return activeData.images;
    if (activeData.thumbnailUrl) return [activeData.thumbnailUrl];
    return [];
  }, [activeData]);

  const getCategoryLabel = (cat: string) => {
    if (cat === 'rides') return dict.map.categories.rides;
    if (cat === 'food') return dict.map.categories.food;
    if (cat === 'facility') return dict.map.categories.facility;
    if (cat === 'gate') return dict.map.categories.gate;
    return cat;
  };

  return (
    <AnimatePresence>
      {activeData && (
        <motion.div
          key="map-detail-panel"
          initial={isDesktop ? { x: '-100%', opacity: 0 } : { y: '100%', opacity: 0 }}
          animate={isDesktop ? { x: 0, opacity: 1 } : { y: 0, opacity: 1 }}
          exit={isDesktop ? { x: '-100%', opacity: 0 } : { y: '100%', opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 28,
            stiffness: 280,
            mass: 0.8,
          }}
          drag={!isDesktop ? 'y' : false}
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 80 || info.velocity.y > 400) {
              clearSelectedPoi();
            }
          }}
          className={
            isDesktop
              ? 'fixed top-0 left-0 z-40 h-full w-96 lg:w-104 bg-background text-foreground shadow-2xl border-r flex flex-col pointer-events-auto overflow-hidden'
              : 'fixed bottom-0 left-0 right-0 z-40 max-h-[80vh] h-[65vh] w-full bg-background text-foreground shadow-2xl rounded-t-3xl border-t flex flex-col pointer-events-auto overflow-hidden'
          }
        >
          {/* Mobile Drag Handle */}
          {!isDesktop && (
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="w-full flex items-center justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing shrink-0 z-30 select-none bg-background"
            >
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={clearSelectedPoi}
            className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image Slider Header */}
          <div className="relative w-full h-48 md:h-64 shrink-0 bg-muted">
            <ImageSlider
              key={activeData.id}
              images={images}
              alt={activeData.name}
              noImageText={dict.map.noImage}
            />
          </div>

          {/* Detail Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <DynamicLucideIcon
                    icon={activeData.icon}
                    fallback={isPoi ? MapPin : Map}
                    className="w-4 h-4"
                  />
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
                  {isPoi ? getCategoryLabel((activeData as POILocation).category) : 'Wilayah'}
                </span>
                {isPoi && (activeData as POILocation).meta?.isHalal && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-chart-5/20 text-chart-5">
                    Halal
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold leading-tight">{activeData.name}</h2>
                <p className="text-sm leading-relaxed mt-2 text-muted-foreground">
                  {activeData.description || dict.common.noResults}
                </p>
              </div>

              {isPoi && (activeData as POILocation).meta?.openHours && (
                <div className="flex items-center gap-2 text-sm bg-muted/50 p-3 rounded-xl border mt-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">Jam Operasional:</span>
                  <span>{(activeData as POILocation).meta?.openHours}</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
