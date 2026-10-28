import { LINE_AREAS, NSCR_STATIONS, PNR_STATIONS } from "./data/learn";
import { stationsOnLine, type LineId } from "./network";

export const learnData = {
  source: "LearnRT website explore page",
  lastVerified: null as string | null,
};

/** A Line LearnRT does not cover yet, shown in the Learn tab under "Not in LearnRT yet" (PRD §6). */
export interface UncoveredLine {
  name: string;
  /** Set when core models the Line (MRT-7), so it is never matched by name. */
  lineId?: LineId;
  /** Station names in Line order, or empty when there is no list. */
  stationNames: readonly string[];
}

export const uncoveredLines: readonly UncoveredLine[] = [
  { name: "MRT-7", lineId: "MRT7", stationNames: stationsOnLine("MRT7").map((s) => s.name) },
  { name: "Metro Manila Subway", stationNames: [] },
  { name: "NSCR", stationNames: NSCR_STATIONS },
  { name: "PNR", stationNames: PNR_STATIONS },
];

/** Areas a Line serves, as listed on the website; empty for Lines without a list. */
export function lineAreas(lineId: LineId): readonly string[] {
  return lineId === "MRT7" ? [] : LINE_AREAS[lineId];
}
