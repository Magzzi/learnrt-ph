import { describe, expect, it } from "vitest";
import { contrastRatio, cvdDistance } from "./contrast";
import { THEMES } from "./tokens";

// WCAG 2.x AA (owner, 2026-10-28): 4.5:1 for normal text, 3:1 for large text, icons and graphics,
// in both themes. Values are never lowered to fit a colour.
const TEXT = 4.5;
const GRAPHIC = 3;

const textPairs = [
  ["ink", "page"],
  ["ink", "card"],
  ["ink", "sunken"],
  ["ink", "accentSoft"],
  ["muted", "page"],
  ["muted", "card"],
  ["muted", "sunken"],
  ["accentInk", "page"],
  ["accentInk", "card"],
  ["accentInk", "accentSoft"],
  ["onAccent", "accent"],
  ["warn", "warnSoft"],
  ["mapLabel", "mapBg"],
] as const;

const graphicPairs = [
  ["accent", "page"],
  ["accent", "card"],
  ["muted", "card"], // inactive tab icons
] as const;

describe.each(Object.entries(THEMES))("%s theme", (_name, theme) => {
  it.each(textPairs)("text %s on %s meets 4.5:1", (fg, bg) => {
    expect(contrastRatio(theme[fg], theme[bg])).toBeGreaterThanOrEqual(TEXT);
  });

  it.each(graphicPairs)("%s on %s meets 3:1", (fg, bg) => {
    expect(contrastRatio(theme[fg], theme[bg])).toBeGreaterThanOrEqual(GRAPHIC);
  });

  it("draws every Line at 3:1 or more against the map and cards", () => {
    for (const color of Object.values(theme.lines)) {
      expect(contrastRatio(color, theme.mapBg)).toBeGreaterThanOrEqual(GRAPHIC);
      expect(contrastRatio(color, theme.card)).toBeGreaterThanOrEqual(GRAPHIC);
    }
  });

  it("keeps every Line colour and the accent apart, also for colour-blind riders", () => {
    // Smallest CIE76 colour difference between any two of them, with normal vision and simulated
    // protanopia, deuteranopia and tritanopia (Machado et al. 2009, full severity).
    const colors = [...Object.values(theme.lines), theme.accent];
    let min = Infinity;
    for (let i = 0; i < colors.length; i++)
      for (let j = i + 1; j < colors.length; j++) min = Math.min(min, cvdDistance(colors[i]!, colors[j]!));
    expect(min).toBeGreaterThanOrEqual(15);
  });
});

describe("contrastRatio", () => {
  it("matches WCAG's worked values", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
    // #767676 on white is the classic 4.54:1 grey.
    expect(contrastRatio("#767676", "#FFFFFF")).toBeCloseTo(4.54, 2);
  });
});
