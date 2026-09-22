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
      style: "mapbox://styles/mapbox/light-v11",
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

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }),
      "top-right"
    );

    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [containerRef]);

  return map;
}
