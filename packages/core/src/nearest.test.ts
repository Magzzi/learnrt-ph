import { describe, expect, it } from "vitest";
import { findNearestStations } from "./nearest";

// Expected ids and distances were computed independently (spherical law of cosines).
const doroteoJose = { lat: 14.605672210615777, lng: 120.98209203896776 };
const northTriangle = { lat: 14.655349121875837, lng: 121.03092905246072 };

const summary = (results: ReturnType<typeof findNearestStations>) =>
  results.map((r) => [r.station.id, Number(r.distanceKm.toFixed(4))]);

describe("findNearestStations", () => {
  it("returns the three closest Stations, nearest first", () => {
    expect(summary(findNearestStations(doroteoJose))).toEqual([
      ["lrt1-doroteo-jose", 0],
      ["lrt2-recto", 0.2374],
      ["lrt1-bambang", 0.6421],
    ]);
  });

  it("respects the limit", () => {
    expect(findNearestStations(doroteoJose, { limit: 1 })).toHaveLength(1);
    expect(findNearestStations(doroteoJose, { limit: 5 })).toHaveLength(5);
  });

  it("leaves out Stations on coming-soon Lines by default", () => {
    expect(summary(findNearestStations(northTriangle))).toEqual([
      ["mrt3-north-ave", 0.3657],
      ["lrt1-fernando-poe-jr", 1.0867],
      ["mrt3-quezon-ave", 1.5833],
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
