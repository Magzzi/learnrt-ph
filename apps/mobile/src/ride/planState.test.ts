import { describe, expect, it } from "vitest";
import { initialPlanState, planReducer, planTrip } from "./planState";

const trip = (from: string, to: string) =>
  planReducer(planReducer(initialPlanState(), { type: "from", stationId: from }), { type: "to", stationId: to });

describe("Ride planner state", () => {
  it("asks for both Stations until both are chosen", () => {
    expect(planTrip(initialPlanState())).toEqual({ kind: "incomplete" });
  });

  it("has no ride from a Station to itself", () => {
    expect(planTrip(trip("lrt1-carriedo", "lrt1-carriedo"))).toEqual({ kind: "same-station" });
  });

  it("plans across Lines with the Fare for the chosen ticket", () => {
    const result = planTrip(planReducer(trip("lrt1-carriedo", "mrt3-ayala"), { type: "ticket", ticket: "stored-value" }));
    expect(result.kind).toBe("planned");
    if (result.kind !== "planned") return;
    expect(result.options.map((o) => [o.route.basis, o.fare.total])).toEqual([["fewest-transfers", 40]]);
  });

  it("offers the fewer-stops alternative with its own Fare", () => {
    const result = planTrip(trip("lrt1-monumento", "mrt3-north-ave"));
    if (result.kind !== "planned") throw new Error(result.kind);
    expect(result.options.map((o) => [o.route.basis, o.route.stops, o.route.transfers])).toEqual([
      ["fewest-transfers", 28, 1],
      ["fewer-stops", 17, 2],
    ]);
  });

  it("swaps origin and destination", () => {
    const swapped = planReducer(trip("lrt1-carriedo", "mrt3-ayala"), { type: "swap" });
    expect([swapped.from, swapped.to]).toEqual(["mrt3-ayala", "lrt1-carriedo"]);
  });

  it("starts from Station detail's \"Ride from here\" or \"Ride to here\"", () => {
    expect(initialPlanState({ from: "lrt2-cubao" }).from).toBe("lrt2-cubao");
    expect(initialPlanState({ to: "lrt2-cubao" }).to).toBe("lrt2-cubao");
    expect(initialPlanState({ from: "mrt7-quezon-memorial-circle" }).from).toBeNull();
  });
});
