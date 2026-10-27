/// <reference types="node" />
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Nearest Station must work offline (spec M1, F4): no geocoding and no network requests.
const FILES = ["../app/(tabs)/nearest.tsx", "./currentPosition.ts", "./formatDistance.ts"];

describe("Nearest Station makes no network calls", () => {
  it.each(FILES)("%s", (file) => {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    expect(source).not.toMatch(/\bfetch\(|XMLHttpRequest|geocode|nominatim/i);
  });
});
