import { describe, expect, it } from "vitest";
import extract from "../data-sources/osm-entrances.json";
import { distanceKm } from "./distance";
import { entranceData, entrancesAt } from "./entrances";
import { getStation, stations } from "./network";

describe("Station entrances from OpenStreetMap", () => {
  it("gives EDSA its five OSM entrances", () => {
    expect(entrancesAt("lrt1-edsa")).toHaveLength(5);
    for (const e of entrancesAt("lrt1-edsa")) {
      expect(e.osmId).toMatch(/^node\/\d+$/);
      // Within 300 m of the Station's own OSM position.
      expect(distanceKm(e.location, getStation("lrt1-edsa")!.location)).toBeLessThan(0.3);
    }
  });

  it("gives no entrance where OSM links none to the Station, rather than guessing", () => {
    expect(entrancesAt("lrt1-quirino")).toEqual([]);
    expect(entrancesAt("lrt1-nowhere")).toEqual([]);
  });

  it("links an entrance only through an OSM stop area that also holds that Station", () => {
    for (const s of stations) {
      for (const e of entrancesAt(s.id)) {
        const area = extract.stopAreas.find((a) => a.members.includes(e.osmId) && a.members.includes(getStation(s.id)!.osmId!));
        expect(area, `${s.id} ${e.osmId}`).toBeDefined();
      }
    }
  });

  it("is credited to OpenStreetMap and unverified", () => {
    expect(entranceData.attribution).toBe("© OpenStreetMap contributors, ODbL");
    expect(entranceData.osmBase).toBe(extract.osmBase);
    expect(entranceData.lastVerified).toBeNull();
  });
});
