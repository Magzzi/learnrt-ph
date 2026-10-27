import { describe, expect, it } from "vitest";
import { comingSoonLines, learnData, lineAreas } from "./learn";
import { readWebsiteLines } from "./test-support/websiteLines";

describe("learn content", () => {
  const website = readWebsiteLines();
  const fromWebsite = (name: string) => website.find((l) => l.name === name)!;

  it.each([
    ["LRT1", "LRT-1"],
    ["LRT2", "LRT-2"],
    ["MRT3", "MRT-3"],
  ] as const)("carries over %s's areas from the website unchanged", (lineId, name) => {
    expect(lineAreas(lineId)).toEqual(fromWebsite(name).areas);
  });

  it("lists the Coming Soon Lines named in PRD §6, in order", () => {
    expect(comingSoonLines.map((l) => l.name)).toEqual(["MRT-7", "Metro Manila Subway", "NSCR", "PNR"]);
  });

  it("uses core's MRT-7 Stations, and the website's lists for NSCR and PNR", () => {
    const byName = Object.fromEntries(comingSoonLines.map((l) => [l.name, l]));
    expect(byName["MRT-7"]!.stationNames).toHaveLength(14);
    expect(byName["NSCR"]!.stationNames).toEqual(fromWebsite("NSCR").stations);
    expect(byName["PNR"]!.stationNames).toEqual(fromWebsite("PNR").stations);
  });

  it("shows no Station list where the repo has none", () => {
    expect(comingSoonLines.find((l) => l.name === "Metro Manila Subway")!.stationNames).toEqual([]);
  });

  it("marks the content as not yet verified", () => {
    expect(learnData.lastVerified).toBeNull();
  });
});
