# Developer Tools & Workflow Guide

This document outlines the developer environment setup, debugging utilities, calibration HUD, and testing routines in **SinergiMP Maps**.

---

## 1. Environment Setup

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` (or `pnpm`/`yarn`)
- **Mapbox Access Token**: Required for Mapbox GL JS basemap tiles.

### Environment Variables
Configure your local environment by creating a `.env.local` file at the project root:

```env
# Mapbox public token
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...

# Base application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Variables are validated at runtime and build time using `@t3-oss/env-nextjs` and Zod inside [`src/env.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/env.ts).

---

## 2. In-App Map Debug HUD (`DEBUG_MODE`)

The project includes an in-app visual developer toolkit for calibrating map overlays and accurately pinning POI coordinates without external GIS software.

### Activating the Debug HUD
Open [`src/features/map/components/map-view.tsx`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/components/map-view.tsx) and set `DEBUG_MODE` to `true`:

```typescript
// src/features/map/components/map-view.tsx
const DEBUG_MODE = true; // Toggle to true during calibration
```

When activated, a floating HUD appears on the left side of the map with two tabs:

### Tab A: Overlay Calibration
- **Scale Factor Buttons**: Scale the 2.5D raster image larger or smaller (`+1%`, `-1%`, `+5%`, `-5%`).
- **Live Coordinates Display**: View real-time coordinates for all 4 bounding corners.
- **Copy Coordinates**: Copies the active bounding box array directly to the clipboard for pasting into [`use-map-overlay.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/hooks/use-map-overlay.ts).

### Tab B: POI Pin Dropper
- **Click-to-Add Mode**: When active, clicking anywhere on the map drops a numbered pin.
- **Inspect Coordinates**: View exact `[longitude, latitude]` for each dropped pin.
- **Fly-To Button**: Smoothly animates the camera to inspect alignment at high zoom levels.
- **Export Snippet**: Formats the selected points into valid `POILocation` JSON objects ready for [`poi-data.json`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/lib/data/poi-data.json).

---

## 3. Development Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles the production application bundle |
| `npm run start` | Starts the production server |
| `npm run typecheck` | Validates TypeScript types across the entire project (`tsc --noEmit`) |
| `npm run lint` | Runs ESLint 9 checks across `src/` |

---

## 4. Testing Suite

The repository includes both unit tests and end-to-end tests:

### Unit Tests (Vitest)
Unit tests run on **Vitest** with `jsdom` and `@testing-library/react`. Tests live alongside code in `__tests__` subdirectories.

```bash
# Run unit tests with code coverage analysis
npm run test:unit

# Run unit tests in interactive watch mode
npm run test:unit:watch
```

Coverage thresholds enforce 80% minimum coverage on utility modules, dictionaries, and i18n logic (configured in [`vitest.config.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/vitest.config.ts)).

### End-to-End Tests (Playwright)
E2E browser tests are located in `e2e/*.spec.ts`.

```bash
# Execute headless E2E test suite
npm run test:e2e

# Open interactive Playwright UI Runner
npm run test:e2e:ui
```

---

## 5. Git Hooks & Code Quality

The repository utilizes **Husky** and **lint-staged** to ensure code hygiene before committing:
- Pre-commit hooks run ESLint and check for formatting issues on staged files.
- Configuration is declared in `.lintstagedrc.json`.
