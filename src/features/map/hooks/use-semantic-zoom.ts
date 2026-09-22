import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useMapStore } from "@/store/map.store";
import { type PoiMarkerRef } from "./use-poi-markers";
import { type RegionMarkerRef } from "./use-region-markers";

export function useSemanticZoom(
  map: React.RefObject<mapboxgl.Map | null>,
  markersRef: React.MutableRefObject<PoiMarkerRef[]>,
  regionMarkersRef: React.MutableRefObject<RegionMarkerRef[]>
) {
  const currentZoomRef = useRef(17);
  const { activeCategory, searchQuery } = useMapStore();

  useEffect(() => {
    if (!map.current) return;

    const mapInstance = map.current;

    const updateVisibility = (isDetailVisible: boolean) => {
      const state = useMapStore.getState();
      
      regionMarkersRef.current.forEach(({ el }) => {
        el.style.display = isDetailVisible ? "none" : "flex";
      });

      markersRef.current.forEach(({ el, poi }) => {
        const matchCategory = !state.activeCategory || poi.category === state.activeCategory;
        const matchSearch = !state.searchQuery || poi.name.toLowerCase().includes(state.searchQuery.toLowerCase());
        el.style.display = (isDetailVisible && matchCategory && matchSearch) ? "flex" : "none";
      });
    };

    const handleZoom = () => {
      const z = mapInstance.getZoom() || 17;
      const wasDetail = currentZoomRef.current >= 18.5;
      const isDetail = z >= 18.5;
      currentZoomRef.current = z;

      if (wasDetail !== isDetail) {
        updateVisibility(isDetail);
      }
    };

    const handleLoad = () => {
      // Set initial visibility
      const initialIsDetail = currentZoomRef.current >= 18.5;
      updateVisibility(initialIsDetail);
      mapInstance.on("zoom", handleZoom);
    };

    if (mapInstance.loaded()) {
      handleLoad();
    } else {
      mapInstance.on("load", handleLoad);
    }

    return () => {
      mapInstance.off("zoom", handleZoom);
      mapInstance.off("load", handleLoad);
    };
  }, [map, markersRef, regionMarkersRef]);

  // Handle external filter changes (category or search)
  useEffect(() => {
    const isDetailVisible = currentZoomRef.current >= 18.5;
    markersRef.current.forEach(({ el, poi }) => {
      const matchCategory = !activeCategory || poi.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        poi.name.toLowerCase().includes(searchQuery.toLowerCase());
      el.style.display = (isDetailVisible && matchCategory && matchSearch) ? "flex" : "none";
    });
  }, [activeCategory, searchQuery, markersRef]);
}
