import { describe, expect, it } from "vitest";
import { streetMap } from "./streetMap";

describe("streetMap", () => {
  it("centres on the Station and lists its OSM entrances, Unverified", () => {
    const map = streetMap("lrt1-edsa")!;
    expect(map.station).toEqual({ id: "lrt1-edsa", name: "EDSA" });
    expect(map.center).toEqual([121.0006192, 14.5388434]); // EDSA's OSM position, longitude first
    expect(map.entrances).toHaveLength(5);
    expect(map.unverified).toBe(true);
  });

  it("shows no entrances where OSM has none linked", () => {
    expect(streetMap("lrt1-quirino")!.entrances).toEqual([]);
  });

  it("labels an entrance only with its OSM ref or name, never a made-up number", () => {
    // EDSA's five OSM entrances carry neither tag.
    expect(streetMap("lrt1-edsa")!.entrances.map((e) => e.label)).toEqual([null, null, null, null, null]);
  });

  it("has no map for an unknown Station", () => {
    expect(streetMap("lrt1-nowhere")).toBeNull();
  });
});
