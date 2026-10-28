import { describe, expect, it } from "vitest";
import { planRoute } from "./route";
import { rideSteps } from "./rideSteps";

const route = (from: string, to: string) => planRoute(from, to)!.route;

describe("rideSteps", () => {
  it("guides a ride on one Line: enter, pay, board, ride, arrive", () => {
    expect(rideSteps(route("lrt2-anonas", "lrt2-santolan"), "single-journey", false)).toEqual([
      { kind: "enter", stationId: "lrt2-anonas", entrance: null },
      { kind: "pay", lineId: "LRT2", stationId: "lrt2-anonas", ticket: "single-journey", fare: 20 },
      { kind: "board", lineId: "LRT2", stationId: "lrt2-anonas", towards: "lrt2-antipolo", platform: null },
      { kind: "ride", lineId: "LRT2", stationIds: ["lrt2-anonas", "lrt2-katipunan", "lrt2-santolan"], stops: 2 },
      { kind: "arrive", stationId: "lrt2-santolan", byTrain: true },
    ]);
  });

  it("pays and boards again after a Transfer, whose walk is not known yet", () => {
    const steps = rideSteps(route("lrt1-carriedo", "mrt3-ayala"), "stored-value", false);
    expect(steps.map((s) => s.kind)).toEqual(["enter", "pay", "board", "ride", "transfer", "pay", "board", "ride", "arrive"]);
    expect(steps[4]).toEqual({
      kind: "transfer",
      from: "lrt1-edsa",
      to: "mrt3-taft-ave",
      byTrain: true,
      walk: { minutes: null, metres: null, directions: null },
    });
    expect(steps[5]).toEqual({ kind: "pay", lineId: "MRT3", stationId: "mrt3-taft-ave", ticket: "stored-value", fare: 13 });
  });

  it("starts with the walk when the origin is the other end of a Transfer", () => {
    const steps = rideSteps(route("lrt1-doroteo-jose", "lrt2-legarda"), "single-journey", false);
    expect(steps.map((s) => s.kind)).toEqual(["transfer", "pay", "board", "ride", "arrive"]);
    expect(steps[0]).toMatchObject({ from: "lrt1-doroteo-jose", to: "lrt2-recto", byTrain: false });
  });

  it("ends on foot when the destination is the other end of a Transfer", () => {
    const steps = rideSteps(route("lrt1-carriedo", "lrt2-recto"), "single-journey", false);
    expect(steps.map((s) => s.kind)).toEqual(["enter", "pay", "board", "ride", "transfer", "arrive"]);
    expect(steps.at(-1)).toEqual({ kind: "arrive", stationId: "lrt2-recto", byTrain: false });
  });

  it("is only a walk between the two Stations of one Transfer", () => {
    expect(rideSteps(route("lrt1-doroteo-jose", "lrt2-recto"), "single-journey", false).map((s) => s.kind)).toEqual([
      "transfer",
      "arrive",
    ]);
  });
});
