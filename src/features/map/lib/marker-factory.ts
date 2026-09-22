import { type POILocation, type RegionLocation } from "@/types/poi";

/**
 * Factory function to create HTML elements for POI markers.
 */
export function createPoiMarkerElement(poi: POILocation): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "cursor-pointer pointer-events-auto";

  const inner = document.createElement("div");
  inner.className =
    "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110";

  let bgColor = "bg-muted";
  if (poi.category === "rides") bgColor = "bg-marker-rides";
  if (poi.category === "food") bgColor = "bg-marker-food";
  if (poi.category === "facility") bgColor = "bg-marker-facility";
  if (poi.category === "gate") bgColor = "bg-marker-gate";

  inner.classList.add(bgColor);
  inner.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
  
  el.appendChild(inner);
  return el;
}

/**
 * Factory function to create HTML elements for Region markers.
 */
export function createRegionMarkerElement(region: RegionLocation): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "cursor-pointer pointer-events-auto flex flex-col items-center justify-center gap-1 group";
  
  const inner = document.createElement("div");
  inner.className = "w-10 h-10 bg-indigo-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110";
  inner.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>`;

  const label = document.createElement("div");
  label.className = "absolute -bottom-6 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded border border-white/20 shadow text-[10px] font-bold text-white whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none";
  label.innerText = region.name;

  el.appendChild(inner);
  el.appendChild(label);
  return el;
}
