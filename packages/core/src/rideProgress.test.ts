import { describe, expect, it } from "vitest";
import { planRoute } from "./route";
import { rideSteps } from "./rideSteps";
import { advanceStep, arrivedAt, endRide, geofenceRegions, imAt, rideStations, rideStatus, startRide, type RideState } from "./rideProgress";

const route = (from: string, to: string) => planRoute(from, to)!.route;
// LRT-1 Carriedo → EDSA (8 stops), walk to Taft Avenue, MRT-3 → Ayala (2 stops).
const start = () => startRide(route("lrt1-carriedo", "mrt3-ayala"), "single-journey", false);
const kindOf = (state: RideState) => rideSteps(state.route, state.ticket, state.discounted)[state.stepIndex]!.kind;

describe("Guided Ride progress", () => {
  it("starts at the origin on the first step, with every stop still to ride", () => {
    const state = start();
    expect(kindOf(state)).toBe("enter");
    expect(rideStatus(state)).toEqual({ stationId: "lrt1-carriedo", stopsLeftOnLeg: 8, stopsLeft: 10, completed: false });
  });

  it("lets the rider tick off the steps at a Station, but not ride on without arriving somewhere", () => {
    let state = start();
    state = advanceStep(state); // pay
    state = advanceStep(state); // board
    state = advanceStep(state); // ride
    expect(kindOf(state)).toBe("ride");
    expect(advanceStep(state)).toEqual(state);
  });

  it("moves forward when the rider arrives at a later Station, skipping missed ones", () => {
    const { state, alerts } = arrivedAt(start(), "lrt1-quirino");
    expect(kindOf(state)).toBe("ride");
    expect(rideStatus(state)).toMatchObject({ stationId: "lrt1-quirino", stopsLeftOnLeg: 4, stopsLeft: 6 });
    expect(alerts).toEqual([]);
  });

  it("ignores GPS arrivals behind the rider or off the route", () => {
    const ahead = arrivedAt(start(), "lrt1-quirino").state;
    expect(arrivedAt(ahead, "lrt1-pedro-gil")).toEqual({ state: ahead, alerts: [] });
    expect(arrivedAt(ahead, "lrt2-cubao")).toEqual({ state: ahead, alerts: [] });
  });

  it("warns one Station before getting off, then says to get off, once each", () => {
    let result = arrivedAt(start(), "lrt1-libertad");
    expect(result.alerts).toEqual([{ kind: "next-station", stationId: "lrt1-edsa" }]);
    result = arrivedAt(result.state, "lrt1-edsa");
    expect(result.alerts).toEqual([{ kind: "get-off", stationId: "lrt1-edsa" }]);
    expect(kindOf(result.state)).toBe("transfer");

    // "I'm at" back to Libertad, then GPS again: the alerts have already fired.
    const back = imAt(result.state, "lrt1-libertad");
    expect(back.alerts).toEqual([]);
    expect(arrivedAt(back.state, "lrt1-edsa").alerts).toEqual([]);
  });

  it("only says to get off when the rider jumps straight to that Station", () => {
    expect(arrivedAt(start(), "lrt1-edsa").alerts).toEqual([{ kind: "get-off", stationId: "lrt1-edsa" }]);
  });

  it("goes to paying for the next Line after walking a Transfer", () => {
    const { state } = arrivedAt(arrivedAt(start(), "lrt1-edsa").state, "mrt3-taft-ave");
    expect(kindOf(state)).toBe("pay");
    expect(rideStatus(state)).toMatchObject({ stationId: "mrt3-taft-ave", stopsLeftOnLeg: 2, stopsLeft: 2 });
  });

  it("lets the rider say where they are, forward or back, but only on the route", () => {
    const forward = imAt(start(), "mrt3-magallanes").state;
    expect(rideStatus(forward).stationId).toBe("mrt3-magallanes");
    const back = imAt(forward, "lrt1-pedro-gil").state;
    expect(rideStatus(back).stationId).toBe("lrt1-pedro-gil");
    expect(imAt(back, "lrt2-cubao").state).toEqual(back);
  });

  it("completes on arrival at the destination", () => {
    const { state, alerts } = arrivedAt(imAt(start(), "mrt3-magallanes").state, "mrt3-ayala");
    expect(alerts).toEqual([{ kind: "get-off", stationId: "mrt3-ayala" }]);
    expect(kindOf(state)).toBe("arrive");
    expect(rideStatus(state)).toMatchObject({ stopsLeft: 0, completed: true });
  });

  it("can be ended at any time", () => {
    expect(endRide(start()).ended).toBe(true);
  });

  it("survives being saved as JSON and read back", () => {
    const state = arrivedAt(start(), "lrt1-libertad").state;
    expect(JSON.parse(JSON.stringify(state))).toEqual(state);
  });

  it("completes a walk-only ride when the rider reaches the other Station", () => {
    const state = startRide(route("lrt1-doroteo-jose", "lrt2-recto"), "single-journey", false);
    expect(kindOf(state)).toBe("transfer");
    const { state: done, alerts } = arrivedAt(state, "lrt2-recto");
    expect(alerts).toEqual([]);
    expect(rideStatus(done).completed).toBe(true);
  });
});

describe("geofenceRegions", () => {
  it("watches only the Stations ahead, at most 20", () => {
    const state = startRide(route("lrt1-dr-santos", "lrt1-fernando-poe-jr"), "single-journey", false);
    const regions = geofenceRegions(state);
    expect(regions).toHaveLength(20);
    expect(regions[0]!.stationId).toBe("lrt1-ninoy-aquino-avenue");
    const later = imAt(state, "lrt1-tayuman").state;
    expect(geofenceRegions(later).map((r) => r.stationId)).toEqual([
      "lrt1-blumentritt",
      "lrt1-abad-santos",
      "lrt1-r-papa",
      "lrt1-5th-avenue",
      "lrt1-monumento",
      "lrt1-balintawak",
      "lrt1-fernando-poe-jr",
    ]);
  });

  it("uses 150 m, or half the distance to the nearest other Station so two areas never overlap", () => {
    const regions = geofenceRegions(start());
    const byId = Object.fromEntries(regions.map((r) => [r.stationId, r]));
    // EDSA and Taft Avenue are 192 m apart (OSM positions).
    expect(byId["lrt1-edsa"]!.radius).toBe(96);
    expect(byId["mrt3-taft-ave"]!.radius).toBe(96);
    expect(byId["lrt1-quirino"]!.radius).toBe(150);
    expect(byId["lrt1-edsa"]).toMatchObject({ latitude: expect.any(Number), longitude: expect.any(Number) });
  });

  it("watches nothing once the ride is over", () => {
    expect(geofenceRegions(arrivedAt(imAt(start(), "mrt3-magallanes").state, "mrt3-ayala").state)).toEqual([]);
    expect(geofenceRegions(endRide(start()))).toEqual([]);
  });
});

describe("rideStations", () => {
  it("lists the route's Stations in riding order, both ends of each Transfer included", () => {
    expect(rideStations(route("lrt1-libertad", "mrt3-magallanes"))).toEqual([
      "lrt1-libertad",
      "lrt1-edsa",
      "mrt3-taft-ave",
      "mrt3-magallanes",
    ]);
  });
});
