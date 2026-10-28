# M2 device demo checklist

Run on 2026-10-28 by Claude on the local Android emulator (AVD `learnrt_api36`, Android 16 / API 36, Google APIs image with Play services), with the Android **development build** (`dev.learnrt.app`, built by `npx expo run:android`) and Metro over `adb reverse`. Positions came from `apps/mobile/scripts/gps-playback.ts`, which moves the GPS test provider from Station to Station (5 points per hop, 45 s per hop). "Locked" means the screen was off (`mWakefulness=Asleep`) and LearnRT was in the background for the whole playback. Notifications were read with `adb shell dumpsys notification` and seen in the shade (screenshot during the run).

The final runs (✔) used commit `e571628`, the last code change of M2-08. Earlier runs found the bugs listed at the end; each was fixed and the affected steps run again.

| # | Step | Result |
|---|---|---|
| 1 | Ride tab, Yamaha Monumento → North Avenue: "Fewest Transfers" (1 Transfer, 28 stops, LRT-1 ₱40 + MRT-3 ₱28 = ₱68) and "Fewer stops" (2 Transfers, 17 stops, ₱25 + ₱25 + ₱16 = ₱66), both "Estimated, no travel times" and Unverified | Pass |
| 2 | Carriedo → Carriedo: "That's the same Station. Choose a different destination." | Pass |
| 3 | Doroteo Jose → Recto: "Walk to Recto (LRT-2)", "No train needed" | Pass |
| 4 | Fares tab, Doroteo Jose (LRT-1) → Cubao (MRT-3): LRT-1 Doroteo Jose → EDSA ₱30, MRT-3 Taft Avenue → Cubao ₱24, total ₱54, Unverified | Pass |
| 5 | Start a ride: explanation card first; "Turn on alerts" → location "While using the app" → settings page "Allow all the time" → notifications "Allow"; ongoing notification "6 stops to Magallanes" appears | Pass |
| 6 | ✔ Locked, Transfer route Pedro Gil → Magallanes: "Get off at the next Station / Next: EDSA", "Get off now: EDSA / Tap out and walk to Taft Avenue (MRT-3).", "Next: Magallanes", "Get off now: Magallanes / Tap out. You've arrived." Each once, in order. Afterwards the ongoing notification is gone and no geofences remain registered | Pass |
| 7 | ✔ Locked, ✈ airplane mode, Filipino, single-Line route Araneta Center-Cubao → Santolan: "Bumaba sa susunod na istasyon / Susunod: Santolan", then "Bumaba na: Santolan / Mag-tap palabas. Nakarating ka na." | Pass |
| 8 | Ongoing notification counts down during a ride ("1 hinto pa bago Magallanes" after EDSA, Filipino run) | Pass |
| 9 | ✔ "I'm at…" forward (Carriedo → Magallanes: "1 stop to Ayala") and back (→ Gil Puyat: "2 stops to EDSA") | Pass |
| 10 | ✔ Kill the app mid-ride and reopen: back on the ride screen at Gil Puyat | Pass |
| 11 | Permissions refused (revoked, then "Don't allow" twice): "Alerts are off…" with "Open Settings"; "I'm at…" still moves the ride | Pass |
| 12 | Location Accuracy turned off in Android settings: the ride screen says alerts need it and offers "Turn on Location Accuracy"; Google's dialog → "Turn on" → "Alerts are on" and geofences registered | Pass |
| 13 | Geofence events with the app open: the screen moves live (Libertad → EDSA showed the Transfer step) | Pass |
| 14 | Back out of the ride screen → Ride tab shows "Continue your Guided Ride to Ayala" → returns to the ride | Pass |
| 15 | End ride: ongoing notification removed, geofences removed | Pass |
| 16 | 360 dp wide (density 480) at 1.3× font, English and Filipino: five tabs fit; planner cards and ride screen wrap without clipping | Pass |
| 17 | Cold start with a ride in progress and with none: no errors in Metro | Pass |

## Bugs found on the device and fixed

- Google Play services silently refused the geofences while Location Accuracy was off (its geofencer was in `DisabledState`), and expo-location does not report that. The ride screen now checks the network provider and offers to turn it on (step 12).
- Starting a ride while the phone sat inside a later Station's area jumped the ride there at once (Android's initial "enter" event). Geofences now leave out areas the phone is already inside.
- The geofence task returned before notifications and geofences were updated, so the app could be frozen mid-update; after arrival the ongoing notification stayed at "1 stop". Updates now run one at a time and the task waits for them.
- Backing out of the ride screen left no way back; a finished ride reopened on every launch; the current ride step showed the whole leg's stops; "Buy a LRT-1 Single Journey Ticket" wording; navigating on launch before the router was ready.
- Metro had been started with `CI=1`, which turns off file watching; the M1 stale-bundle problem had the same cause.

## Not verified

- Alert timing on a real train. On the emulator, alerts arrived up to about 45 s after the position reached a Station, and with 45 s between Stations the "next Station" alert for EDSA arrived almost together with "get off now". Real travel times between Stations are unknown (D12), and Android may delay background geofence events further. This needs a real ride on a phone.
- A ride whose origin is one stop before a Transfer or the destination gets no "next Station" alert, since alerts fire on arrival.
- iOS: not built or run (no Mac, no Apple account).
