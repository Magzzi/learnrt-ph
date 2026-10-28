import { advanceStep, imAt, planRoute, startRide } from "@learnrt/core";
import { describe, expect, it } from "vitest";
import { rideView } from "./rideView";

const ride = () => startRide(planRoute("lrt1-carriedo", "mrt3-ayala")!.route, "single-journey", false);

describe("rideView", () => {
  it("at the origin: the first step, done-able, with the Stations ahead on this Line", () => {
    const view = rideView(ride());
    expect(view.current.key).toBe("ride.enter");
    expect(view.canAdvance).toBe(true);
    expect(view.getOffAt).toBe("lrt1-edsa");
    expect(view.ahead).toEqual([
      "lrt1-central-terminal",
      "lrt1-un-avenue",
      "lrt1-pedro-gil",
      "lrt1-quirino",
      "lrt1-vito-cruz",
      "lrt1-gil-puyat",
      "lrt1-libertad",
      "lrt1-edsa",
    ]);
    expect(view.upcoming).toHaveLength(8);
  });

  it("on the train, the ride step counts the stops still to go, not the whole leg", () => {
    const view = rideView(imAt(ride(), "lrt1-quirino").state);
    expect(view.current).toEqual({ key: "ride.ride", params: { count: 4, station: "EDSA" } });
    expect(view.canAdvance).toBe(false);
    expect(view.ahead).toEqual(["lrt1-vito-cruz", "lrt1-gil-puyat", "lrt1-libertad", "lrt1-edsa"]);
  });

  it("marks steps that show a Fare or a Transfer as unverified", () => {
    expect(rideView(advanceStep(ride())).unverified).toBe(true); // pay: a Fare
    expect(rideView(imAt(ride(), "lrt1-edsa").state).unverified).toBe(true); // the Transfer
    expect(rideView(ride()).unverified).toBe(false); // enter
  });

  it("has nothing ahead between trains", () => {
    expect(rideView(imAt(ride(), "lrt1-edsa").state).ahead).toEqual([]);
  });
});
