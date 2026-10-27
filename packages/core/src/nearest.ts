import { distanceKm, type LatLng } from "./distance";
import { getLine, stations, type LineStatus, type Station } from "./network";

export interface NearestStation {
  station: Station;
  distanceKm: number;
}

export interface NearestStationOptions {
  /** How many Stations to return. Defaults to 3. */
  limit?: number;
  /** Only Stations on Lines with these statuses. Defaults to operational Lines. */
  statuses?: readonly LineStatus[];
}

/** Stations closest to a point, nearest first. Works offline; there is no distance cut-off. */
export function findNearestStations(
  point: LatLng,
  { limit = 3, statuses = ["operational"] }: NearestStationOptions = {},
): NearestStation[] {
  return stations
    .filter((station) => {
      const status = getLine(station.lineId)?.status;
      return status !== undefined && statuses.includes(status);
    })
    .map((station) => ({ station, distanceKm: distanceKm(point, station.location) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
