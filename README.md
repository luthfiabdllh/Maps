# SinergiMP Maps

An interactive, responsive (mobile-first) 2.5D illustrated area map application for recreation parks and public venues, built with **Next.js 16**, **Mapbox GL JS**, **Tailwind CSS v4**, and **shadcn/ui**.

---

## 🌟 Key Features

- **Interactive 2.5D Vector & Raster Map**:
  - Mapbox GL JS v3 engine with 30° tilt perspective and rotation enabled (`dragRotate: true`, `pitch: 30`).
  - Seamless georeferenced WebP raster overlay calibrated to 4 corner coordinates.
  - Automatic time-of-day light presets (`dawn`, `day`, `dusk`, `night`) synchronized with user theme and local visitor hours.
- **Semantic Zooming & POI Clustering**:
  - **Macro Level (Zoom < 18.5)**: Displays overarching zone/region markers to declutter the viewport.
  - **Micro Level (Zoom ≥ 18.5)**: Reveals detailed Points of Interest (Rides, Dining, Public Facilities, Gates).
- **Rich Dynamic POI Presentation**:
  - Pin markers styled with category-specific colors and dynamic SVG icons powered by Lucide.
  - Instant `flyTo` camera transitions upon selecting points.
  - Responsive **Detail Drawer / Bottom Sheet**: Transforms smoothly from a swipeable bottom sheet on mobile devices (`< 768px`) into a side drawer on desktop viewports.
- **Internationalization (i18n)**:
  - Zero-middleware sub-path routing supporting **Indonesian (`id`)** and **English (`en`)**.
  - Type-safe dictionary schema.
- **Theme Switching**:
  - Full Dark Mode and Light Mode support with instant asset preloading.
- **Built-in Developer HUD**:
  - In-app calibration toolkit for overlay scaling and interactive POI pin coordinate dropping.

---

## 🏗️ Architecture Overview

The project is structured following modular, domain-driven conventions inside `src/features/map`:

```text
src/
├── app/                  # Next.js 16 App Router ([lang] localized routes)
├── components/           # Shared UI primitives (shadcn/ui & animated controls)
├── features/
│   └── map/              # Core Map Domain
│       ├── components/   # MapView, MapCanvas, MapHeader, MapDetailPanel, HUD
│       ├── hooks/        # Headless Mapbox lifecycle hooks (instance, overlay, markers)
│       └── lib/          # Pure map utilities (marker-factory, icon-resolver)
├── lib/
│   ├── data/             # Geographic data (poi-data.json)
│   ├── dictionaries/     # Translation files (en.ts, id.ts)
│   └── i18n.ts           # i18n configuration
├── store/                # Zustand client stores (map.store.ts, ui.store.ts)
└── types/                # TypeScript interfaces (poi.ts)
```

---

## 📚 Detailed Documentation

Comprehensive technical guides are available in the [`/docs`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/docs) directory:

| Document | Description |
| :--- | :--- |
| 🏛️ **[System Architecture](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/docs/architecture.md)** | Architectural patterns, Next.js 16 conventions, state separation, and data flow. |
| 🗺️ **[Map Engine & Overlay Guide](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/docs/map-engine.md)** | Deep dive into Mapbox GL JS setup, raster overlay georeferencing, and semantic zoom. |
| 📍 **[POI & Data Management Guide](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/docs/poi-and-data-guide.md)** | Data schema specifications, categories, and instructions for adding/updating POIs. |
| 🛠️ **[Developer Tools & HUD Guide](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/docs/developer-tools.md)** | Using the in-app coordinate calibration HUD, dev server, and running tests. |
| 🌐 **[i18n & Styling Guide](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/docs/i18n-and-styling.md)** | Multi-language localization and Tailwind CSS v4 CSS-first theming conventions. |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **Mapbox Public Access Token**: Sign up at [mapbox.com](https://account.mapbox.com/) to get a free token.

### 2. Environment Variables
Create a `.env.local` file at the root of the project:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Installation & Run

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the map.

---

## 🧪 Testing & Validation

```bash
# Run TypeScript typechecks
npm run typecheck

# Run ESLint validation
npm run lint

# Run unit tests with code coverage (Vitest)
npm run test:unit

# Run End-to-End tests (Playwright)
npm run test:e2e
```

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack, React 19)
- **Map Engine**: [Mapbox GL JS v3](https://docs.mapbox.com/mapbox-gl-js/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand v5](https://zustand.docs.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod v4](https://zod.dev/) & [@t3-oss/env-nextjs](https://env.t3.gg/)
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)
