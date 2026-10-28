import { getFare, type TicketType } from "./fares";
import type { LineId } from "./network";
import type { Route } from "./route";

export interface LegFare {
  lineId: LineId;
  from: string;
  to: string;
  /** Null when there is no Fare for this leg. */
  fare: number | null;
}

export interface RouteFare {
  legs: LegFare[];
  /** Null when any leg has no Fare: a partial sum would understate the cost. */
  total: number | null;
}

/** One Fare per Line ridden, since each Line charges its own Fare, plus the total. */
export function routeFare(route: Route, ticket: TicketType, discounted: boolean): RouteFare {
  const legs = route.segments.flatMap((s) => {
    if (s.kind !== "ride") return [];
    const from = s.stationIds[0]!;
    const to = s.stationIds.at(-1)!;
    return [{ lineId: s.lineId, from, to, fare: getFare({ line: s.lineId, from, to, ticket, discounted }) }];
  });
  const total = legs.every((l) => l.fare !== null) ? legs.reduce((n, l) => n + l.fare!, 0) : null;
  return { legs, total };
}
