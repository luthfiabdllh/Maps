import { type POILocation, type RegionLocation } from "@/types/poi";
import { renderLucideIconSvg } from "./icon-resolver";
import { MapPin, Map } from "lucide-react";

/**
 * Factory function to create HTML elements for POI markers.
 */
export function createPoiMarkerElement(poi: POILocation): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "cursor-pointer pointer-events-auto group relative";

  const inner = document.createElement("div");
  inner.className =
    "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110";

  let bgColor = "bg-muted";
  if (poi.category === "rides") bgColor = "bg-chart-1";
  if (poi.category === "food") bgColor = "bg-chart-2";
  if (poi.category === "facility") bgColor = "bg-chart-3";
  if (poi.category === "gate") bgColor = "bg-chart-4";

  inner.classList.add(bgColor);
  inner.innerHTML = renderLucideIconSvg(poi.icon, {
    size: 16,
    color: "white",
    strokeWidth: 2.2,
    fallback: MapPin,
  });

  const label = document.createElement("div");
  label.className =
    "absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/75 backdrop-blur-md rounded border border-white/20 shadow text-[10px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20";
  label.innerText = poi.name;

  el.appendChild(inner);
  el.appendChild(label);
  return el;
}

/**
 * Factory function to create HTML elements for Region markers.
 */
export function createRegionMarkerElement(region: RegionLocation): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "cursor-pointer pointer-events-auto flex flex-col items-center justify-center gap-1 group";
  
  const inner = document.createElement("div");
  inner.className = "w-10 h-10 bg-chart-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110";
  inner.innerHTML = renderLucideIconSvg(region.icon, {
    size: 20,
    color: "white",
    strokeWidth: 2,
    fallback: Map,
  });

  const label = document.createElement("div");
  label.className = "absolute -bottom-6 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded border border-white/20 shadow text-[10px] font-bold text-white whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none";
  label.innerText = region.name;

  el.appendChild(inner);
  el.appendChild(label);
  return el;
}
