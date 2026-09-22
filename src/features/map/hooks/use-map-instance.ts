import { useEffect, useRef, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import { env } from "@/env";

const MAX_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [110.375, -7.122], // SW
  [110.383, -7.115], // NE
];

export function getLightPreset(resolvedTheme?: string): "dawn" | "day" | "dusk" | "night" {
  const hour = new Date().getHours();
  if (resolvedTheme === 'light') {
    return (hour >= 4 && hour < 8) ? "dawn" : "day";
  } else if (resolvedTheme === 'dark') {
    return (hour >= 16 && hour < 19) ? "dusk" : "night";
  } else {
    // Fallback if resolvedTheme is undefined
    if (hour >= 4 && hour < 8) return "dawn";
    if (hour >= 8 && hour < 16) return "day";
    if (hour >= 16 && hour < 19) return "dusk";
    return "night";
  }
}

export function useMapInstance(containerRef: React.RefObject<HTMLDivElement | null>, resolvedTheme?: string) {
  const map = useRef<mapboxgl.Map | null>(null);
  
  // Calculate lightPreset synchronously from resolvedTheme so consumer hooks
  // (like useMapOverlay) get the updated preset immediately without async delay
  const lightPreset = useMemo(() => getLightPreset(resolvedTheme), [resolvedTheme]);
  const lightPresetRef = useRef(lightPreset);

  useEffect(() => {
    lightPresetRef.current = lightPreset;
  }, [lightPreset]);

  // 1. Initialize Map
  useEffect(() => {
    if (map.current || !containerRef.current) return;

    mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const mapInstance = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [110.379189, -7.118471],
      zoom: 17,
      minZoom: 16,
      maxZoom: 20,
      maxBounds: MAX_BOUNDS,
      pitchWithRotate: false,
      dragRotate: false,
      pitch: 0,
      attributionControl: false,
    });

    map.current = mapInstance;

    mapInstance.on('style.load', () => {
      try {
        mapInstance.setConfigProperty('basemap', 'theme', 'monochrome');
        mapInstance.setConfigProperty('basemap', 'lightPreset', lightPresetRef.current);
      } catch {
        // Style might not be fully configured yet
      }
    });

    mapInstance.addControl(
      new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }),
      "bottom-right"
    );

    mapInstance.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "bottom-right"
    );

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, [containerRef]);

  // 2. Sync Mapbox lightPreset with UI resolvedTheme & local time
  useEffect(() => {
    if (!map.current) return;
    const mapInstance = map.current;

    const applyTheme = () => {
      try {
        mapInstance.setConfigProperty('basemap', 'lightPreset', lightPreset);
      } catch {
        // Ignore error if style is transitioning
      }
    };

    if (mapInstance.isStyleLoaded()) {
      applyTheme();
    } else {
      mapInstance.once('styledata', applyTheme);
    }
  }, [lightPreset]);

  return { map, lightPreset };
}

