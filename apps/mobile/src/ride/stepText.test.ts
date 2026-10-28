import { planRoute, rideSteps } from "@learnrt/core";
import { describe, expect, it } from "vitest";
import { stepText } from "./stepText";

const steps = (from: string, to: string, ticket: "single-journey" | "stored-value" = "single-journey") =>
  rideSteps(planRoute(from, to)!.route, ticket, false);

describe("stepText", () => {
  it("words a ride on one Line, keeping unknown details as \"not available\" notes", () => {
    expect(steps("lrt2-anonas", "lrt2-santolan").map(stepText)).toEqual([
      { key: "ride.enter", params: { station: "Anonas" }, note: "ride.entranceUnknown" },
      { key: "ride.paySingle", params: { line: "LRT-2", fare: "₱20" } },
      { key: "ride.board", params: { line: "LRT-2", towards: "Antipolo" }, note: "ride.platformUnknown" },
      { key: "ride.ride", params: { count: 2, station: "Santolan" } },
      { key: "ride.arriveByTrain", params: { station: "Santolan" } },
    ]);
  });

  it("words a Transfer with the other Line, and the Stored Value Ticket", () => {
    const words = steps("lrt1-carriedo", "mrt3-ayala", "stored-value").map(stepText);
    expect(words[1]).toEqual({ key: "ride.payStored", params: { line: "LRT-1", fare: "₱27" } });
    expect(words[4]).toEqual({
      key: "ride.transferByTrain",
      params: { from: "EDSA", to: "Taft Avenue", line: "MRT-3" },
      note: "ride.walkUnknown",
    });
  });

  it("words walks that start or end on foot", () => {
    const words = steps("lrt1-doroteo-jose", "lrt2-recto").map(stepText);
    expect(words).toEqual([
      { key: "ride.transferOnFoot", params: { from: "Doroteo Jose", to: "Recto", line: "LRT-2" }, note: "ride.walkUnknown" },
      { key: "ride.arriveOnFoot", params: { station: "Recto" } },
    ]);
  });
});
