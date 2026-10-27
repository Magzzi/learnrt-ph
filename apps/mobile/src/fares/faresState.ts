import { getFare, getStation, type LineId, type TicketType } from "@learnrt/core";

/** Lines the Fares screen offers: those with fare tables. */
export const FARE_LINES = ["LRT1", "LRT2", "MRT3"] as const satisfies readonly LineId[];
export type FareLine = (typeof FARE_LINES)[number];

export interface FaresState {
  line: FareLine;
  from: string | null;
  to: string | null;
  ticket: TicketType;
  discounted: boolean;
}

export type FaresAction =
  | { type: "line"; line: FareLine }
  | { type: "from"; stationId: string }
  | { type: "to"; stationId: string }
  | { type: "ticket"; ticket: TicketType }
  | { type: "discounted"; value: boolean };

export type Quote = { kind: "fare"; pesos: number } | { kind: "no-fare" } | { kind: "incomplete" };

const isFareLine = (line: string | undefined): line is FareLine => (FARE_LINES as readonly string[]).includes(line ?? "");

/** Starting state, optionally from Station detail's "Fares from here" (`line`, `from` route params). */
export function initialFaresState(params: { line?: string; from?: string } = {}): FaresState {
  const line = isFareLine(params.line) ? params.line : "LRT1";
  const from = params.from && getStation(params.from)?.lineId === line ? params.from : null;
  return { line, from, to: null, ticket: "single-journey", discounted: false };
}

export function faresReducer(state: FaresState, action: FaresAction): FaresState {
  switch (action.type) {
    case "line":
      return action.line === state.line ? state : { ...state, line: action.line, from: null, to: null };
    case "from":
      return { ...state, from: action.stationId };
    case "to":
      return { ...state, to: action.stationId };
    case "ticket":
      return { ...state, ticket: action.ticket };
    case "discounted":
      return { ...state, discounted: action.value };
  }
}

export function quote({ line, from, to, ticket, discounted }: FaresState): Quote {
  if (!from || !to) return { kind: "incomplete" };
  const pesos = getFare({ line, from, to, ticket, discounted });
  return pesos === null ? { kind: "no-fare" } : { kind: "fare", pesos };
}

export const formatPesos = (pesos: number) => `₱${pesos}`;
