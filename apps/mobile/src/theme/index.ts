import { vars } from "nativewind";
import { useColorScheme } from "react-native";
import type { LineId } from "@learnrt/core";
import { ROLES, THEMES } from "./tokens";

export type ThemeName = keyof typeof THEMES;
export type Theme = (typeof THEMES)[ThemeName];

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");

// One set of CSS variables per theme, for the classes in tailwind.config.js.
const VARIABLES = Object.fromEntries(
  (Object.keys(THEMES) as ThemeName[]).map((name) => [
    name,
    vars(Object.fromEntries(ROLES.map((role: string) => [`--color-${role}`, rgb(THEMES[name][role as keyof Theme] as string)]))),
  ]),
) as Record<ThemeName, ReturnType<typeof vars>>;

/** The theme that follows the phone's light or dark setting. */
export function useThemeName(): ThemeName {
  return useColorScheme() === "dark" ? "dark" : "light";
}

/** Colours for code that cannot use classes (SVG, icons, navigation options). */
export function useTheme(): Theme {
  return THEMES[useThemeName()];
}

/** Style for the root view: the CSS variables of the current theme. */
export function useThemeVariables() {
  return VARIABLES[useThemeName()];
}

export function useLineColor(): (lineId: LineId) => string {
  const theme = useTheme();
  return (lineId) => theme.lines[lineId];
}
