import { describe, expect, it } from "vitest";
import { getLine, getStation, lines, networkData, stations, stationsOnLine } from "./network";
import { readMatrixStationNames } from "./test-support/fareMatrixFiles";

describe("network", () => {
  it("has the operational Lines and MRT-7 as coming soon", () => {
    expect(lines.map((l) => [l.id, l.status])).toEqual([
      ["LRT1", "operational"],
      ["LRT2", "operational"],
      ["MRT3", "operational"],
      ["MRT7", "coming-soon"],
    ]);
  });

  it.each([
    ["LRT1", 25],
    ["LRT2", 13],
    ["MRT3", 13],
    ["MRT7", 14],
  ] as const)("%s has %i Stations", (lineId, count) => {
    expect(stationsOnLine(lineId)).toHaveLength(count);
  });

  it.each([
    ["LRT1", "LRT1-sjt-matrix.xlsx"],
    ["LRT2", "LRT2-sjt-matrix.xlsx"],
    ["MRT3", "MRT3-matrix.xlsx"],
  ] as const)("%s Station order matches the fare matrix header", (lineId, file) => {
    expect(stationsOnLine(lineId).map((s) => s.name)).toEqual(readMatrixStationNames(file));
  });

  it("gives every Station a unique id", () => {
    const ids = stations.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every Station finite coordinates", () => {
    for (const s of stations) {
      expect(Number.isFinite(s.location.lat), s.id).toBe(true);
      expect(Number.isFinite(s.location.lng), s.id).toBe(true);
    }
  });

  it("keeps same-named Stations on different Lines apart", () => {
    expect(getStation("lrt2-santolan")?.lineId).toBe("LRT2");
    expect(getStation("mrt3-santolan")?.lineId).toBe("MRT3");
    expect(getStation("lrt2-cubao")?.lineId).toBe("LRT2");
    expect(getStation("mrt3-cubao")?.lineId).toBe("MRT3");
  });

  it("returns undefined for an unknown Station or Line", () => {
    expect(getStation("lrt1-nowhere")).toBeUndefined();
    expect(getLine("PNR" as never)).toBeUndefined();
  });

  it("marks the data as not yet verified", () => {
    expect(networkData.lastVerified).toBeNull();
  });
});
