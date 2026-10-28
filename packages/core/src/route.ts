import { transfersFrom } from "./graph";
import { getLine, getStation, stationsOnLine, type LineId } from "./network";

/** Riding one Line from the first to the last of `stationIds`. */
export interface RideSegment {
  kind: "ride";
  lineId: LineId;
  /** Stations in riding order, from where the rider boards to where they get off. */
  stationIds: string[];
  stops: number;
  /** The Line's end Station in the direction of travel, which names the direction. */
  towards: string;
}

/** Walking a Transfer from one Station to another. */
export interface WalkSegment {
  kind: "walk";
  from: string;
  to: string;
}

export type RouteSegment = RideSegment | WalkSegment;

/** Why a route was chosen: the default has the fewest Transfers; the alternative has fewer stops. */
export type RouteBasis = "fewest-transfers" | "fewer-stops";

export interface Route {
  basis: RouteBasis;
  segments: RouteSegment[];
  stops: number;
  transfers: number;
}

export interface RoutePlan {
  route: Route;
  /** Present only when another route has fewer stops than `route`. */
  alternative?: Route;
}

function ride(lineId: LineId, from: string, to: string): RideSegment {
  const line = stationsOnLine(lineId);
  const a = line.findIndex((s) => s.id === from);
  const b = line.findIndex((s) => s.id === to);
  const step = b > a ? 1 : -1;
  const stationIds: string[] = [];
  for (let i = a; i !== b + step; i += step) stationIds.push(line[i]!.id);
  return { kind: "ride", lineId, stationIds, stops: Math.abs(b - a), towards: (step > 0 ? line.at(-1) : line[0])!.id };
}

function toRoute(segments: RouteSegment[]): Route {
  return {
    basis: "fewest-transfers",
    segments,
    stops: segments.reduce((n, s) => n + (s.kind === "ride" ? s.stops : 0), 0),
    transfers: segments.filter((s) => s.kind === "walk").length,
  };
}

/** Every route from `at` to `destination` that never rides the same Line twice. */
function allRoutes(at: string, destination: string, used: LineId[], sofar: RouteSegment[]): Route[] {
  const lineId = getStation(at)!.lineId;
  // A ride of zero stops is not a ride: the rider just passes through the Station.
  const rideTo = (to: string) => (to === at ? [] : [ride(lineId, at, to)]);
  if (getStation(destination)!.lineId === lineId) return [toRoute([...sofar, ...rideTo(destination)])];

  return stationsOnLine(lineId).flatMap((s) =>
    transfersFrom(s.id)
      .filter((t) => !used.includes(getStation(t.to)!.lineId))
      .flatMap((t) =>
        allRoutes(t.to, destination, [...used, getStation(t.to)!.lineId], [
          ...sofar,
          ...rideTo(s.id),
          { kind: "walk", from: t.from, to: t.to },
        ]),
      ),
  );
}

const byTransfersThenStops = (a: Route, b: Route) => a.transfers - b.transfers || a.stops - b.stops;
const byStopsThenTransfers = (a: Route, b: Route) => a.stops - b.stops || a.transfers - b.transfers;

/**
 * The route with the fewest Transfers, and the route with the fewest stops when it has fewer stops
 * than that (owner decision 2026-10-28). No travel times are known, so neither is "fastest".
 */
export function planRoute(origin: string, destination: string): RoutePlan | null {
  const from = getStation(origin);
  const to = getStation(destination);
  if (!from || !to || origin === destination) return null;
  if (getLine(from.lineId)?.status !== "operational" || getLine(to.lineId)?.status !== "operational") return null;
  const routes = allRoutes(origin, destination, [from.lineId], []);
  const [route] = [...routes].sort(byTransfersThenStops);
  const [shortest] = [...routes].sort(byStopsThenTransfers);
  if (!route || !shortest) return null;
  return shortest.stops < route.stops ? { route, alternative: { ...shortest, basis: "fewer-stops" } } : { route };
}
