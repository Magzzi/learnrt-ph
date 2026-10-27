import { describe, expect, it } from "vitest";
import { landmarkData, landmarksAt } from "./landmarks";
import { stations } from "./network";
import { readWebsiteLandmarks, websiteLandmarkStationId } from "./test-support/websiteLandmarks";

describe("landmarks", () => {
  const website = readWebsiteLandmarks();

  it("carries over every LRT-1, LRT-2 and MRT-3 landmark list from the website, unchanged", () => {
    let checked = 0;
    for (const line of website.filter((l) => l.name !== "PNR")) {
      for (const [stationName, landmarks] of Object.entries(line.stations)) {
        const id = websiteLandmarkStationId(line.name, stationName, stations);
        expect(id, `${line.name} ${stationName}`).toBeDefined();
        expect(landmarksAt(id!), id).toEqual(landmarks);
        checked++;
      }
    }
    expect(checked).toBe(51);
  });

  it("knows the website's old name for Fernando Poe Jr.", () => {
    expect(landmarksAt("lrt1-fernando-poe-jr")).toEqual(["Waltermart Muñoz", "Lourdes School of Quezon City"]);
  });

  it("returns no landmarks for an unknown Station or one without any", () => {
    expect(landmarksAt("lrt1-nowhere")).toEqual([]);
    expect(landmarksAt("mrt7-tala")).toEqual([]);
  });

  it("marks landmarks as not yet verified", () => {
    expect(landmarkData.lastVerified).toBeNull();
  });
});
