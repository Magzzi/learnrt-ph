import { describe, expect, it } from "vitest";
import { formatDistance } from "./formatDistance";

describe("formatDistance", () => {
  it.each([
    [0.24, "240 m"],
    [0.0422, "40 m"],
    [0, "0 m"],
    [1.25, "1.3 km"],
    [12.04, "12.0 km"],
    // 999.6 m rounds up to a whole kilometre, so it is written in km, not "1000 m".
    [0.9996, "1.0 km"],
  ])("%f km → %s", (km, text) => {
    expect(formatDistance(km)).toBe(text);
  });
});
