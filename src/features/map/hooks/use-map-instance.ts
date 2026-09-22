import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { env } from "@/env";

const MAX_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [110.375, -7.122], // SW
  [110.383, -7.115], // NE
];

export function useMapInstance(containerRef: React.RefObject<HTMLDivElement | null>) {
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !containerRef.current) return;

    mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
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

    map.current.on('style.load', () => {
      const hour = new Date().getHours();
      let lightPreset = "day";
      
      if (hour >= 4 && hour < 8) {
        lightPreset = "dawn";
      } else if (hour >= 8 && hour < 16) {
        lightPreset = "day";
      } else if (hour >= 16 && hour < 19) {
        lightPreset = "dusk";
      } else {
        lightPreset = "night";
      }

      map.current?.setConfigProperty('basemap', 'lightPreset', lightPreset);
      map.current?.setConfigProperty('basemap', 'theme', 'monochrome');
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }),
      "bottom-right"
    );

    map.current.addControl(
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
      map.current?.remove();
      map.current = null;
    };
  }, [containerRef]);

  return map;
}
