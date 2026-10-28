import { describe, expect, it } from "vitest";
import { stationsOnLine } from "@learnrt/core";
import { filterStations, searchStations } from "./search";

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

describe("filterStations", () => {
  const lrt1 = stationsOnLine("LRT1");

  it("keeps every Station when nothing is typed", () => {
    expect(filterStations(lrt1, "  ")).toEqual(lrt1);
  });

  it("matches without accents or case, names that start with the query first", () => {
    const names = filterStations(lrt1, "BA").map((s) => s.name);
    expect(names).toContain("Abad Santos");
    expect(names[0]!.toLowerCase().startsWith("ba")).toBe(true);
    expect(names.indexOf("Abad Santos")).toBeGreaterThan(names.findLastIndex((n) => n.toLowerCase().startsWith("ba")));
  });

  it("returns nothing for a name that is not there", () => {
    expect(filterStations(lrt1, "zzzz")).toEqual([]);
  });
});
