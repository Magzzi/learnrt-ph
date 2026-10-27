import { describe, expect, it } from "vitest";
import { distanceKm } from "./distance";

// Expected values were computed independently with the spherical law of
// cosines (R = 6371 km), not with Haversine.
const baclaran = { lat: 14.534567416074673, lng: 120.99842057227043 };
const monumento = { lat: 14.654517582234087, lng: 120.98384199478873 };

describe("distanceKm", () => {
  it("is 0 for the same point", () => {
    expect(distanceKm(baclaran, baclaran)).toBe(0);
  });

  it("is one degree of arc along the equator", () => {
    expect(distanceKm({ lat: 0, lng: 0 }, { lat: 0, lng: 1 })).toBeCloseTo(111.194927, 5);
  });

  it("measures Baclaran to Monumento to within a metre", () => {
    expect(Math.abs(distanceKm(baclaran, monumento) - 13.429789)).toBeLessThan(0.001);
  });

  it("is the same in both directions", () => {
    expect(distanceKm(monumento, baclaran)).toBe(distanceKm(baclaran, monumento));
  });
});
