"use client";

import React, { useRef } from "react";
import { type MapData } from "@/types/poi";
import poiDataRaw from "@/lib/data/poi-data.json";
import { useMapInstance } from "../hooks/use-map-instance";
import { useMapOverlay } from "../hooks/use-map-overlay";
import { usePoiMarkers } from "../hooks/use-poi-markers";
import { useRegionMarkers } from "../hooks/use-region-markers";
import { useSemanticZoom } from "../hooks/use-semantic-zoom";
import { MapCanvas } from "./map-canvas";
import { MapDebugHud } from "./map-debug-hud";

const { regions, pois: poiData } = poiDataRaw as MapData;

const DEBUG_ALIGNMENT = false;

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const map = useMapInstance(containerRef);
  const { debugCoords, scaleImage } = useMapOverlay(map);
  const { markersRef } = usePoiMarkers(map, poiData);
  const { regionMarkersRef } = useRegionMarkers(map, regions);
  
  useSemanticZoom(map, markersRef, regionMarkersRef);

  return (
    <div className="relative w-full h-full">
      <MapCanvas ref={containerRef} />

      {DEBUG_ALIGNMENT && (
        <MapDebugHud debugCoords={debugCoords} scaleImage={scaleImage} />
      )}
    </div>
  );
}
