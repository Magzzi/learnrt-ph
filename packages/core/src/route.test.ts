import { describe, expect, it } from "vitest";
import { planRoute, type Route } from "./route";

/** A compact picture of a route: "LRT1 a→b (n)" for each ride, "walk a→b" for each Transfer. */
function describeRoute(route: Route): string[] {
  return route.segments.map((s) =>
    s.kind === "ride"
      ? `${s.lineId} ${s.stationIds[0]}→${s.stationIds.at(-1)} (${s.stops}) towards ${s.towards}`
      : `walk ${s.from}→${s.to}`,
  );
}

describe("planRoute on one Line", () => {
  it("rides from origin to destination towards the end Station in that direction", () => {
    const plan = planRoute("lrt1-doroteo-jose", "lrt1-carriedo")!;
    expect(describeRoute(plan.route)).toEqual(["LRT1 lrt1-doroteo-jose→lrt1-carriedo (1) towards lrt1-dr-santos"]);
    expect(plan.route.stops).toBe(1);
    expect(plan.route.transfers).toBe(0);
  });
});

describe("planRoute across Lines", () => {
  it("joins LRT-1 and MRT-3 with the EDSA–Taft Avenue Transfer", () => {
    const plan = planRoute("lrt1-carriedo", "mrt3-ayala")!;
    expect(describeRoute(plan.route)).toEqual([
      "LRT1 lrt1-carriedo→lrt1-edsa (8) towards lrt1-dr-santos",
      "walk lrt1-edsa→mrt3-taft-ave",
      "MRT3 mrt3-taft-ave→mrt3-ayala (2) towards mrt3-north-ave",
    ]);
    expect(plan.route.stops).toBe(10);
    expect(plan.route.transfers).toBe(1);
  });

  it("joins LRT-2 and MRT-3 at Cubao, and LRT-1 and LRT-2 at Doroteo Jose–Recto", () => {
    expect(describeRoute(planRoute("lrt2-anonas", "mrt3-ortigas")!.route)).toEqual([
      "LRT2 lrt2-anonas→lrt2-cubao (1) towards lrt2-recto",
      "walk lrt2-cubao→mrt3-cubao",
      "MRT3 mrt3-cubao→mrt3-ortigas (2) towards mrt3-taft-ave",
    ]);
    expect(describeRoute(planRoute("lrt1-tayuman", "lrt2-legarda")!.route)).toEqual([
      "LRT1 lrt1-tayuman→lrt1-doroteo-jose (2) towards lrt1-dr-santos",
      "walk lrt1-doroteo-jose→lrt2-recto",
      "LRT2 lrt2-recto→lrt2-legarda (1) towards lrt2-antipolo",
    ]);
  });
});

describe("planRoute choice (owner decision 2026-10-28)", () => {
  it("defaults to the fewest Transfers and offers the route with fewer stops as an alternative", () => {
    const plan = planRoute("lrt1-monumento", "mrt3-north-ave")!;
    expect(plan.route.basis).toBe("fewest-transfers");
    expect(describeRoute(plan.route)).toEqual([
      "LRT1 lrt1-monumento→lrt1-edsa (16) towards lrt1-dr-santos",
      "walk lrt1-edsa→mrt3-taft-ave",
      "MRT3 mrt3-taft-ave→mrt3-north-ave (12) towards mrt3-north-ave",
    ]);
    expect([plan.route.stops, plan.route.transfers]).toEqual([28, 1]);

    expect(plan.alternative!.basis).toBe("fewer-stops");
    expect(describeRoute(plan.alternative!)).toEqual([
      "LRT1 lrt1-monumento→lrt1-doroteo-jose (7) towards lrt1-dr-santos",
      "walk lrt1-doroteo-jose→lrt2-recto",
      "LRT2 lrt2-recto→lrt2-cubao (7) towards lrt2-antipolo",
      "walk lrt2-cubao→mrt3-cubao",
      "MRT3 mrt3-cubao→mrt3-north-ave (3) towards mrt3-north-ave",
    ]);
    expect([plan.alternative!.stops, plan.alternative!.transfers]).toEqual([17, 2]);
  });

  it("offers no alternative when the fewest-Transfers route also has the fewest stops", () => {
    expect(planRoute("lrt1-carriedo", "mrt3-ayala")!.alternative).toBeUndefined();
    expect(planRoute("lrt1-doroteo-jose", "lrt1-carriedo")!.alternative).toBeUndefined();
  });
});

describe("planRoute edge cases", () => {
  it("has no route from a Station to itself", () => {
    expect(planRoute("lrt1-carriedo", "lrt1-carriedo")).toBeNull();
  });

  it("is only a walk between the two Stations of one Transfer", () => {
    const plan = planRoute("lrt1-doroteo-jose", "lrt2-recto")!;
    expect(describeRoute(plan.route)).toEqual(["walk lrt1-doroteo-jose→lrt2-recto"]);
    expect([plan.route.stops, plan.route.transfers]).toEqual([0, 1]);
  });

  it("starts or ends with the walk when the origin or destination is a Transfer Station", () => {
    expect(describeRoute(planRoute("lrt1-doroteo-jose", "lrt2-legarda")!.route)).toEqual([
      "walk lrt1-doroteo-jose→lrt2-recto",
      "LRT2 lrt2-recto→lrt2-legarda (1) towards lrt2-antipolo",
    ]);
    expect(describeRoute(planRoute("lrt1-carriedo", "lrt2-recto")!.route)).toEqual([
      "LRT1 lrt1-carriedo→lrt1-doroteo-jose (1) towards lrt1-fernando-poe-jr",
      "walk lrt1-doroteo-jose→lrt2-recto",
    ]);
  });

  it("rejects Stations on Lines that are not operational, and unknown ids", () => {
    expect(planRoute("lrt1-carriedo", "mrt7-quezon-memorial-circle")).toBeNull();
    expect(planRoute("mrt7-quezon-memorial-circle", "lrt1-carriedo")).toBeNull();
    expect(planRoute("mrt7-quezon-memorial-circle", "mrt7-university-avenue")).toBeNull();
    expect(planRoute("lrt1-carriedo", "nowhere")).toBeNull();
  });
});
