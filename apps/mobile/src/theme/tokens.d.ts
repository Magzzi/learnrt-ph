interface Theme {
  page: string;
  card: string;
  edge: string;
  sunken: string;
  ink: string;
  muted: string;
  accent: string;
  onAccent: string;
  accentInk: string;
  accentSoft: string;
  warn: string;
  warnSoft: string;
  mapBg: string;
  mapLabel: string;
  lines: { LRT1: string; LRT2: string; MRT3: string; MRT7: string };
}
export const THEMES: { light: Theme; dark: Theme };
export const ROLES: string[];
