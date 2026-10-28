import { describe, expect, it } from "vitest";
import { streetMap } from "./streetMap";

describe("streetMap", () => {
  it("centres on the Station and lists its OSM entrances, Unverified", () => {
    const map = streetMap("lrt1-edsa")!;
    expect(map.station).toMatchObject({ name: "EDSA", line: "LRT-1" });
    expect(map.center).toEqual([map.station.location.lng, map.station.location.lat]);
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
