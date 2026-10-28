import { getLine, getStation, planRoute, routeFare, type Route, type RouteFare, type TicketType } from "@learnrt/core";

export interface PlanState {
  from: string | null;
  to: string | null;
  ticket: TicketType;
  discounted: boolean;
}

export type PlanAction =
  | { type: "from"; stationId: string }
  | { type: "to"; stationId: string }
  | { type: "swap" }
  | { type: "ticket"; ticket: TicketType }
  | { type: "discounted"; value: boolean };

export interface RouteOption {
  route: Route;
  fare: RouteFare;
}

export type PlanResult =
  | { kind: "incomplete" }
  | { kind: "same-station" }
  | { kind: "no-route" }
  | { kind: "planned"; options: RouteOption[] };

const rideable = (id: string | undefined) => {
  const station = id ? getStation(id) : undefined;
  return station && getLine(station.lineId)?.status === "operational" ? station.id : null;
};

/** Starting state, optionally from Station detail ("Ride from here" / "Ride to here"). */
export function initialPlanState(params: { from?: string; to?: string } = {}): PlanState {
  return { from: rideable(params.from), to: rideable(params.to), ticket: "single-journey", discounted: false };
}

export function planReducer(state: PlanState, action: PlanAction): PlanState {
  switch (action.type) {
    case "from":
      return { ...state, from: action.stationId };
    case "to":
      return { ...state, to: action.stationId };
    case "swap":
      return { ...state, from: state.to, to: state.from };
    case "ticket":
      return { ...state, ticket: action.ticket };
    case "discounted":
      return { ...state, discounted: action.value };
  }
}

/** The default route (fewest Transfers) and, when there is one, the fewer-stops alternative, each with its Fare. */
export function planTrip({ from, to, ticket, discounted }: PlanState): PlanResult {
  if (!from || !to) return { kind: "incomplete" };
  if (from === to) return { kind: "same-station" };
  const plan = planRoute(from, to);
  if (!plan) return { kind: "no-route" };
  const routes = plan.alternative ? [plan.route, plan.alternative] : [plan.route];
  return { kind: "planned", options: routes.map((route) => ({ route, fare: routeFare(route, ticket, discounted) })) };
}
