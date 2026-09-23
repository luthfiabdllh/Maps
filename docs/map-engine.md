# Map Engine & Visual Overlay Guide

This document provides a technical breakdown of the Mapbox GL JS engine, georeferenced raster overlays, camera constraints, and semantic zoom rendering in **SinergiMP Maps**.

---

## 1. Mapbox GL JS Core Configuration

The map engine is implemented using **Mapbox GL JS (v3.x)**. Initialization and lifecycle management are encapsulated inside [`use-map-instance.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/hooks/use-map-instance.ts).

### Camera Constraints & Locked Perspective
To preserve the spatial readability of hand-drawn/2.5D illustrated overlays, the camera is locked to an orthographic top-down view:

```typescript
const mapInstance = new mapboxgl.Map({
  container: containerRef.current,
  style: "mapbox://styles/mapbox/standard",
  center: [110.379189, -7.118471],
  zoom: 17,
  minZoom: 16,
  maxZoom: 20,
  maxBounds: [
    [110.375, -7.122], // Southwest boundary [lng, lat]
    [110.383, -7.115], // Northeast boundary [lng, lat]
  ],
  pitchWithRotate: false,
  dragRotate: false,       // Disables 3D rotation
  pitch: 0,                // Locks camera strictly perpendicular
  attributionControl: false,
});
```

### Dynamic Light Preset Synchronization
The base map uses Mapbox Standard style with a monochrome theme. The `lightPreset` property dynamically shifts based on user theme and the visitor's local hour:

```typescript
export function getLightPreset(resolvedTheme?: string): "dawn" | "day" | "dusk" | "night" {
  const hour = new Date().getHours();
  if (resolvedTheme === 'light') {
    return (hour >= 4 && hour < 8) ? "dawn" : "day";
  } else if (resolvedTheme === 'dark') {
    return (hour >= 16 && hour < 19) ? "dusk" : "night";
  }
  // Fallback based on time of day
  if (hour >= 4 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 16) return "day";
  if (hour >= 16 && hour < 19) return "dusk";
  return "night";
}
```

---

## 2. 2.5D Illustrated Image Overlay

The illustrated area map is an orthorectified WebP image georeferenced to 4 geographical coordinates representing the corners of the bounding box. This logic is handled by [`use-map-overlay.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/hooks/use-map-overlay.ts).

```text
[Top-Left: NW]   ───   [Top-Right: NE]
      │                      │
      │   peta-illustrasi    │
      │       (.webp)        │
      │                      │
[Bottom-Left: SW] ───  [Bottom-Right: SE]
```

### Coordinate Coordinates Format
The Mapbox `image` source requires four coordinates in clockwise order starting from the top-left corner:
1. **Top-Left (NW)**: `[110.37750734237923, -7.117204094724613]`
2. **Top-Right (NE)**: `[110.38073597835697, -7.117204094724613]`
3. **Bottom-Right (SE)**: `[110.38073597835697, -7.119511602439374]`
4. **Bottom-Left (SW)**: `[110.37750734237923, -7.119511602439374]`

### Image Preloading & Seamless Transitions
To eliminate flicker when toggling between light, dark, dawn, and dusk variants, all four illustration assets are preloaded into browser cache upon mount:

```typescript
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
```

When switching themes, `existingSource.updateImage({ url, coordinates })` replaces the raster texture in the existing WebGL layer without re-initializing the layer.

---

## 3. Semantic Zoom & Marker Strategy

To avoid visual clutter on small mobile viewports, markers are stratified into two levels of detail controlled by [`use-semantic-zoom.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/hooks/use-semantic-zoom.ts):

| Zoom Level | Visible Layer | Description | Managed By |
| :--- | :--- | :--- | :--- |
| **Zoom < 18.5** | **Macro Zone Markers** | Highlights major zones (e.g. *Kawasan Kebun*, *Kawasan Cafe*, *Kawasan Headquarter*). Detail POI pins are hidden. | [`useRegionMarkers`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/hooks/use-region-markers.ts) |
| **Zoom ≥ 18.5** | **Micro POI Markers** | Displays individual attractions, restaurants, restrooms, and facilities. Region pins are hidden. | [`usePoiMarkers`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/hooks/use-poi-markers.ts) |

### Real-Time Marker Filtering
When a user types into the search bar or selects a category filter, `useSemanticZoom` immediately updates marker display styling without recreating DOM nodes:

```typescript
markersRef.current.forEach(({ el, poi }) => {
  const matchCategory = !state.activeCategory || poi.category === state.activeCategory;
  const matchSearch = !state.searchQuery || poi.name.toLowerCase().includes(state.searchQuery.toLowerCase());
  el.style.display = (isDetailVisible && matchCategory && matchSearch) ? "flex" : "none";
});
```

---

## 4. Marker DOM Factory & Dynamic Icon Rendering

Markers are rendered as lightweight DOM elements via [`marker-factory.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/lib/marker-factory.ts).

### Category Color Mapping
- **Rides & Attractions**: `bg-chart-1` (Red / Coral)
- **Food & Beverage**: `bg-chart-2` (Teal / Green)
- **Public Facilities**: `bg-chart-3` (Navy / Blue)
- **Gates & Entrance**: `bg-chart-4` (Amber / Yellow)
- **Macro Regions**: `bg-chart-5` (Purple)

### Dynamic Lucide Icons
Icons configured in [`poi-data.json`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/lib/data/poi-data.json) by name (e.g. `"Waves"`, `"Coffee"`, `"Trees"`) are dynamically resolved into crisp SVG markup at runtime by [`icon-resolver.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/lib/icon-resolver.ts) using `lucide-react` icon nodes.

---

## 5. Controls & Interaction

1. **Navigation Control**: Located at `bottom-right` providing zoom in/out buttons and north-compass resetting.
2. **Geolocation Control**: Integrated `mapboxgl.GeolocateControl` with `enableHighAccuracy: true` and `trackUserLocation: true` for live visitor tracking inside the park.
3. **Marker Interaction**: Clicking any POI triggers a camera animation `map.flyTo({ center: poi.coordinates, zoom: 18.5, speed: 1.2 })` and opens the responsive detail panel.
