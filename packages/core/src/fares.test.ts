import { describe, expect, it } from "vitest";
import { FARE_TABLES } from "./data/fares";
import { fareData, getFare, type FareQuery } from "./fares";
import { stations } from "./network";
import { FARE_MATRIX_FILES, matrixStationId, readFareMatrix } from "./test-support/fareMatrixFiles";

// Expected fares are literals read from the original .xlsx files, using the
// website's lookup (origin column, destination row).
const fare = (q: Partial<FareQuery> & Pick<FareQuery, "line" | "from" | "to">) =>
  getFare({ ticket: "single-journey", discounted: false, ...q });

describe("fare tables", () => {
  it.each(FARE_MATRIX_FILES)("%s converts without losing a cell", (file) => {
    const table = Object.values(FARE_TABLES).find((t) => t.sourceFile === file);
    expect(table, file).toBeDefined();
    const rows = readFareMatrix(file);
    const names = rows[0]!.slice(1);

    expect(table!.stationIds).toEqual(names.map((name) => matrixStationId(table!.lineId, name as string, stations)));
    expect(rows.slice(1, names.length + 1).map((row) => row[0])).toEqual(names);
    names.forEach((_, r) =>
      names.forEach((_, c) => {
        const cell = rows[r + 1]?.[c + 1];
        expect(table!.fares[r]![c], `${file} row ${r} col ${c}`).toBe(typeof cell === "number" ? cell : null);
      }),
    );
  });

  it("marks the fares as not yet verified", () => {
    expect(fareData.lastVerified).toBeNull();
  });
});

describe("getFare", () => {
  it("looks up a regular single-journey fare", () => {
    expect(fare({ line: "LRT1", from: "lrt1-baclaran", to: "lrt1-monumento" })).toBe(40);
    expect(fare({ line: "LRT2", from: "lrt2-recto", to: "lrt2-antipolo" })).toBe(35);
    expect(fare({ line: "MRT3", from: "mrt3-north-ave", to: "mrt3-taft-ave" })).toBe(28);
  });

  it("looks up a regular stored-value fare", () => {
    expect(fare({ line: "LRT1", from: "lrt1-baclaran", to: "lrt1-monumento", ticket: "stored-value" })).toBe(37);
    expect(fare({ line: "LRT2", from: "lrt2-recto", to: "lrt2-antipolo", ticket: "stored-value" })).toBe(33);
  });

  it("halves a discounted LRT single-journey fare, rounding up", () => {
    expect(fare({ line: "LRT1", from: "lrt1-baclaran", to: "lrt1-monumento", discounted: true })).toBe(20);
    expect(fare({ line: "LRT2", from: "lrt2-recto", to: "lrt2-gilmore", discounted: true })).toBe(13);
  });

  it("gives no discount on an LRT stored-value fare", () => {
    expect(
      fare({ line: "LRT1", from: "lrt1-baclaran", to: "lrt1-monumento", ticket: "stored-value", discounted: true }),
    ).toBe(37);
  });

  it("uses the MRT-3 discounted table for a discounted single-journey fare", () => {
    expect(fare({ line: "MRT3", from: "mrt3-north-ave", to: "mrt3-taft-ave", discounted: true })).toBe(14);
  });

  it("uses the MRT-3 regular table for stored-value, discounted or not", () => {
    expect(fare({ line: "MRT3", from: "mrt3-north-ave", to: "mrt3-taft-ave", ticket: "stored-value" })).toBe(28);
    expect(
      fare({ line: "MRT3", from: "mrt3-north-ave", to: "mrt3-taft-ave", ticket: "stored-value", discounted: true }),
    ).toBe(28);
  });

  it("keeps the source tables' direction (data-todo D2, D3)", () => {
    expect(fare({ line: "LRT1", from: "lrt1-edsa", to: "lrt1-mia-road" })).toBe(25);
    expect(fare({ line: "LRT1", from: "lrt1-mia-road", to: "lrt1-edsa" })).toBe(20);
    expect(fare({ line: "MRT3", from: "mrt3-north-ave", to: "mrt3-boni", discounted: true })).toBe(10);
    expect(fare({ line: "MRT3", from: "mrt3-boni", to: "mrt3-north-ave", discounted: true })).toBe(12);
  });

  it("has no single-journey fare to the same Station", () => {
    expect(fare({ line: "LRT1", from: "lrt1-edsa", to: "lrt1-edsa" })).toBeNull();
  });

  it("returns the table's same-Station stored-value fare (data-todo D5)", () => {
    expect(fare({ line: "LRT1", from: "lrt1-edsa", to: "lrt1-edsa", ticket: "stored-value" })).toBe(16);
    expect(fare({ line: "LRT2", from: "lrt2-cubao", to: "lrt2-cubao", ticket: "stored-value" })).toBe(13);
  });

  it("returns null for an unknown Station, a Station on another Line, or a Line without fares", () => {
    expect(fare({ line: "LRT1", from: "lrt1-nowhere", to: "lrt1-edsa" })).toBeNull();
    expect(fare({ line: "LRT1", from: "lrt1-doroteo-jose", to: "lrt2-recto" })).toBeNull();
    expect(fare({ line: "MRT7", from: "mrt7-tala", to: "mrt7-batasan" })).toBeNull();
  });
});
