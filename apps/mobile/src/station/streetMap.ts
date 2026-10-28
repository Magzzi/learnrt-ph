import { entranceData, entrancesAt, getStation } from "@learnrt/core";

export interface StreetMapData {
  station: { id: string; name: string };
  /** [longitude, latitude], as MapLibre expects. */
  center: [number, number];
  /** `label` is the entrance's OSM ref or name; null when OSM has neither (no number is made up). */
  entrances: { osmId: string; label: string | null; lngLat: [number, number] }[];
  unverified: boolean;
}

/** What the street map shows for a Station: the Station and the entrances OSM links to it. */
export function streetMap(stationId: string): StreetMapData | null {
  const station = getStation(stationId);
  if (!station) return null;
  return {
    station: { id: station.id, name: station.name },
    center: [station.location.lng, station.location.lat],
    entrances: entrancesAt(stationId).map((e) => ({
      osmId: e.osmId,
      label: e.ref ?? e.name,
      lngLat: [e.location.lng, e.location.lat],
    })),
    unverified: entranceData.lastVerified === null,
  };
}
