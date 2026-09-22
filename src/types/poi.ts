export type POICategory = "rides" | "food" | "facility" | "gate";
export type POISubCategory = "adrenaline" | "kids" | "family" | "toilet" | "prayer_room" | "first_aid" | "merchandise" | "resto" | "snack";

export interface POIMeta {
  minHeightCm?: number;
  openHours?: string;
  isHalal?: boolean;
  ticketRequired?: boolean;
}

export interface RegionLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  description?: string;
  thumbnailUrl?: string;
}

export interface POILocation {
  id: string;
  name: string;
  slug: string;
  category: POICategory;
  subcategory?: POISubCategory;
  regionId: string;
  coordinates: [number, number]; // [Longitude, Latitude]
  thumbnailUrl: string;
  description: string;
  meta?: POIMeta;
}

export interface MapData {
  regions: RegionLocation[];
  pois: POILocation[];
}
