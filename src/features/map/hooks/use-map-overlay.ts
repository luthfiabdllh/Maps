import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

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

export type ImageCoords = typeof INITIAL_IMAGE_COORDINATES;

export function useMapOverlay(map: React.RefObject<mapboxgl.Map | null>, lightPreset: string) {
  const [debugCoords, setDebugCoords] = useState<ImageCoords>(
    INITIAL_IMAGE_COORDINATES,
  );

  const targetUrl = `/peta-illustrasi-${
    lightPreset === 'day' ? 'light' : lightPreset === 'night' ? 'dark' : lightPreset
  }.webp`;

  // Preload all 4 illustration images in the background so theme switches are instant
  useEffect(() => {
    const imagesToPreload = [
      '/peta-illustrasi-light.webp',
      '/peta-illustrasi-dark.webp',
      '/peta-illustrasi-dawn.webp',
      '/peta-illustrasi-dusk.webp',
    ];
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Main effect: Add or update the overlay image
  useEffect(() => {
    if (!map.current) return;
    const mapInstance = map.current;

    const addOrUpdateOverlay = () => {
      const existingSource = mapInstance.getSource("illustration-map") as
        | mapboxgl.ImageSource
        | undefined;

      if (existingSource) {
        existingSource.updateImage({
          url: targetUrl,
          coordinates: debugCoords,
        });
        mapInstance.triggerRepaint();
        return;
      }

      if (!mapInstance.getSource("illustration-map")) {
        mapInstance.addSource("illustration-map", {
          type: "image",
          url: targetUrl,
          coordinates: debugCoords,
        });
      }

      if (!mapInstance.getLayer("illustration-layer")) {
        mapInstance.addLayer({
          id: "illustration-layer",
          type: "raster",
          source: "illustration-map",
          slot: "top",
          paint: {
            "raster-opacity": 1,
            "raster-fade-duration": 0,
            "raster-emissive-strength": 1,
          },
        });
      }
      mapInstance.triggerRepaint();
    };

    // If source is already present, update immediately (does not require style to be idle)
    const existingSource = mapInstance.getSource("illustration-map") as
      | mapboxgl.ImageSource
      | undefined;

    if (existingSource) {
      existingSource.updateImage({
        url: targetUrl,
        coordinates: debugCoords,
      });
      mapInstance.triggerRepaint();
      return;
    }

    if (mapInstance.isStyleLoaded() || mapInstance.loaded()) {
      addOrUpdateOverlay();
    } else {
      mapInstance.once("load", addOrUpdateOverlay);
      mapInstance.once("style.load", addOrUpdateOverlay);
    }
  }, [map, targetUrl, debugCoords]);

  // Handle re-adding overlay if Mapbox style is reloaded
  useEffect(() => {
    if (!map.current) return;
    const mapInstance = map.current;

    const handleStyleReload = () => {
      if (!mapInstance.getSource("illustration-map")) {
        mapInstance.addSource("illustration-map", {
          type: "image",
          url: targetUrl,
          coordinates: debugCoords,
        });
      }

      if (!mapInstance.getLayer("illustration-layer")) {
        mapInstance.addLayer({
          id: "illustration-layer",
          type: "raster",
          source: "illustration-map",
          slot: "top",
          paint: {
            "raster-opacity": 1,
            "raster-fade-duration": 0,
            "raster-emissive-strength": 1,
          },
        });
      }
    };

    mapInstance.on("style.load", handleStyleReload);
    return () => {
      mapInstance.off("style.load", handleStyleReload);
    };
  }, [map, targetUrl, debugCoords]);

  const scaleImage = (factor: number) => {
    if (!map.current) return;
    const centerLng = debugCoords.reduce((sum, c) => sum + c[0], 0) / 4;
    const centerLat = debugCoords.reduce((sum, c) => sum + c[1], 0) / 4;

    const newCoords = debugCoords.map((coord) => [
      centerLng + (coord[0] - centerLng) * factor,
      centerLat + (coord[1] - centerLat) * factor,
    ]) as ImageCoords;

    setDebugCoords(newCoords);

    const source = map.current.getSource("illustration-map");
    if (source && source.type === "image") {
      (source as mapboxgl.ImageSource).setCoordinates(newCoords);
    }
  };

  return { debugCoords, scaleImage, setDebugCoords };
}

