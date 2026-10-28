import { describe, expect, it } from "vitest";
import { boundsAround, googleMapsWalkingUrl } from "./directions";

describe("googleMapsWalkingUrl", () => {
  it("sends only the Station's position, as the destination, and asks for walking", () => {
    const url = new URL(googleMapsWalkingUrl({ lat: 14.6042, lng: 120.9822 }));
    expect(url.origin + url.pathname).toBe("https://www.google.com/maps/dir/");
    expect(url.searchParams.get("destination")).toBe("14.6042,120.9822");
    expect(url.searchParams.get("travelmode")).toBe("walking");
    expect(url.searchParams.has("origin")).toBe(false);
  });
});

describe("boundsAround", () => {
  it("is the south-west and north-east corners of the points, as [lng, lat]", () => {
    expect(
      boundsAround([
        [121.0, 14.5],
        [120.9, 14.7],
        [121.1, 14.6],
      ]),
    ).toEqual([120.9, 14.5, 121.1, 14.7]);
  });
});
