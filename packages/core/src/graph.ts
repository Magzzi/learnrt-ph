import { getStation, stationsOnLine, type Station } from "./network";

/** A walk between two Stations on different Lines. Walking details are not known yet (data-todo D10). */
export interface Transfer {
  from: string;
  to: string;
  walk: { minutes: number | null; metres: number | null; directions: string | null };
}

export const transferData = {
  source: "PRD §9 and the LearnRT website landmark page",
  lastVerified: null as string | null,
};

const UNKNOWN_WALK = { minutes: null, metres: null, directions: null };

// Named in PRD §9 and in the website's landmark data.
export const transfers: readonly Transfer[] = [
  { from: "lrt1-doroteo-jose", to: "lrt2-recto", walk: UNKNOWN_WALK },
  { from: "lrt1-edsa", to: "mrt3-taft-ave", walk: UNKNOWN_WALK },
  { from: "lrt2-cubao", to: "mrt3-cubao", walk: UNKNOWN_WALK },
];

/** The Stations directly before and after a Station on its Line, in Line order. */
export function neighbours(stationId: string): Station[] {
  const station = getStation(stationId);
  if (!station) return [];
  const line = stationsOnLine(station.lineId);
  const i = line.findIndex((s) => s.id === stationId);
  return [line[i - 1], line[i + 1]].filter((s): s is Station => s !== undefined);
}

/** Transfers leaving a Station, in either direction of the stored Transfer. */
export function transfersFrom(stationId: string): Transfer[] {
  return transfers.flatMap((t) => {
    if (t.from === stationId) return [t];
    if (t.to === stationId) return [{ ...t, from: t.to, to: t.from }];
    return [];
  });
}
