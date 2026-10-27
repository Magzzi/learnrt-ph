# M1 device demo checklist

Run on 2026-10-28 by Claude on the local Android emulator (AVD `learnrt_api36`, Android 16 / API 36, Expo Go, SDK 58), Metro on the dev machine reached over `adb reverse`. Airplane mode was on for every step marked ✈. Location was injected with Android's test provider (`cmd location providers set-test-provider-location`), because the emulator's own GPS (`geo fix`) delivered no fixes.

| # | Step | Result |
|---|---|---|
| 1 | ✈ Cold start: app opens on the Map, framed on LRT-1, LRT-2 and MRT-3; MRT-7 dashed; legend shows "MRT-7 · Coming Soon" | Pass |
| 2 | ✈ Tap Doroteo Jose on the map → Station detail "Doroteo Jose · LRT-1", neighbours Carriedo and Bambang, Transfer to Recto (LRT-2) with "Walking directions not available yet", landmarks, facilities "Not available yet", Unverified badges | Pass |
| 3 | ✈ Tap "Walk to Recto (LRT-2)" → Recto · LRT-2 | Pass |
| 4 | Tap MRT-3 Cubao and LRT-2 Araneta Center-Cubao on the map (≈370 m apart) → each opens its own Station | Pass |
| 5 | Unknown Station id (deep link `/station/lrt1-nowhere`) → "Station not found", no crash | Pass |
| 6 | ✈ Fares: LRT-1, Baclaran → Yamaha Monumento, Single Journey → ₱40; Discounted Fare → ₱20; Stored Value + discounted → ₱37; To = Baclaran → "No fare for this trip" | Pass (after making the whole Discounted Fare row tappable) |
| 7 | Recto → "Fares from here" → Fares opens on LRT-2 with From = Recto | Pass |
| 8 | ✈ Nearest, location near Doroteo Jose → Doroteo Jose 40 m, Recto 280 m, Bambang 610 m (independently computed values) | Pass |
| 9 | Nearest with location permission denied → explanation, "Open Settings", "Open map"; "Open map" goes to the Map | Pass |
| 10 | Learn → Line cards with areas (Unverified), Coming Soon cards (MRT-7 14 Stations, Subway "No Station list yet", NSCR, PNR), tips → About: disclaimer naming LRMC, LRTA and DOTr, OSM/ODbL credit; the link opens the browser | Pass |
| 11 | Switch to Filipino in About → all tabs and screens in Filipino; choice survives an app restart | Pass |
| 12 | ✈ Filipino at 360 dp width and 1.3× font: Map, Fares, Nearest, Station detail, Learn, About — no clipped text | Pass after fix: the Nearest tab label "Pinakamalapit" was truncated, shortened to "Malapit" |
| 13 | Pinch-zoom on the Map | **Not verified**: adb cannot send multi-touch. Pan and tap verified. Owner to check on a phone |

## Known limitations (not failures)
- At the default zoom some map labels overlap where Stations are very close (Doroteo Jose/Recto/Legarda, EDSA/Taft Avenue, around North Avenue). They separate when zoomed in.
- Map labels are SVG text and do not follow the system font size; the rest of the app does.
- Panning the map is not bounded, so it can be dragged off screen.
