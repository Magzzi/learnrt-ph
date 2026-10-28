export type ThemePreference = "system" | "light" | "dark";
export const THEME_PREFERENCES: readonly ThemePreference[] = ["system", "light", "dark"];

/** The saved choice; anything missing or unknown follows the phone. */
export function parseThemePreference(value: string | null): ThemePreference {
  return (THEME_PREFERENCES as readonly (string | null)[]).includes(value) ? (value as ThemePreference) : "system";
}
