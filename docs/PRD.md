# LearnRT Mobile: Product Requirements

Status: draft for review. Vocabulary is defined in [GLOSSARY.md](../GLOSSARY.md); the reasons behind the big technical choices are in [docs/adr](./adr).

## 1. Problem

LearnRT began as a Next.js website about the Philippine rail network. It never became useful: station coordinates, landmarks and operating hours are hardcoded, "open/closed" only compares the device clock to fixed hours, and fares are read from `.xlsx` files in the browser. Nothing changes with real conditions, and anyone could rebuild it in a weekend.

## 2. Goal

A publicly released Android and iOS app, for **first-time riders and daily commuters**, where people learn the system by riding it and see what is happening on the network right now. This is a full move to mobile (ADR 0005).

### Non-goals

- A rider-facing website or web version of the app.
- Buses, jeepneys or the EDSA Carousel.
- Ticket purchase, Beep card top-up or any payment to operators.
- Official partnership with, or branding of, LRMC, LRTA or DOTr.

## 3. Constraint

LRT-1, LRT-2 and MRT-3 publish no real-time train data (ADR 0004). Live information has to come from riders, from the published schedule, and from curated official notices.

## 4. Differentiators

1. **Guided Ride** with background alerts, across Transfers.
2. **Rider Reports** with location checks, confirmations and reputation.
3. **Delay Signals** from opt-in anonymous Segment Timings.
4. A **curated station dataset** (entrances, platforms, Transfer walkthroughs) that improves through rider edits.
5. Guided Ride instructions in **English and Filipino**.

## 5. Users

| User | Need |
|---|---|
| First-time rider (tourist, provincial visitor, new student or worker) | Know exactly what to do, step by step, without asking strangers |
| Daily commuter | Know whether today's ride will be slow, and get warned early |
| Admin (the project owner) | Publish Advisories, moderate reports and edits, fix station data |

Riders arrive as learners and stay as commuters.

## 6. Scope

**Fully supported:** LRT-1 (including the open Cavite extension Stations), LRT-2 (including the east extension), MRT-3, with Transfers between them.
**Learn-only "Not in LearnRT yet" cards:** MRT-7, Metro Manila Subway, NSCR, PNR (Lines LearnRT does not cover; "Coming Soon" is reserved for the Line Status of a Line that has not opened, and PNR is running). Line Status is data, so promoting a Line needs no app release.

## 7. Features

### F1. Schematic line map (home)
- Interactive diagram of all Lines, drawn offline.
- Tap a Station for its detail page; live Rider Report badges appear on Stations.
- Street-level map (MapLibre with OpenStreetMap tiles) for entrances, landmarks and walking to a Station.

### F2. Station detail
- Entrances and exits, platform per direction, elevators, nearby landmarks, current Rider Reports, active Advisories.

### F3. Fare calculator
- Origin and destination, ticket type (single journey, stored value), discounted or regular. Fare data comes from tables, not `.xlsx` files.

### F4. Nearest Station
- Device location to the closest Stations, with distance. Works offline.

### F5. Guided Ride
- Pick origin and destination, including across Lines. The app shows the fare and the steps: which entrance, how to pay, which platform and direction, how many stops, where and how to Transfer, when to alight.
- Background geofences on each Station along the route advance the steps and fire notifications with the screen locked (ADR 0006). An ongoing notification on Android shows stops remaining; the iOS Live Activity comes in M6.
- Manual "I'm at ___" fallback when GPS drifts, for example underground.
- Works fully offline.

### F6. Rider Reports
- Signed-in riders report crowding, delays, queues, broken escalators or elevators at a Station or Line.
- Accepted only when the rider is near the Station. Rate-limited.
- Other riders mark "still true" or "not anymore". Reports expire automatically. Reporters earn a reputation score.
- Reports made offline are queued and sent later.

### F7. Advisories
- Official notices curated by an admin, shown on the Line, Station and a feed.
- Riders can follow Lines; publishing an Advisory sends a push notification to followers.

### F8. Delay Signals (opt-in)
- Guided Ride can upload anonymous Segment Timings (no user ID, no full trip).
- The backend compares recent timings with the baseline for that segment and time of day and raises "slower than usual".

### F9. Headway Estimate
- Approximate next-train wait from the published schedule, labelled as an estimate.

### F10. Learn content
- Line and Station background, "Not in LearnRT yet" cards, tips for first-timers.

### F11. Station edits
- Signed-in riders can suggest corrections to Station data; the admin moderates them.

### F12. Admin (in-app, role-gated)
- Publish Advisories, moderate flagged Rider Reports and suggested edits, edit Station, Transfer and fare data.

### F13. Language
- English and Filipino throughout; Station names stay official.

### F14. Plus (paid, about ₱49/month)
- Saved Commutes with proactive alerts, home and lock-screen widgets, ride history and stats, offline street-map tiles, themes.
- Everything about safety, disruptions and learning stays free.

## 8. Account and trust model

