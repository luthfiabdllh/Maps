# POI & Geographic Data Management Guide

This document describes the schema, structure, and procedures for managing Points of Interest (POIs) and geographic zones in **SinergiMP Maps**.

---

## 1. Data Source Overview

All location data is maintained in a single, version-controlled JSON file:
📍 [`src/lib/data/poi-data.json`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/lib/data/poi-data.json)

The dataset contains two root arrays:
1. **`regions`**: Macro zones (e.g., *Kawasan Kebun*, *Kawasan Cafe*).
2. **`pois`**: Micro locations (rides, restaurants, restrooms, prayer rooms, gates).

---

## 2. TypeScript Data Schema

The schema contracts are declared in [`src/types/poi.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/types/poi.ts).

### Region Definition
```typescript
export interface RegionLocation {
  id: string;               // Unique zone identifier (e.g. "zona-1")
  name: string;             // Display name (e.g. "Kawasan Kebun")
  coordinates: [number, number]; // [Longitude, Latitude]
  description?: string;     // Description displayed in detail panel
  thumbnailUrl?: string;    // Image preview banner
  icon?: string;            // Lucide icon name (e.g. "Trees", "Coffee")
}
```

### POI Definition
```typescript
export type POICategory = "rides" | "food" | "facility" | "gate";

export type POISubCategory = 
  | "adrenaline" 
  | "kids" 
  | "family" 
  | "toilet" 
  | "prayer_room" 
  | "first_aid" 
  | "merchandise" 
  | "resto" 
  | "snack";

export interface POIMeta {
  minHeightCm?: number;     // Minimum height restriction (e.g. 120)
  openHours?: string;       // Operational window (e.g. "08:00 - 17:00")
  isHalal?: boolean;        // Halal certified flag (renders Halal badge)
  ticketRequired?: boolean; // Requires dedicated admission ticket
}

export interface POILocation {
  id: string;               // Unique identifier (e.g. "poi-1")
  name: string;             // Display name (e.g. "Kolam 1")
  slug: string;             // URL-friendly slug (e.g. "kolam-1")
  category: POICategory;    // Primary filter category
  subcategory?: POISubCategory;
  regionId: string;         // Foreign key referencing RegionLocation.id
  coordinates: [number, number]; // [Longitude, Latitude] — MUST be [lng, lat]
  thumbnailUrl: string;     // Photo preview URL
  description: string;      // Detailed description for the detail panel
  icon?: string;            // Lucide icon name (e.g. "Waves", "Utensils")
  meta?: POIMeta;           // Contextual metadata
}
```

> [!IMPORTANT]
> **Coordinate Order**: Mapbox GL JS strictly follows the **`[Longitude, Latitude]`** order. Supplying `[lat, lng]` will position markers incorrectly (often into oceans or outside Indonesia).

---

## 3. Categories & Icon Conventions

| Category ID | Name (EN) | Name (ID) | Marker Accent | Recommended Lucide Icons |
| :--- | :--- | :--- | :--- | :--- |
| `rides` | Rides & Attractions | Wahana | `bg-chart-1` | `Waves`, `FerrisWheel`, `Tent`, `Rocket` |
| `food` | Food & Dining | Kuliner | `bg-chart-2` | `Utensils`, `Coffee`, `Pizza`, `IceCream` |
| `facility` | Public Facilities | Fasilitas | `bg-chart-3` | `ShieldAlert`, `Footprints`, `HelpCircle`, `HeartHandshake` |
| `gate` | Entrance & Parking | Pintu Masuk | `bg-chart-4` | `DoorOpen`, `Car`, `Ticket`, `Compass` |

Any valid PascalCase icon name from the [Lucide React Icon Library](https://lucide.dev/icons) can be used for the `icon` field. If omitted or misspelled, it gracefully defaults to `MapPin`.

---

## 4. Step-by-Step Guide: Adding a New POI

### Step 1: Obtain Geographic Coordinates
1. Open [`src/features/map/components/map-view.tsx`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/components/map-view.tsx).
2. Set `const DEBUG_MODE = true;`.
3. In your browser at `http://localhost:3000`, click on the exact location on the map to drop a pin.
4. Copy the logged `[longitude, latitude]` from the on-screen Debug HUD.

### Step 2: Add Entry to `poi-data.json`
Open [`src/lib/data/poi-data.json`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/lib/data/poi-data.json) and append a new object under `"pois"`:

```json
{
  "id": "poi-cafe-roastery",
  "name": "Curcool Coffee Roastery",
  "slug": "curcool-coffee-roastery",
  "category": "food",
  "subcategory": "resto",
  "regionId": "zona-2",
  "coordinates": [110.378150, -7.118210],
  "icon": "Coffee",
  "thumbnailUrl": "/images/cafe-roastery.webp",
  "description": "Artisan coffee roastery and bakery serving fresh local beans.",
  "meta": {
    "openHours": "07:00 - 21:00",
    "isHalal": true,
    "ticketRequired": false
  }
}
```

### Step 3: Verify & Typecheck
Run the TypeScript validation script to ensure data matches the expected schema:

```bash
npm run typecheck
```

Once confirmed, turn off debug mode (`DEBUG_MODE = false`).
