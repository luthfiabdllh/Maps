# System Architecture - SinergiMP Maps

This document outlines the high-level system architecture, design patterns, and engineering principles used in the **SinergiMP Maps** project.

---

## 1. Architectural Overview

The application is built on **Next.js 16 (App Router)** following a modular, domain-driven structure inspired by **Feature-Sliced Design (FSD)**. All source code is consolidated inside the `src/` directory.

```mermaid
graph TD
    Client[Browser / Client Device] --> AppRouter[Next.js App Router: src/app/[lang]]
    AppRouter --> Layout[Lang Layout: ThemeProvider & Toasters]
    Layout --> Page[Page: MapHeader + MapView + MapDetailPanel]
    
    subgraph FeatureMap["Feature Domain: src/features/map"]
        MapView[MapView Orchestrator]
        MapCanvas[MapCanvas Container]
        MapHeader[MapHeader: Search & Controls]
        MapDetail[MapDetailPanel: Sheet / Drawer]
        
        MapView --> Hooks[Custom Map Hooks]
        Hooks --> useInstance[useMapInstance: Mapbox GL Core]
        Hooks --> useOverlay[useMapOverlay: 2.5D Raster Layer]
        Hooks --> usePoi[usePoiMarkers: Custom HTML POI Pins]
        Hooks --> useRegion[useRegionMarkers: Macro Zone Pins]
        Hooks --> useZoom[useSemanticZoom: Zoom Filter & Visibility]
        Hooks --> useDebug[useMapDebugger: Dev Calibration HUD]
    end

    subgraph StateManagement["State Management Layer"]
        ZustandMap[useMapStore: selectedPoiId, activeCategory, searchQuery]
        ZustandUI[useUIStore: theme, sidebar]
    end

    subgraph DataStatic["Static Asset & Data Layer"]
        POIData[(src/lib/data/poi-data.json)]
        WebPOverlay[public/peta-illustrasi-*.webp]
    end

    Hooks --> ZustandMap
    MapHeader --> ZustandMap
    MapDetail --> ZustandMap
    usePoi --> POIData
    useRegion --> POIData
    useOverlay --> WebPOverlay
```

---

## 2. Directory Structure

```text
src/
├── app/                      # Next.js 16 App Router (Routing & Layouts)
│   ├── [lang]/               # Sub-path routing for localized content (id & en)
│   │   ├── error.tsx         # Route error boundary
│   │   ├── layout.tsx        # Localized layout wrapping providers (Theme, Tooltip, Sonner)
│   │   └── page.tsx          # Main entry page rendering the map view
│   ├── favicon.ico           # Web application favicon
│   ├── globals.css           # Tailwind CSS v4 CSS-first (@theme inline) & design tokens
│   └── layout.tsx            # HTML Root Shell (HTML/body tags, typography setup)
├── components/               # Shared global components
│   ├── animate-ui/           # Interactive animations (e.g. ExpandableSearchBar)
│   ├── ui/                   # shadcn/ui primitive components (Sheet, Skeleton, Tooltip, etc.)
│   ├── theme-provider.tsx    # Next-themes wrapper
│   └── theme-toggle.tsx      # Theme toggle control
├── features/                 # Domain-driven feature modules
│   └── map/                  # Core Map Feature Domain
│       ├── components/       # Visual components (MapView, MapCanvas, MapDetailPanel, HUD)
│       ├── hooks/            # Headless map lifecycle & Mapbox GL hooks
│       └── lib/              # Map-specific utilities (marker-factory, icon-resolver)
├── hooks/                    # Global React hooks (e.g. useMediaQuery)
├── lib/                      # Shared libraries, data, and i18n
│   ├── data/                 # Static geographic data (poi-data.json)
│   ├── dictionaries/         # Translation dictionaries (id.ts, en.ts)
│   ├── i18n.ts               # Locale resolution and validation utilities
│   └── utils.ts              # Class name merger helper (cn)
├── store/                    # Zustand stores for transient client state
│   ├── map.store.ts          # Active POI selection, category filter, and search queries
│   └── ui.store.ts           # Persistent UI states (theme, sidebar)
└── types/                    # Global TypeScript definitions (poi.ts)
```

---

## 3. Core Design Principles

### A. Next.js 16 App Router & Server/Client Boundary
- **No legacy `middleware.ts`**: The project follows modern Next.js 16 conventions. Thin edge proxying lives in `src/proxy.ts` (if required).
- **Clear Server/Client Boundaries**:
  - `src/app/[lang]/page.tsx` is an async Server Component responsible for resolving the active locale dictionary from `src/lib/dictionaries/` and passing it to child components.
  - Interactive UI components under `src/features/map` utilize the `'use client'` directive to interface with DOM nodes, WebGL context, and browser APIs (`navigator.geolocation`).

### B. Headless Map Lifecycle via Custom Hooks
To avoid monolithic components and maintain single-responsibility separation, `MapView` acts purely as an orchestrator. All Mapbox GL behaviors are isolated into dedicated hooks:
1. **`useMapInstance`**: Handles Mapbox instance instantiation, container binding, boundary locks, control additions, and theme preset sync.
2. **`useMapOverlay`**: Manages the WebP raster image overlay, coordinate georeferencing, and instantaneous theme-driven asset transitions.
3. **`usePoiMarkers`**: Creates and attaches DOM-based HTML markers for Points of Interest with interactive click listeners.
4. **`useRegionMarkers`**: Manages macro zone/region labels on the canvas.
5. **`useSemanticZoom`**: Dynamically toggles marker density and visibility based on map zoom levels and active filter state.
6. **`useMapDebugger`**: Provides in-app developer tools for calibrating coordinates, scaling overlays, and pinning POIs.

### C. State Management Separation
- **Zustand (`src/store/`)**:
  - `map.store.ts`: Holds client-side interactive state (`selectedPoiId`, `activeCategory`, `searchQuery`). Consumed reactively across `MapHeader`, `MapDetailPanel`, and `useSemanticZoom`.
  - `ui.store.ts`: Stores persistent client preferences (such as `theme`) using `persist` middleware with `localStorage`.
- **Remote / Server Data Guideline**:
  - Any future server-fetched data (e.g. real-time queue times, live operational statuses) should be handled via **TanStack Query** (`@tanstack/react-query`) rather than stored in global Zustand stores.

### D. Multi-Language Support (i18n)
- Localized paths use subpath routing: `/[lang]/...` with supported locales `en` (English) and `id` (Indonesian).
- Statically typed dictionary schema defined in `src/lib/dictionaries/en.ts` enforces parity with `src/lib/dictionaries/id.ts`.
