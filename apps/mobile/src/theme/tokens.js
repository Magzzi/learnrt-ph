// Colour roles for both themes (UI1). The only place colours are defined: Tailwind classes
// (`bg-card`, `text-ink`…) read them as CSS variables, and code reads them through `useTheme()`.
// Checked by tokens.test.ts against WCAG AA and for colour-blind riders.
// Line colours are LearnRT's own, not the operators' brand colours (PRD §11, data-todo D22).

/** @typedef {{ page: string, card: string, edge: string, sunken: string, ink: string, muted: string, accent: string, onAccent: string, accentInk: string, accentSoft: string, warn: string, warnSoft: string, caution: string, onCaution: string, mapBg: string, mapLabel: string, lines: { LRT1: string, LRT2: string, MRT3: string, MRT7: string } }} Theme */

/** @type {{ light: Theme, dark: Theme }} */
const THEMES = {
  light: {
    page: "#FBF7F3", // warm off-white
    card: "#FFFFFF",
    edge: "#EAE2DA", // card borders and dividers
    sunken: "#F4EEE8", // fields and chips
    ink: "#1C1917",
    muted: "#57534E",
    accent: "#C84520", // buttons, active tab, switches; the mockup's #E4572E is too light for white text
    onAccent: "#FFFFFF",
    accentInk: "#B93D17", // orange text and links
    accentSoft: "#FDEBE3",
    warn: "#92400E",
    warnSoft: "#FEF3C7",
    caution: "#FCD34D", // the yellow warning icon
    onCaution: "#422006",
    mapBg: "#F5F0EA",
    mapLabel: "#44403C",
    lines: { LRT1: "#059669", LRT2: "#A855F7", MRT3: "#1E3A8A", MRT7: "#4A2C17" },
  },
  dark: {
    page: "#171310",
    card: "#221C18",
    edge: "#3A302A",
    sunken: "#2C251F",
    ink: "#F5F0EB",
    muted: "#B8AFA6",
    accent: "#E4572E",
    onAccent: "#1C1917",
    accentInk: "#FF8A5C",
    accentSoft: "#3A221A",
    warn: "#FCD34D",
    warnSoft: "#3B2A0A",
    caution: "#FCD34D",
    onCaution: "#1C1917",
    mapBg: "#1C1714",
    mapLabel: "#D6D3D1",
    lines: { LRT1: "#86EFAC", LRT2: "#C084FC", MRT3: "#2563EB", MRT7: "#C4956A" },
  },
};

/** Role names that become Tailwind colours (everything except the Line colours). */
const ROLES = Object.keys(THEMES.light).filter((k) => k !== "lines");

module.exports = { THEMES, ROLES };
