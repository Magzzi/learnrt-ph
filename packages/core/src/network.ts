import type { LatLng } from "./distance";
import { STATIONS } from "./data/stations";

export type LineId = "LRT1" | "LRT2" | "MRT3" | "MRT7";

export type LineStatus = "operational" | "coming-soon" | "suspended";

export interface Line {
  id: LineId;
  name: string;
  status: LineStatus;
}

export interface Station {
  id: string;
  name: string;
  lineId: LineId;
  location: LatLng;
}

/** Where the network data came from, and when it was last checked against an official source. */
export const networkData = {
  source: "LearnRT website (fare matrix headers and findnearest.ts)",
  lastVerified: null as string | null,
};

export const lines: readonly Line[] = [
  { id: "LRT1", name: "LRT-1", status: "operational" },
  { id: "LRT2", name: "LRT-2", status: "operational" },
  { id: "MRT3", name: "MRT-3", status: "operational" },
  { id: "MRT7", name: "MRT-7", status: "coming-soon" },
];

/** All Stations, grouped by Line and in Line order. */
export const stations: readonly Station[] = STATIONS;

const stationsById = new Map(stations.map((s) => [s.id, s]));

export function getLine(id: LineId): Line | undefined {
  return lines.find((l) => l.id === id);
}

export function getStation(id: string): Station | undefined {
  return stationsById.get(id);
}

/** The Stations of a Line, in Line order. */
export function stationsOnLine(lineId: LineId): Station[] {
  return stations.filter((s) => s.lineId === lineId);
}
