import { describe, expect, it } from "vitest";
import { faresReducer, formatPesos, initialFaresState, quote } from "./faresState";

const baclaranToMonumento = faresReducer(
  faresReducer(faresReducer(initialFaresState(), { type: "line", line: "LRT1" }), { type: "from", stationId: "lrt1-baclaran" }),
  { type: "to", stationId: "lrt1-monumento" },
);

describe("Fares screen state", () => {
  it("quotes Baclaran → Monumento on a regular Single Journey Ticket at ₱40", () => {
    expect(quote(baclaranToMonumento)).toEqual({ kind: "fare", pesos: 40 });
  });

  it("quotes ₱20 with a Discounted Fare", () => {
    expect(quote(faresReducer(baclaranToMonumento, { type: "discounted", value: true }))).toEqual({
      kind: "fare",
      pesos: 20,
    });
  });

  it("quotes the Stored Value Ticket", () => {
    expect(quote(faresReducer(baclaranToMonumento, { type: "ticket", ticket: "stored-value" }))).toEqual({
      kind: "fare",
      pesos: 37,
    });
  });

  it("says there is no Fare for the same Station on a Single Journey Ticket", () => {
    expect(quote(faresReducer(baclaranToMonumento, { type: "to", stationId: "lrt1-baclaran" }))).toEqual({
      kind: "no-fare",
    });
  });

  it("asks for both Stations until both are chosen", () => {
    expect(quote(initialFaresState())).toEqual({ kind: "incomplete" });
  });

  it("clears origin and destination when the Line changes", () => {
    const changed = faresReducer(baclaranToMonumento, { type: "line", line: "MRT3" });
    expect([changed.line, changed.from, changed.to]).toEqual(["MRT3", null, null]);
  });

  it("starts from a Station when opened from Station detail", () => {
    const state = initialFaresState({ line: "LRT1", from: "lrt1-doroteo-jose" });
    expect([state.line, state.from, state.to]).toEqual(["LRT1", "lrt1-doroteo-jose", null]);
  });

  it("ignores a starting Station that is not on the starting Line, or a Line without Fares", () => {
    expect(initialFaresState({ line: "LRT1", from: "lrt2-recto" }).from).toBeNull();
    expect(initialFaresState({ line: "MRT7", from: "mrt7-tala" }).line).toBe("LRT1");
  });

  it("writes pesos with the peso sign", () => {
    expect(formatPesos(40)).toBe("₱40");
  });
});
