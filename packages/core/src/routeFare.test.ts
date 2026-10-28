import { describe, expect, it } from "vitest";
import { planRoute, type Route } from "./route";
import { routeFare } from "./routeFare";

// Fares from the converted fare matrices (unverified, data-todo D1–D4).
const carriedoToAyala = planRoute("lrt1-carriedo", "mrt3-ayala")!.route;

describe("routeFare", () => {
  it("charges each Line separately and adds them up", () => {
    expect(routeFare(carriedoToAyala, "single-journey", false)).toEqual({
      legs: [
        { lineId: "LRT1", from: "lrt1-carriedo", to: "lrt1-edsa", fare: 30 },
        { lineId: "MRT3", from: "mrt3-taft-ave", to: "mrt3-ayala", fare: 13 },
      ],
      total: 43,
    });
  });

  it("follows the ticket and Discounted Fare choice", () => {
    expect(routeFare(carriedoToAyala, "stored-value", false).total).toBe(40);
    expect(routeFare(carriedoToAyala, "single-journey", true).total).toBe(21);
  });

  it("has no total when any leg has no Fare, rather than a partial sum", () => {
    const route: Route = {
      ...carriedoToAyala,
      segments: [
        ...carriedoToAyala.segments,
        { kind: "ride", lineId: "MRT7", stationIds: ["mrt7-quezon-memorial-circle", "mrt7-university-avenue"], stops: 1, towards: "mrt7-university-avenue" },
      ],
    };
    const fare = routeFare(route, "single-journey", false);
    expect(fare.legs.map((l) => l.fare)).toEqual([30, 13, null]);
    expect(fare.total).toBeNull();
  });

  it("costs nothing for a walk between the two Stations of a Transfer", () => {
    expect(routeFare(planRoute("lrt1-doroteo-jose", "lrt2-recto")!.route, "single-journey", false)).toEqual({ legs: [], total: 0 });
  });
});
