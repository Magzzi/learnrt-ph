import { describe, expect, it } from "vitest";
import { faresReducer, formatPesos, initialFaresState, quote } from "./faresState";

const trip = (from: string, to: string) =>
  faresReducer(faresReducer(initialFaresState(), { type: "from", stationId: from }), { type: "to", stationId: to });
const baclaranToMonumento = trip("lrt1-baclaran", "lrt1-monumento");

describe("Fares screen state", () => {
  it("quotes Baclaran → Monumento on a regular Single Journey Ticket at ₱40", () => {
    expect(quote(baclaranToMonumento)).toEqual({
      kind: "fare",
      total: 40,
      legs: [{ lineId: "LRT1", from: "lrt1-baclaran", to: "lrt1-monumento", fare: 40 }],
    });
  });

  it("quotes ₱20 with a Discounted Fare, and ₱37 on a Stored Value Ticket", () => {
    expect(quote(faresReducer(baclaranToMonumento, { type: "discounted", value: true }))).toMatchObject({ total: 20 });
    expect(quote(faresReducer(baclaranToMonumento, { type: "ticket", ticket: "stored-value" }))).toMatchObject({ total: 37 });
  });

  it("quotes across Lines, one Fare per Line and the total (M2-09)", () => {
    // Doroteo Jose (LRT-1) → Cubao (MRT-3): LRT-1 to EDSA, walk to Taft Avenue, MRT-3 to Cubao.
    const result = quote(trip("lrt1-doroteo-jose", "mrt3-cubao"));
    if (result.kind !== "fare") throw new Error(result.kind);
    expect(result.legs.map((l) => [l.lineId, l.from, l.to])).toEqual([
      ["LRT1", "lrt1-doroteo-jose", "lrt1-edsa"],
      ["MRT3", "mrt3-taft-ave", "mrt3-cubao"],
    ]);
    // ₱30 + ₱24 from the (unverified) fare tables.
    expect(result.legs.map((l) => l.fare)).toEqual([30, 24]);
    expect(result.total).toBe(54);
  });

  it("needs no train between the two Stations of one Transfer", () => {
    expect(quote(trip("lrt1-doroteo-jose", "lrt2-recto"))).toEqual({ kind: "walk-only" });
  });

  it("says there is no Fare for the same Station on a Single Journey Ticket", () => {
    expect(quote(trip("lrt1-baclaran", "lrt1-baclaran"))).toEqual({ kind: "no-fare" });
  });

  it("asks for both Stations until both are chosen", () => {
    expect(quote(initialFaresState())).toEqual({ kind: "incomplete" });
  });

  it("starts from a Station when opened from Station detail, but only on an operational Line", () => {
    expect(initialFaresState({ from: "lrt1-doroteo-jose" }).from).toBe("lrt1-doroteo-jose");
    expect(initialFaresState({ from: "mrt7-quezon-memorial-circle" }).from).toBeNull();
  });

  it("writes pesos with the peso sign", () => {
    expect(formatPesos(40)).toBe("₱40");
  });
});
