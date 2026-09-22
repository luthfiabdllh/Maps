import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";

export interface DebugPoint {
  id: string;
  index: number;
  lng: number;
  lat: number;
}

interface InternalMarker {
  id: string;
  marker: mapboxgl.Marker;
}

export function useMapDebugger(
  map: React.RefObject<mapboxgl.Map | null>,
  enabled: boolean
) {
  const [points, setPoints] = useState<DebugPoint[]>([]);
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [isClickToAddEnabled, setIsClickToAddEnabled] = useState(true);
  const markersRef = useRef<InternalMarker[]>([]);
  const nextIndexRef = useRef(1);

  // Remove single point
  const removePoint = useCallback((id: string) => {
    const existing = markersRef.current.find((m) => m.id === id);
    if (existing) {
      existing.marker.remove();
      markersRef.current = markersRef.current.filter((m) => m.id !== id);
    }
    setPoints((prev) => prev.filter((p) => p.id !== id));
    setActivePointId((prev) => (prev === id ? null : prev));
  }, []);

  // Clear all points
  const clearAllPoints = useCallback(() => {
    markersRef.current.forEach((m) => m.marker.remove());
    markersRef.current = [];
    setPoints([]);
    setActivePointId(null);
    nextIndexRef.current = 1;
  }, []);

  // Fly to point
  const flyToPoint = useCallback(
    (point: DebugPoint) => {
      if (!map.current) return;
      map.current.flyTo({
        center: [point.lng, point.lat],
        zoom: 18.5,
        speed: 1.2,
      });
      setActivePointId(point.id);
    },
    [map]
  );

  useEffect(() => {
    if (!enabled || !map.current) return;
    const mapInstance = map.current;

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      if (!isClickToAddEnabled) return;

      const lng = Number(e.lngLat.lng.toFixed(6));
      const lat = Number(e.lngLat.lat.toFixed(6));
      const id = `debug-pt-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      const index = nextIndexRef.current++;

      // Create marker DOM element
      const el = document.createElement("div");
      el.className =
        "group relative flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs border-2 border-white shadow-xl cursor-grab active:cursor-grabbing transition-transform hover:scale-110";
      el.innerHTML = `
        <span>${index}</span>
        <div class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-[10px] text-white px-2 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          [${lng}, ${lat}]
        </div>
      `;

      const marker = new mapboxgl.Marker({
        element: el,
        draggable: true,
      })
        .setLngLat([lng, lat])
        .addTo(mapInstance);

      // Handle dragend to update coordinates
      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        const updatedLng = Number(lngLat.lng.toFixed(6));
        const updatedLat = Number(lngLat.lat.toFixed(6));

        // Update popup label
        const tooltip = el.querySelector("div");
        if (tooltip) {
          tooltip.innerText = `[${updatedLng}, ${updatedLat}]`;
        }

        setPoints((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, lng: updatedLng, lat: updatedLat } : p
          )
        );
        setActivePointId(id);
      });

      // Handle click on marker itself to select it
      el.addEventListener("click", (evt) => {
        evt.stopPropagation();
        setActivePointId(id);
      });

      markersRef.current.push({ id, marker });

      const newPoint: DebugPoint = { id, index, lng, lat };
      setPoints((prev) => [...prev, newPoint]);
      setActivePointId(id);
    };

    mapInstance.on("click", handleMapClick);

    return () => {
      mapInstance.off("click", handleMapClick);
    };
  }, [enabled, isClickToAddEnabled, map]);

  // Clean up markers when component unmounts or debugger is disabled
  useEffect(() => {
    if (!enabled) return;

    return () => {
      markersRef.current.forEach((m) => m.marker.remove());
      markersRef.current = [];
    };
  }, [enabled]);

  return {
    points,
    activePointId,
    setActivePointId,
    isClickToAddEnabled,
    setIsClickToAddEnabled,
    removePoint,
    clearAllPoints,
    flyToPoint,
  };
}
