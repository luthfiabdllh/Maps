"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { env } from "@/env";
import { useMapStore } from "@/store/map.store";
import poiDataRaw from "@/lib/data/poi-data.json";
import { type MapData, type POILocation, type RegionLocation } from "@/types/poi";

const { regions, pois: poiData } = poiDataRaw as MapData;

// Aktifkan mode debug ini untuk menggeser 4 sudut gambar secara interaktif di layar
const DEBUG_ALIGNMENT = false;

// Koordinat Asli Kawasan untuk Image Overlay
// Harus searah jarum jam: Top-Left, Top-Right, Bottom-Right, Bottom-Left
const INITIAL_IMAGE_COORDINATES: [
  [number, number],
  [number, number],
  [number, number],
  [number, number],
] = [
  [110.37750734237923, -7.117204094724613],
  [110.38073597835697, -7.117204094724613],
  [110.38073597835697, -7.119511602439374],
  [110.37750734237923, -7.119511602439374],
];

type ImageCoords = typeof INITIAL_IMAGE_COORDINATES;

// Batasan geser kamera (maxBounds)
const MAX_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [110.375, -7.122], // SW
  [110.383, -7.115], // NE
];

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ marker: mapboxgl.Marker; el: HTMLDivElement; poi: POILocation }[]>([]);
  const regionMarkersRef = useRef<{ marker: mapboxgl.Marker; el: HTMLDivElement; region: RegionLocation }[]>([]);
  const debugMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const currentZoomRef = useRef(17);
  const { setSelectedPoiId, activeCategory, searchQuery } = useMapStore();

  const [debugCoords, setDebugCoords] = useState(INITIAL_IMAGE_COORDINATES);

  const scaleImage = (factor: number) => {
    if (!map.current) return;
    const centerLng = debugCoords.reduce((sum, c) => sum + c[0], 0) / 4;
    const centerLat = debugCoords.reduce((sum, c) => sum + c[1], 0) / 4;

    const newCoords = debugCoords.map((coord) => [
      centerLng + (coord[0] - centerLng) * factor,
      centerLat + (coord[1] - centerLat) * factor,
    ]) as [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ];

    setDebugCoords(newCoords);

    const source = map.current.getSource("illustration-map");
    if (source && source.type === "image") {
      (source as mapboxgl.ImageSource).setCoordinates(newCoords as ImageCoords);
    }

    // Update marker positions (first 4 markers are the corners)
    for (let i = 0; i < 4; i++) {
      if (debugMarkersRef.current[i]) {
        debugMarkersRef.current[i].setLngLat(newCoords[i]);
      }
    }
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once

    mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11", // Mapbox base style
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

    // Tambahkan Kontrol Navigasi (Zoom In/Out, Kompas)
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }),
      "top-right",
    );

    // Tambahkan Kontrol Geolocation (Live GPS Tracking)
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right",
    );

    map.current.on("load", () => {
      // Tambahkan source gambar
      map.current?.addSource("illustration-map", {
        type: "image",
        url: "/peta-ilustrasi.png",
        coordinates: INITIAL_IMAGE_COORDINATES,
      });

      // Render raster layer
      map.current?.addLayer({
        id: "illustration-layer",
        type: "raster",
        source: "illustration-map",
        paint: {
          "raster-opacity": 0.9, // Transparan sedikit agar satelit tembus
          "raster-fade-duration": 0,
        },
      });

      // --- DEBUG MODE: Draggable Corners & Center Move ---
      if (DEBUG_ALIGNMENT && map.current) {
        let currentCoords = [...INITIAL_IMAGE_COORDINATES];

        // Buat 4 marker sudut
        const cornerMarkers: mapboxgl.Marker[] = [];
        INITIAL_IMAGE_COORDINATES.forEach((coord, index) => {
          const el = document.createElement("div");
          el.className =
            "w-4 h-4 bg-red-500 rounded-full border-2 border-white cursor-move shadow-md";
          el.title = `Corner ${index + 1} (Drag to shape)`;

          const marker = new mapboxgl.Marker({ element: el, draggable: true })
            .setLngLat(coord)
            .addTo(map.current!);

          marker.on("drag", () => {
            const lngLat = marker.getLngLat();
            currentCoords[index] = [lngLat.lng, lngLat.lat];
            setDebugCoords([...currentCoords] as ImageCoords);

            // Update center marker position visually
            const newCenterLng =
              currentCoords.reduce((sum, c) => sum + c[0], 0) / 4;
            const newCenterLat =
              currentCoords.reduce((sum, c) => sum + c[1], 0) / 4;
            centerMarker.setLngLat([newCenterLng, newCenterLat]);

            const source = map.current?.getSource("illustration-map");
            if (source && source.type === "image") {
              (source as mapboxgl.ImageSource).setCoordinates(
                currentCoords as ImageCoords,
              );
            }
          });

          debugMarkersRef.current.push(marker);
          cornerMarkers.push(marker);
        });

        // Buat marker tengah untuk menggeser semua sudut sekaligus
        const centerEl = document.createElement("div");
        centerEl.className =
          "w-6 h-6 bg-yellow-400 rounded-full border-4 border-white cursor-move shadow-lg flex items-center justify-center font-bold text-black text-[10px]";
        centerEl.innerText = "ALL";
        centerEl.title = "Drag to move all corners";

        const initialCenterLng =
          INITIAL_IMAGE_COORDINATES.reduce((sum, c) => sum + c[0], 0) / 4;
        const initialCenterLat =
          INITIAL_IMAGE_COORDINATES.reduce((sum, c) => sum + c[1], 0) / 4;

        const centerMarker = new mapboxgl.Marker({
          element: centerEl,
          draggable: true,
        })
          .setLngLat([initialCenterLng, initialCenterLat])
          .addTo(map.current!);

        let prevCenterLng = initialCenterLng;
        let prevCenterLat = initialCenterLat;

        centerMarker.on("dragstart", () => {
          const lngLat = centerMarker.getLngLat();
          prevCenterLng = lngLat.lng;
          prevCenterLat = lngLat.lat;
        });

        centerMarker.on("drag", () => {
          const lngLat = centerMarker.getLngLat();
          const deltaLng = lngLat.lng - prevCenterLng;
          const deltaLat = lngLat.lat - prevCenterLat;

          // Update semua corner
          currentCoords = currentCoords.map((coord) => [
            coord[0] + deltaLng,
            coord[1] + deltaLat,
          ]) as ImageCoords;

          // Sinkronkan posisi marker sudut di peta
          currentCoords.forEach((coord, i) => {
            cornerMarkers[i].setLngLat(coord as [number, number]);
          });

          setDebugCoords([...currentCoords] as ImageCoords);

          const source = map.current?.getSource("illustration-map");
          if (source && source.type === "image") {
            (source as mapboxgl.ImageSource).setCoordinates(
              currentCoords as ImageCoords,
            );
          }

          prevCenterLng = lngLat.lng;
          prevCenterLat = lngLat.lat;
        });

        debugMarkersRef.current.push(centerMarker);
      }
      // -------------------------------------

      // Tambahkan POI Markers
      poiData.forEach((poi) => {
        // Elemen luar khusus untuk Mapbox (Jangan beri efek transform/scale di sini)
        const el = document.createElement("div");
        el.className = "cursor-pointer pointer-events-auto";

        // Elemen dalam untuk styling visual dan animasi hover
        const inner = document.createElement("div");
        inner.className =
          "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110";

        let bgColor = "bg-gray-500";
        if (poi.category === "rides") bgColor = "bg-red-500";
        if (poi.category === "food") bgColor = "bg-amber-500";
        if (poi.category === "facility") bgColor = "bg-blue-500";
        if (poi.category === "gate") bgColor = "bg-emerald-500";

        inner.classList.add(bgColor);
        inner.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
        
        el.appendChild(inner);

        el.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setSelectedPoiId(poi.id);
          // Gunakan zoom 18.5 karena minZoom peta sekarang 18
          map.current?.flyTo({ center: poi.coordinates, zoom: 18.5, speed: 1.2 });
        });

        // Tambahkan event touchstart untuk mendukung mobile browser secara native
        el.addEventListener("touchstart", (e) => {
          e.stopPropagation();
          setSelectedPoiId(poi.id);
          map.current?.flyTo({ center: poi.coordinates, zoom: 18.5, speed: 1.2 });
        }, { passive: true });

        if (map.current) {
          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat(poi.coordinates)
            .addTo(map.current);
          markersRef.current.push({ marker, el, poi });
        }
      });

      // Tambahkan Region Markers (Untuk Semantic Zoom)
      regions.forEach((region) => {
        const el = document.createElement("div");
        el.className = "cursor-pointer pointer-events-auto flex flex-col items-center justify-center gap-1 group";
        
        // Icon bulat
        const inner = document.createElement("div");
        inner.className = "w-10 h-10 bg-indigo-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110";
        inner.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>`;

        // Label nama wilayah di bawahnya (muncul saat hover)
        const label = document.createElement("div");
        label.className = "absolute -bottom-6 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded border border-white/20 shadow text-[10px] font-bold text-white whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none";
        label.innerText = region.name;

        el.appendChild(inner);
        el.appendChild(label);

        const zoomToRegion = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          setSelectedPoiId(region.id);
          map.current?.flyTo({ center: region.coordinates, zoom: 19, speed: 1.2 });
        };

        el.addEventListener("click", zoomToRegion);
        el.addEventListener("touchstart", zoomToRegion, { passive: false });

        if (map.current) {
          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat(region.coordinates)
            .addTo(map.current);
          regionMarkersRef.current.push({ marker, el, region });
        }
      });

      // Update visibilitas awal
      const initialIsDetail = currentZoomRef.current >= 18.5;
      regionMarkersRef.current.forEach(m => m.el.style.display = initialIsDetail ? "none" : "flex");
      markersRef.current.forEach(m => m.el.style.display = initialIsDetail ? "flex" : "none");

      // Event listener untuk zoom
      map.current?.on('zoom', () => {
        const z = map.current?.getZoom() || 17;
        const wasDetail = currentZoomRef.current >= 18.5;
        const isDetail = z >= 18.5;
        currentZoomRef.current = z;

        if (wasDetail !== isDetail) {
          const state = useMapStore.getState();
          
          regionMarkersRef.current.forEach(({ el }) => {
            el.style.display = isDetail ? "none" : "flex";
          });

          markersRef.current.forEach(({ el, poi }) => {
            const matchCategory = !state.activeCategory || poi.category === state.activeCategory;
            const matchSearch = !state.searchQuery || poi.name.toLowerCase().includes(state.searchQuery.toLowerCase());
            el.style.display = (isDetail && matchCategory && matchSearch) ? "flex" : "none";
          });
        }
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.marker.remove());
      markersRef.current = [];
      regionMarkersRef.current.forEach((m) => m.marker.remove());
      regionMarkersRef.current = [];
      debugMarkersRef.current.forEach((m) => m.remove());
      debugMarkersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [setSelectedPoiId]);

  useEffect(() => {
    const isDetailVisible = currentZoomRef.current >= 18.5;
    markersRef.current.forEach(({ el, poi }) => {
      const matchCategory = !activeCategory || poi.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        poi.name.toLowerCase().includes(searchQuery.toLowerCase());
      el.style.display = (isDetailVisible && matchCategory && matchSearch) ? "flex" : "none";
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* HUD Debug Mode */}
      {DEBUG_ALIGNMENT && (
        <div className="absolute bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-xl max-w-sm text-xs font-mono shadow-2xl backdrop-blur-md">
          <p className="mb-2 font-bold text-red-400">🔧 DEBUG ALIGNMENT MODE</p>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => scaleImage(0.95)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded"
            >
              ➖ Kecilkan
            </button>
            <button
              onClick={() => scaleImage(1.05)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded"
            >
              ➕ Besarkan
            </button>
          </div>
          <p className="mb-2 text-gray-300">
            Geser titik merah/kuning di peta. Salin koordinat di bawah ini jika
            sudah pas:
          </p>
          <pre className="overflow-x-auto p-2 bg-black/50 rounded select-all text-[10px]">
            {JSON.stringify(debugCoords, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
