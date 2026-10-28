import { arrivedAt, imAt, planRoute, startRide } from "@learnrt/core";
import { describe, expect, it } from "vitest";
import { alertText, ongoingText } from "./alertText";

const ride = () => startRide(planRoute("lrt1-carriedo", "mrt3-ayala")!.route, "single-journey", false);

describe("alertText", () => {
  it("warns one Station ahead", () => {
    expect(alertText({ kind: "next-station", stationId: "lrt1-edsa" }, ride())).toEqual({
      title: { key: "alerts.nextTitle", params: {} },
      body: { key: "alerts.nextBody", params: { station: "EDSA" } },
    });
  });

  it("says where to walk when getting off for a Transfer", () => {
    expect(alertText({ kind: "get-off", stationId: "lrt1-edsa" }, ride())).toEqual({
      title: { key: "alerts.getOffTitle", params: { station: "EDSA" } },
      body: { key: "alerts.transferBody", params: { station: "Taft Avenue", line: "MRT-3" } },
    });
  });

  it("says the rider has arrived when getting off at the destination", () => {
    expect(alertText({ kind: "get-off", stationId: "mrt3-ayala" }, ride())).toEqual({
      title: { key: "alerts.getOffTitle", params: { station: "Ayala" } },
      body: { key: "alerts.arriveBody", params: {} },
    });
  });
});

describe("ongoingText", () => {
  it("counts the stops left to the destination", () => {
    expect(ongoingText(ride())).toEqual({ key: "alerts.ongoing", params: { count: 10, station: "Ayala" } });
    expect(ongoingText(arrivedAt(ride(), "lrt1-edsa").state)).toEqual({ key: "alerts.ongoing", params: { count: 2, station: "Ayala" } });
  });

  it("has nothing to show once the ride is complete", () => {
    expect(ongoingText(imAt(ride(), "mrt3-ayala").state)).toBeNull();
  });
});
