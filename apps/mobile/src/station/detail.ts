import {
  getLine,
  getStation,
  landmarkData,
  landmarksAt,
  neighbours,
  networkData,
  transfersFrom,
  type Line,
} from "@learnrt/core";

export interface StationDetail {
  id: string;
  name: string;
  /** "<Station> · <Line>", so same-named Stations on different Lines stay distinct. */
  title: string;
  line: Line;
  neighbours: { id: string; name: string }[];
  transfers: {
    stationId: string;
    stationName: string;
    lineName: string;
    walkMinutes: number | null;
    directions: string | null;
  }[];
  landmarks: readonly string[];
  /** Parts of the page whose data has never been checked against an official source. */
  unverified: { station: boolean; transfers: boolean; landmarks: boolean };
}

/** Everything the Station page shows, or undefined for an unknown Station. */
export function stationDetail(stationId: string): StationDetail | undefined {
  const station = getStation(stationId);
  const line = station && getLine(station.lineId);
  if (!station || !line) return undefined;

  return {
    id: station.id,
    name: station.name,
    title: `${station.name} · ${line.name}`,
    line,
    neighbours: neighbours(station.id).map((n) => ({ id: n.id, name: n.name })),
    transfers: transfersFrom(station.id).map((t) => {
      const other = getStation(t.to)!;
      return {
        stationId: other.id,
        stationName: other.name,
        lineName: getLine(other.lineId)!.name,
        walkMinutes: t.walk.minutes,
        directions: t.walk.directions,
      };
    }),
    landmarks: landmarksAt(station.id),
    unverified: {
      station: networkData.lastVerified === null,
      // Transfers are part of the network data.
      transfers: networkData.lastVerified === null,
      landmarks: landmarkData.lastVerified === null,
    },
  };
}