- Browsing and Guided Ride need no account.
- Posting a Rider Report, confirming one, or suggesting an edit needs Google or Apple sign-in.
- Admin is a profile role enforced by row-level security, not only by hiding screens.

## 9. Data

- **Source of truth:** Supabase Postgres with PostGIS. **On device:** SQLite snapshot, refreshed when online (ADR 0003).
- **Station data** is seeded from OpenStreetMap (attribution required, ODbL), then platforms and Transfers are curated by hand, starting with Doroteo Jose to Recto, EDSA to Taft, and Araneta-Cubao.
- **Core tables:** lines, stations, entrances, transfers, fares, landmarks, rider reports, report votes, profiles, advisories, segment timings.
- The existing `.xlsx` fare matrices and the coordinates in `src/app/route/findnearest.ts` are the starting data to migrate.
- **To verify before building on them:** current fares and discount rules (the code assumes 50% off single-journey tickets), operating hours including weekends and holidays, which Cavite extension Stations are open, published headways.

## 10. Technical approach

| Layer | Choice |
|---|---|
| Mobile | Expo (React Native), TypeScript, Expo Router, NativeWind, EAS Build/Submit/Update |
| Offline data | expo-sqlite snapshot with delta sync |
| Location and alerts | expo-location, expo-task-manager (background geofences), expo-notifications |
| Maps | react-native-svg schematic; MapLibre RN with OSM tiles |
| Backend | Supabase: Postgres and PostGIS, Auth (Google, Apple), Realtime, RLS, pg_cron, Edge Functions |
| Website | Existing Next.js on Vercel, marketing only |
| Shared logic | `packages/core` (route graph, Transfer pathfinding, fares, distance, Headway Estimate), tested with Vitest |
| Payments | RevenueCat |
| i18n | i18next, expo-localization |
| Ops | Sentry, product analytics |

**Repository:** pnpm monorepo with `apps/mobile`, `apps/web`, `packages/core`, `supabase/`.

**Website** keeps only: download links, about the project, gallery or showreel, privacy policy, OSM attribution. The explore, trip, route, landmark and stations pages, xlsx parsing, and unused dependencies (MUI, `@react-google-maps/api`) are removed.

## 11. Launch requirements

- Privacy policy and a background-location justification for both stores.
- Sign in with Apple (required because Google sign-in is offered).
- Sentry crash reporting and basic analytics.
- Visible "unofficial, not affiliated with LRMC, LRTA or DOTr" disclaimer; no operator logos.
- Apple Developer ($99/year) and Google Play ($25 one-time) accounts.
- OSM attribution in the app and on the site.
- Filipino strings reviewed by the owner and a native speaker (every string is marked "needs review" until then).

## 12. Milestones

Each is a vertical slice that can be demoed.

| | Milestone | Outcome |
|---|---|---|
| M0 | Restructure | Monorepo; distance and fare logic extracted into `packages/core` with tests; Station graph and Transfers modelled |
| M1 | Offline core app | Expo app with schematic map, Station detail, fares, Nearest Station, learn cards, English and Filipino |
| M2 | Guided Ride | Cross-Line route planning, step screens, background geofences, notifications, manual fallback; street-level map (F1) as the last, cuttable ticket |
| M3 | Live layer | Supabase schema and RLS, Auth, Rider Reports with Realtime and expiry, offline queue, SQLite sync |
| M4 | Admin and Advisories | In-app admin, Advisory publishing with push to followers, moderation, data editor, OSM import |
| M4b | Marketing site | `apps/web` reduced to the pages in section 10 |
| M5 | Delay Signals | Opt-in Segment Timing upload, baselines, "slower than usual" signals |
| M6 | Plus and launch | RevenueCat, Saved Commutes, widgets, iOS Live Activity for Guided Ride, Sentry, listings, store submission |

## 13. Success measures (to be set)

Suggested starting points, to be confirmed by the owner:
- Share of new users who complete a Guided Ride in their first week.
- Rider Reports per active day, and the share confirmed by a second rider.
- Weekly active riders after 4 weeks (commuter retention).
- Plus conversion.

## 14. Open risks

- **Cold start:** Rider Reports are useless with few users. Guided Ride and offline tools must stand on their own before the live layer matters.
- **Background location:** both stores scrutinise it; the justification and in-app explanation need care.
- **Data accuracy:** wrong fares or platform directions erode trust quickly; every dataset needs a visible "last verified" date.
- **Operator relations:** an unofficial app using operator names could draw objections; keep the disclaimer and avoid logos.
- **Moderation load:** one admin cannot review unlimited reports; confirmation and reputation must do most of the filtering.
- **Guided Ride alert timing:** alerts depend on Android geofences through Google Play services, which need Location Accuracy on and may arrive late in the background (ADR 0006). Not yet tested on a real train; "I'm at ___" is the fallback.
- **Street map tiles:** the street-level map uses OpenFreeMap, a free public tile service with no availability guarantee. The tile URL is a single config value so the app can switch providers or self-host.
- **Passive timing privacy:** must stay opt-in, anonymous and without full trips, and be described plainly in the privacy policy.
