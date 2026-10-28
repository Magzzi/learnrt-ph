# UI1-01: Colour roles, light and dark

Spec: [UI1](../../specs/UI1.md) · Depends on: UI1-D2, UI1-D3

## What
Named colour roles for light and dark (NativeWind CSS variables), following the phone's setting; `app.json` to automatic; Line colours with light and dark shades, MRT-7 recoloured. A Vitest test checks WCAG AA contrast for every text/background pair in both themes.

## Acceptance criteria
- Switching the phone between light and dark restyles the running app.
- Contrast test passes for both themes.
