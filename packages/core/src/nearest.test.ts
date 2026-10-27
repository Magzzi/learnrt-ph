import { describe, expect, it } from "vitest";
import { getStation } from "./network";
import { findNearestStations } from "./nearest";

// Expected ids and distances were computed independently (spherical law of cosines)
// from the OSM positions. The query points are fixed points near those Stations.
const nearDoroteoJose = { lat: 14.605672210615777, lng: 120.98209203896776 };
const northTriangle = { lat: 14.655349121875837, lng: 121.03092905246072 };

const summary = (results: ReturnType<typeof findNearestStations>) =>
  results.map((r) => [r.station.id, Number(r.distanceKm.toFixed(4))]);

describe("findNearestStations", () => {
  it("returns the three closest Stations, nearest first", () => {
    expect(summary(findNearestStations(nearDoroteoJose))).toEqual([
      ["lrt1-doroteo-jose", 0.0422],
      ["lrt2-recto", 0.2773],
      ["lrt1-bambang", 0.6065],
    ]);
  });

  it("puts a Station first, at 0 km, when standing on it", () => {
    const [first] = findNearestStations(getStation("lrt2-santolan")!.location);
    expect([first?.station.id, first?.distanceKm]).toEqual(["lrt2-santolan", 0]);
  });

  it("respects the limit", () => {
    expect(findNearestStations(nearDoroteoJose, { limit: 1 })).toHaveLength(1);
    expect(findNearestStations(nearDoroteoJose, { limit: 5 })).toHaveLength(5);
  });

  it("leaves out Stations on coming-soon Lines by default", () => {
    expect(summary(findNearestStations(northTriangle))).toEqual([
      ["mrt3-north-ave", 0.3844],
      ["lrt1-fernando-poe-jr", 1.0816],
      ["mrt3-quezon-ave", 1.6433],
    ]);
  });

  it("includes coming-soon Lines when asked", () => {
    const results = findNearestStations(northTriangle, { statuses: ["operational", "coming-soon"] });
    expect(results[0]?.station.id).toBe("mrt7-north-triangle-common-station");
  });

  it("still answers for a point far from Metro Manila", () => {
    expect(findNearestStations({ lat: 10.3157, lng: 123.8854 })).toHaveLength(3);
  });
});
