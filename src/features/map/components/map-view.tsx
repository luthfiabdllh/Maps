"use client";

import React, { useRef } from "react";
import { type MapData } from "@/types/poi";
import poiDataRaw from "@/lib/data/poi-data.json";
import { useTheme } from "next-themes";
import { useMapInstance } from "../hooks/use-map-instance";
import { useMapOverlay } from "../hooks/use-map-overlay";
import { usePoiMarkers } from "../hooks/use-poi-markers";
import { useRegionMarkers } from "../hooks/use-region-markers";
import { useSemanticZoom } from "../hooks/use-semantic-zoom";
import { useMapDebugger } from "../hooks/use-map-debugger";
import { MapCanvas } from "./map-canvas";
import { MapDebugHud } from "./map-debug-hud";

const { regions, pois: poiData } = poiDataRaw as MapData;

const DEBUG_MODE = false;

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  
  const { map, lightPreset } = useMapInstance(containerRef, resolvedTheme);
  const { debugCoords, scaleImage } = useMapOverlay(map, lightPreset);
  const { markersRef } = usePoiMarkers(map, poiData);
  const { regionMarkersRef } = useRegionMarkers(map, regions);
  
  const {
    points,
    activePointId,
    isClickToAddEnabled,
    setIsClickToAddEnabled,
    removePoint,
    clearAllPoints,
    flyToPoint,
  } = useMapDebugger(map, DEBUG_MODE);
  
  useSemanticZoom(map, markersRef, regionMarkersRef);

  return (
    <div className="relative w-full h-full">
      <MapCanvas ref={containerRef} />

      {DEBUG_MODE && (
        <MapDebugHud
          debugCoords={debugCoords}
          scaleImage={scaleImage}
          points={points}
          activePointId={activePointId}
          isClickToAddEnabled={isClickToAddEnabled}
          setIsClickToAddEnabled={setIsClickToAddEnabled}
          removePoint={removePoint}
          clearAllPoints={clearAllPoints}
          flyToPoint={flyToPoint}
        />
      )}
    </div>
  );
}

