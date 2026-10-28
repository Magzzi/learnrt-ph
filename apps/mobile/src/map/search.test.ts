import { describe, expect, it } from "vitest";
import { searchStations } from "./search";

const ids = (q: string) => searchStations(q).map((s) => s.id);

describe("searchStations", () => {
  it("ignores accents and case", () => {
    expect(ids("dona")).toEqual(["mrt7-dona-carmen"]);
    expect(ids("DOÑA")).toEqual(["mrt7-dona-carmen"]);
  });

  it("finds same-named Stations on every Line, names that start with the query first", () => {
    expect(ids("cubao")).toEqual(["mrt3-cubao", "lrt2-cubao"]);
    expect(ids("santolan")).toEqual(["lrt2-santolan", "mrt3-santolan"]);
  });

  it("matches inside names too", () => {
    expect(ids("monumento")).toContain("lrt1-monumento");
  });

  it("returns nothing for blank or unknown queries", () => {
    expect(ids("   ")).toEqual([]);
    expect(ids("zzz")).toEqual([]);
  });
});
