import { getFare, getLine, getStation, planRoute, routeFare, type LegFare, type TicketType } from "@learnrt/core";

export interface FaresState {
  from: string | null;
  to: string | null;
  ticket: TicketType;
  discounted: boolean;
}

export type FaresAction =
  | { type: "from"; stationId: string }
  | { type: "to"; stationId: string }
  | { type: "ticket"; ticket: TicketType }
  | { type: "discounted"; value: boolean };

/** `total` is null when a leg has no Fare: a partial sum would understate the cost. */
export type Quote =
  | { kind: "fare"; total: number | null; legs: LegFare[] }
  | { kind: "walk-only" }
  | { kind: "no-fare" }
  | { kind: "incomplete" };

const rideable = (id: string | undefined) => {
  const station = id ? getStation(id) : undefined;
  return station && getLine(station.lineId)?.status === "operational" ? station.id : null;
};

/** Starting state, optionally from Station detail's "Fares from here" (`from` route param). */
export function initialFaresState(params: { from?: string } = {}): FaresState {
  return { from: rideable(params.from), to: null, ticket: "single-journey", discounted: false };
}

export function faresReducer(state: FaresState, action: FaresAction): FaresState {
  switch (action.type) {
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

/** The Fare between any two Stations: one per Line ridden, on the default (fewest Transfers) route. */
export function quote({ from, to, ticket, discounted }: FaresState): Quote {
  if (!from || !to) return { kind: "incomplete" };
  if (from === to) {
    // Entering and leaving at one Station: the fare tables' own answer (data-todo D5).
    const line = getStation(from)!.lineId;
    const fare = getFare({ line, from, to, ticket, discounted });
    return fare === null ? { kind: "no-fare" } : { kind: "fare", total: fare, legs: [{ lineId: line, from, to, fare }] };
  }
  const plan = planRoute(from, to);
  if (!plan) return { kind: "no-fare" };
  const { legs, total } = routeFare(plan.route, ticket, discounted);
  return legs.length === 0 ? { kind: "walk-only" } : { kind: "fare", total, legs };
}

export const formatPesos = (pesos: number) => `₱${pesos}`;
