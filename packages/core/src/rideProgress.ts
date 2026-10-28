import { distanceKm } from "./distance";
import type { TicketType } from "./fares";
import { getStation, stations } from "./network";
import type { Route } from "./route";
import { rideSteps } from "./rideSteps";

/** A Guided Ride in progress. Plain data, so the app can save it and read it back. */
export interface RideState {
  route: Route;
  ticket: TicketType;
  discounted: boolean;
  /** Index into `rideSteps(route, ticket, discounted)`. */
  stepIndex: number;
  /** Index into the route's Stations in riding order (see `routeStations`). */
  position: number;
  /** Alerts already given, as "kind:stationId", so none fires twice. */
  alerted: string[];
  ended: boolean;
}

export type RideAlert = { kind: "next-station" | "get-off"; stationId: string };

export interface RideUpdate {
  state: RideState;
  /** Alerts that became due with this update. */
  alerts: RideAlert[];
}

export interface RideStatus {
  stationId: string;
  /** Stops until the rider gets off the current train (0 between trains). */
  stopsLeftOnLeg: number;
  stopsLeft: number;
  completed: boolean;
}

interface Stop {
  stationId: string;
  /** Riding on from here to the next Stop takes one stop; walking a Transfer takes none. */
  rideToNext: boolean;
  /** The rider gets off a train here. */
  getOff: boolean;
}

/** The route's Stations in the order the rider passes them, including both ends of each Transfer. */
function routeStops(route: Route): Stop[] {
  const stops: Stop[] = [];
  const add = (stationId: string) => {
    if (stops.at(-1)?.stationId !== stationId) stops.push({ stationId, rideToNext: false, getOff: false });
    return stops.at(-1)!;
  };
  for (const s of route.segments) {
    if (s.kind === "walk") {
      add(s.from);
      add(s.to);
      continue;
    }
    s.stationIds.forEach((id, i) => {
      const stop = add(id);
      if (i < s.stationIds.length - 1) stop.rideToNext = true;
      else stop.getOff = true;
    });
  }
  return stops;
}

/** The position in `routeStops` each step belongs to: where the rider is when doing it. */
function stepPositions(state: Pick<RideState, "route" | "ticket" | "discounted">): number[] {
  const stops = routeStops(state.route);
  const at = (id: string) => stops.findIndex((s) => s.stationId === id);
  return rideSteps(state.route, state.ticket, state.discounted).map((step) => {
    switch (step.kind) {
      case "ride":
        return at(step.stationIds[0]!);
      case "transfer":
        return at(step.from);
      default:
        return at(step.stationId);
    }
  });
}

/** The step to show on reaching `position`: the first step there, or the ride step while between Stations. */
function stepAt(state: RideState, position: number): number {
  const positions = stepPositions(state);
  const first = positions.indexOf(position);
  if (first >= 0) return first;
  let last = 0;
  positions.forEach((p, i) => {
    if (p < position) last = i;
  });
  return last;
}

export function startRide(route: Route, ticket: TicketType, discounted: boolean): RideState {
  return { route, ticket, discounted, stepIndex: 0, position: 0, alerted: [], ended: false };
}

/** The rider has done the current step; moves on only to a step at the same Station. */
export function advanceStep(state: RideState): RideState {
  const positions = stepPositions(state);
  return positions[state.stepIndex + 1] === state.position ? { ...state, stepIndex: state.stepIndex + 1 } : state;
}

function moveTo(state: RideState, position: number): RideUpdate {
  const stops = routeStops(state.route);
  const due: RideAlert[] = [];
  const here = stops[position]!;
  if (here.getOff) due.push({ kind: "get-off", stationId: here.stationId });
  else if (here.rideToNext && stops[position + 1]?.getOff) due.push({ kind: "next-station", stationId: stops[position + 1]!.stationId });

  const alerts = due.filter((a) => !state.alerted.includes(`${a.kind}:${a.stationId}`));
  const moved = { ...state, position, alerted: [...state.alerted, ...alerts.map((a) => `${a.kind}:${a.stationId}`)] };
  return { state: { ...moved, stepIndex: stepAt(moved, position) }, alerts };
}

/** A geofence says the rider reached a Station. Only Stations ahead on the route move the ride. */
export function arrivedAt(state: RideState, stationId: string): RideUpdate {
  const position = routeStops(state.route).findIndex((s, i) => i > state.position && s.stationId === stationId);
  return position < 0 ? { state, alerts: [] } : moveTo(state, position);
}

/** The rider says where they are ("I'm at ___"): any Station on the route, forward or back. */
export function imAt(state: RideState, stationId: string): RideUpdate {
  const position = routeStops(state.route).findIndex((s) => s.stationId === stationId);
  return position < 0 ? { state, alerts: [] } : moveTo(state, position);
}

export function endRide(state: RideState): RideState {
  return { ...state, ended: true };
}

export function rideStatus(state: RideState): RideStatus {
  const stops = routeStops(state.route);
  const ahead = stops.slice(state.position);
  const legEnd = ahead.findIndex((s) => s.getOff);
  const onTrain = ahead[0]!.rideToNext;
  return {
    stationId: stops[state.position]!.stationId,
    stopsLeftOnLeg: onTrain && legEnd > 0 ? legEnd : 0,
    stopsLeft: ahead.filter((s) => s.rideToNext).length,
    completed: state.position === stops.length - 1,
  };
}

/** A circle around a Station; entering it counts as arriving there. */
export interface GeofenceRegion {
  stationId: string;
  latitude: number;
  longitude: number;
  /** Metres. */
  radius: number;
}

/** iOS monitors at most 20 regions per app. */
const MAX_REGIONS = 20;
/** A tuning setting, not Station data. */
const DEFAULT_RADIUS_M = 150;

function radiusFor(stationId: string): number {
  const here = getStation(stationId)!.location;
  const nearestKm = Math.min(...stations.filter((s) => s.id !== stationId).map((s) => distanceKm(here, s.location)));
  return Math.floor(Math.min(DEFAULT_RADIUS_M, (nearestKm * 1000) / 2));
}

/** The regions to watch: the Stations ahead on the route, nearest first. */
export function geofenceRegions(state: RideState): GeofenceRegion[] {
  if (state.ended) return [];
  return routeStops(state.route)
    .slice(state.position + 1, state.position + 1 + MAX_REGIONS)
    .map(({ stationId }) => {
      const { lat, lng } = getStation(stationId)!.location;
      return { stationId, latitude: lat, longitude: lng, radius: radiusFor(stationId) };
    });
}
