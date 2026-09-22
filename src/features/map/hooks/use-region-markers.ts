import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { type RegionLocation } from "@/types/poi";
import { useMapStore } from "@/store/map.store";
import { createRegionMarkerElement } from "../lib/marker-factory";

export interface RegionMarkerRef {
  marker: mapboxgl.Marker;
  el: HTMLDivElement;
  region: RegionLocation;
}

export function useRegionMarkers(
  map: React.RefObject<mapboxgl.Map | null>,
  regionData: RegionLocation[]
) {
  const regionMarkersRef = useRef<RegionMarkerRef[]>([]);
  const { setSelectedPoiId } = useMapStore();

  useEffect(() => {
    if (!map.current) return;

    const mapInstance = map.current;

    const handleLoad = () => {
      regionData.forEach((region) => {
        const el = createRegionMarkerElement(region);

        const handleInteraction = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          setSelectedPoiId(region.id);
          mapInstance.flyTo({ center: region.coordinates, zoom: 19, speed: 1.2 });
        };

        el.addEventListener("click", handleInteraction);
        el.addEventListener("touchstart", handleInteraction, { passive: false });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(region.coordinates)
          .addTo(mapInstance);
          
        regionMarkersRef.current.push({ marker, el, region });
      });
    };

    if (mapInstance.loaded()) {
      handleLoad();
    } else {
      mapInstance.on("load", handleLoad);
    }

    return () => {
      mapInstance.off("load", handleLoad);
       
      regionMarkersRef.current.forEach((m) => m.marker.remove());
      regionMarkersRef.current = [];
    };
  }, [map, regionData, setSelectedPoiId]);

  return { regionMarkersRef };
}
