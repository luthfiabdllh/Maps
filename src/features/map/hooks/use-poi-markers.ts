import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { type POILocation } from "@/types/poi";
import { useMapStore } from "@/store/map.store";
import { createPoiMarkerElement } from "../lib/marker-factory";

export interface PoiMarkerRef {
  marker: mapboxgl.Marker;
  el: HTMLDivElement;
  poi: POILocation;
}

export function usePoiMarkers(
  map: React.RefObject<mapboxgl.Map | null>,
  poiData: POILocation[]
) {
  const markersRef = useRef<PoiMarkerRef[]>([]);
  const { setSelectedPoiId } = useMapStore();

  useEffect(() => {
    if (!map.current) return;

    const mapInstance = map.current;

    const handleLoad = () => {
      poiData.forEach((poi) => {
        const el = createPoiMarkerElement(poi);

        const handleInteraction = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          setSelectedPoiId(poi.id);
          mapInstance.flyTo({ center: poi.coordinates, zoom: 18.5, speed: 1.2 });
        };

        el.addEventListener("click", handleInteraction);
        el.addEventListener("touchstart", handleInteraction, { passive: true });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(poi.coordinates)
          .addTo(mapInstance);
          
        markersRef.current.push({ marker, el, poi });
      });
    };

    if (mapInstance.loaded()) {
      handleLoad();
    } else {
      mapInstance.on("load", handleLoad);
    }

    return () => {
      mapInstance.off("load", handleLoad);
      // Clean up markers
       
      markersRef.current.forEach((m) => m.marker.remove());
      markersRef.current = [];
    };
  }, [map, poiData, setSelectedPoiId]);

  return { markersRef };
}
