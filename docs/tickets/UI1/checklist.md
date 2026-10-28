# UI1 verification checklist

Run on 2026-10-28 by Claude on the local Android emulator (AVD `learnrt_api36`, API 36), development build `dev.learnrt.app`, Metro over `adb reverse`. Branch `ui-redesign`.

| # | Check | Result |
|---|---|---|
| 1 | `pnpm test`: core 126 passed, app 109 passed | Pass |
| 2 | `pnpm typecheck` (web, core, mobile) | Pass |
| 3 | `expo lint`: 0 errors (4 warnings from earlier milestones, `import/no-named-as-default-member`) | Pass |
| 4 | `expo-doctor`: 20/20 checks | Pass |
| 5 | `expo export` for Android and iOS | Pass |
| 6 | Contrast test: every text role pair ≥ 4.5:1, graphics ≥ 3:1, in light and dark (`tokens.test.ts`); Line colours ≥ 3:1 against map and card, and colour-blind simulation distance ΔE ≥ 15 between every pair of Lines (smallest 25.6) | Pass |
| 7 | No raw colours or light-only/dark-only classes outside `src/theme`, `WelcomeArt` and the licence text (`grep`) | Pass |
| 8 | Light theme screenshots: Map, Fares, Ride (both route cards), Guided Ride, Nearest, Learn, About, Station detail | Pass |
| 9 | Dark theme (`cmd uimode night yes`): Map (welcome card, controls, legend, tip, tab bar) follows the phone with no restart | Pass |
| 10 | Map tab: zoom in, "Find a station" ("dona" finds Doña Carmen, opens Station detail) | Pass |
| 11 | Ride planner, Yamaha Monumento → North Avenue: both route cards, Line icons, walking legs, Unverified chips, "Start Guided Ride" with icon | Pass |
| 12 | 360 dp (density 480) at 1.3× font, English: Map, Guided Ride, About | Pass after fix (see below) |
| 13 | 360 dp at 1.3× font, Filipino: Map, Ride planner | Pass after fix (see below) |
| 14 | Airplane mode, app restarted: Guided Ride screen renders with Fraunces headings and Filipino text. Fraunces and the illustration are bundled (font in the export's assets, illustration is inline SVG); Metro still served the JavaScript over `adb reverse`, so a fully standalone offline start is only proven for assets, not for the dev bundle | Pass, with that limit |
| 15 | Locked-screen Guided Ride across a Transfer, Filipino (Pedro Gil → Magallanes, `gps-playback.ts` at 25 s per hop, screen asleep throughout). Alerts seen in the notification list, in order: "Bumaba sa susunod na istasyon / Susunod: EDSA", "Bumaba na: EDSA", "Susunod: Magallanes", "Bumaba na: Magallanes"; the ongoing notification counted down from "6 hinto pa bago Magallanes" to "1 hinto". Same behaviour as M2 step 6; only the restyle changed | Pass |

| 16 | Preview PNG for the owner, light and dark side by side (Map and Ride planner, 2 × 2), sent with the milestone report | Done |

Dark theme was screenshotted for the Map and Ride planner only; the other screens use the same roles and components (checked by the contrast test and the raw-colour grep), but were not screenshotted in dark. 360 dp at 1.3× was checked in light only.

## Found and fixed

- At 1.3× font the Map tab had no room for the map (welcome card took half the screen), the tab labels were clipped, and in Filipino the map card title wrapped letter by letter beside the search button. Now: the welcome card and tip bar shrink to a title at enlarged text, the card header stacks, and tab labels keep a fixed size.
- `Card` ignored overriding `bg-` and `gap-` classes (NativeWind does not resolve clashes), so the highlighted ride card stayed white; `Card` now lets a passed class replace its default.
- Review: the contrast test lacked three pairs the UI uses (`muted` on `accentSoft` and on `mapBg`, `warn` on `card`); added. A font load failure left a blank screen; it now carries on with the system font. The Line leg icon was a rounded square; now round. `app.json` background is tied to the theme by a test.
- Lint: map controls were a render-time helper reading a ref; now a component.

## Not verified

- iOS: not built or run.
- The Map tab with 1.3× text leaves the legend covering a quarter of the map; it can be panned away from, but is large.
