import type { TicketType } from "./fares";
import { transfersFrom, type Transfer } from "./graph";
import type { LineId } from "./network";
import type { Route } from "./route";
import { routeFare } from "./routeFare";

/**
 * One instruction of a Guided Ride, as data; the app words it in the rider's language.
 * `null` details (entrance, platform, walk) are not known yet (data-todo D10, D15) and are never guessed.
 */
export type RideStep =
  | { kind: "enter"; stationId: string; entrance: null }
  | { kind: "pay"; lineId: LineId; stationId: string; ticket: TicketType; fare: number | null }
  | { kind: "board"; lineId: LineId; stationId: string; towards: string; platform: null }
  | { kind: "ride"; lineId: LineId; stationIds: string[]; stops: number }
  /** `byTrain` is false when the rider starts the walk on foot, not by getting off a train. */
  | { kind: "transfer"; from: string; to: string; byTrain: boolean; walk: Transfer["walk"] }
  | { kind: "arrive"; stationId: string; byTrain: boolean };

export function rideSteps(route: Route, ticket: TicketType, discounted: boolean): RideStep[] {
  const fares = routeFare(route, ticket, discounted).legs;
  const steps: RideStep[] = [];
  let leg = 0;
  route.segments.forEach((s, i) => {
    if (s.kind === "ride") {
      const stationId = s.stationIds[0]!;
      if (i === 0) steps.push({ kind: "enter", stationId, entrance: null });
      steps.push({ kind: "pay", lineId: s.lineId, stationId, ticket, fare: fares[leg++]!.fare });
      steps.push({ kind: "board", lineId: s.lineId, stationId, towards: s.towards, platform: null });
      steps.push({ kind: "ride", lineId: s.lineId, stationIds: s.stationIds, stops: s.stops });
    } else {
      const walk = transfersFrom(s.from).find((t) => t.to === s.to)!.walk;
      steps.push({ kind: "transfer", from: s.from, to: s.to, byTrain: i > 0, walk });
    }
  });
  const last = route.segments.at(-1)!;
  const destination = last.kind === "ride" ? last.stationIds.at(-1)! : last.to;
  steps.push({ kind: "arrive", stationId: destination, byTrain: last.kind === "ride" });
  return steps;
}
