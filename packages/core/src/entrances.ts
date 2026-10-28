import type { LatLng } from "./distance";
import { ENTRANCES, OSM_ENTRANCES_BASE } from "./data/entrances";

/** A way into a Station, from OpenStreetMap. `ref` and `name` are as tagged there, often absent. */
export interface Entrance {
  osmId: string;
  location: LatLng;
  ref: string | null;
  name: string | null;
}

export const entranceData = {
  source: "OpenStreetMap entrance points linked to Stations by OSM stop areas",
  attribution: "© OpenStreetMap contributors, ODbL",
  osmBase: OSM_ENTRANCES_BASE,
  lastVerified: null as string | null,
};

/** The Station's entrances that OSM links to it; empty when OSM links none. */
export function entrancesAt(stationId: string): readonly Entrance[] {
  return ENTRANCES[stationId] ?? [];
}
