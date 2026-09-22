import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

const INITIAL_IMAGE_COORDINATES: [
  [number, number],
  [number, number],
  [number, number],
  [number, number]
] = [
  [110.37750734237923, -7.117204094724613],
  [110.38073597835697, -7.117204094724613],
  [110.38073597835697, -7.119511602439374],
  [110.37750734237923, -7.119511602439374],
];

export type ImageCoords = typeof INITIAL_IMAGE_COORDINATES;

export function useMapOverlay(map: React.RefObject<mapboxgl.Map | null>) {
  const [debugCoords, setDebugCoords] = useState<ImageCoords>(INITIAL_IMAGE_COORDINATES);

  useEffect(() => {
    if (!map.current) return;

    const mapInstance = map.current;

    const handleLoad = () => {
      if (!mapInstance.getSource("illustration-map")) {
        mapInstance.addSource("illustration-map", {
          type: "image",
          url: "/peta-ilustrasi.png",
          coordinates: debugCoords,
        });

        mapInstance.addLayer({
          id: "illustration-layer",
          type: "raster",
          source: "illustration-map",
          paint: {
            "raster-opacity": 0.9,
            "raster-fade-duration": 0,
          },
        });
      }
    };

    if (mapInstance.loaded()) {
      handleLoad();
    } else {
      mapInstance.on("load", handleLoad);
    }

    return () => {
      mapInstance.off("load", handleLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

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
