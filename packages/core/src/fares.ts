import { FARE_TABLES } from "./data/fares";
import { getStation, type LineId } from "./network";

export type TicketType = "single-journey" | "stored-value";

export interface FareQuery {
  line: LineId;
  from: string;
  to: string;
  ticket: TicketType;
  discounted: boolean;
}

/**
 * A fare matrix as converted from the website's .xlsx files.
 * `fares[destination][origin]` follows the files' layout: columns are origins, rows destinations.
 */
export interface FareTable {
  lineId: LineId;
  sourceFile: string;
  stationIds: readonly string[];
  fares: readonly (readonly (number | null)[])[];
}

export const fareData = {
  source: "LearnRT website fare matrices (apps/web/public/*-matrix.xlsx)",
  lastVerified: null as string | null,
};

// The website's rules, unverified (docs/data-todo.md D4).
function tableFor({ line, ticket, discounted }: FareQuery): FareTable | undefined {
  switch (line) {
    case "LRT1":
    case "LRT2":
      return FARE_TABLES[ticket === "single-journey" ? `${line}-sjt` : `${line}-svf`];
    case "MRT3":
      return FARE_TABLES[ticket === "single-journey" && discounted ? "MRT3-discounted-sjt" : "MRT3-regular"];
    default:
      return undefined;
  }
}

/** Fare in whole pesos for one ride on one Line, or null when there is none. */
export function getFare(query: FareQuery): number | null {
  const table = tableFor(query);
  if (!table) return null;
  if (getStation(query.from)?.lineId !== query.line || getStation(query.to)?.lineId !== query.line) return null;

  const origin = table.stationIds.indexOf(query.from);
  const destination = table.stationIds.indexOf(query.to);
  const base = table.fares[destination]?.[origin];
  if (base == null) return null;

  const halved = query.line !== "MRT3" && query.ticket === "single-journey" && query.discounted;
  return Math.ceil(halved ? base * 0.5 : base);
}
