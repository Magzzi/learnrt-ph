import { describe, expect, it } from "vitest";
import { centerOn, zoomAbout } from "./view";

describe("map view maths", () => {
  it("zooms about a point, keeping that point still on screen", () => {
    const view = { scale: 1, x: 0, y: 0 };
    const next = zoomAbout(view, 2, { x: 100, y: 50 }, { min: 1, max: 8 });
    expect(next.scale).toBe(2);
    // The content point under (100, 50) is still under it: (100 - x) / scale = 100.
    expect((100 - next.x) / next.scale).toBeCloseTo(100);
    expect((50 - next.y) / next.scale).toBeCloseTo(50);
  });

  it("keeps the scale within its limits", () => {
    expect(zoomAbout({ scale: 7, x: 0, y: 0 }, 2, { x: 0, y: 0 }, { min: 1, max: 8 }).scale).toBe(8);
    expect(zoomAbout({ scale: 1, x: 0, y: 0 }, 0.5, { x: 0, y: 0 }, { min: 1, max: 8 }).scale).toBe(1);
  });

  it("centres a content point in the viewport at the current scale", () => {
    const next = centerOn({ scale: 2, x: 0, y: 0 }, { x: 30, y: 40 }, { width: 200, height: 100 });
    expect(next).toEqual({ scale: 2, x: 100 - 60, y: 50 - 80 });
  });
});
