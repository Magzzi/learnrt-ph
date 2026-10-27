import { describe, expect, it } from "vitest";
import extract from "../data-sources/osm-stations.json";
import { distanceKm } from "./distance";
import { getLine, getStation, networkData, stations } from "./network";

const byOsmId = new Map(extract.elements.map((e) => [e.osmId, e]));

describe("Station coordinates from OpenStreetMap", () => {
  it("gives every Station on an operational Line an OSM element and its exact position", () => {
    for (const s of stations.filter((s) => getLine(s.lineId)?.status === "operational")) {
      const element = s.osmId ? byOsmId.get(s.osmId) : undefined;
      expect(element, s.id).toBeDefined();
      expect(s.location, s.id).toEqual({ lat: element!.lat, lng: element!.lng });
    }
  });

  it("takes MRT-7 positions from OSM where OSM has the Station", () => {
    for (const s of stations.filter((s) => s.lineId === "MRT7" && s.osmId)) {
      const element = byOsmId.get(s.osmId!);
      expect(s.location, s.id).toEqual({ lat: element!.lat, lng: element!.lng });
    }
  });

  it("never maps two Stations to the same OSM element", () => {
    const ids = stations.flatMap((s) => (s.osmId ? [s.osmId] : []));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("puts LRT-2 Santolan well away from MRT-3 Santolan (data-todo D7)", () => {
    expect(distanceKm(getStation("lrt2-santolan")!.location, getStation("mrt3-santolan")!.location)).toBeGreaterThan(2);
  });

  it("credits OpenStreetMap", () => {
    expect(networkData.attribution).toBe("© OpenStreetMap contributors, ODbL");
    expect(networkData.osmBase).toBe(extract.osmBase);
  });
});
