# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server at http://localhost:3000
npm run build     # Build for production
npm run start     # Run production build
npm run lint      # Lint with Next.js ESLint config
```

There is no test suite configured for this project.

## Architecture Overview

**LearnRT** is a Next.js 15 (App Router) web app for navigating the Philippine rail network (LRT-1, LRT-2, MRT-3, and upcoming lines). All pages are client components (`"use client"`).

### Pages and their purpose

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Landing/hero with animated image carousel |
| `/explore` | `src/app/explore/page.tsx` | Expandable list of all rail lines with station lists and live open/closed status |
| `/trip` | `src/app/trip/page.tsx` | Fare calculator — select railway, ticket type, origin/destination |
| `/landmark` | `src/app/landmark/page.tsx` | Points of interest grouped by rail line and station |
| `/route` | `src/app/route/page.tsx` | Nearest station finder using geocoding + Haversine distance |
| `/stations` | `src/app/stations/page.tsx` | Placeholder ("coming soon") |

### Key utilities

- **`src/app/route/findnearest.ts`** — Contains the complete hardcoded station coordinate dataset for all lines (LRT-1 including Cavite extension, LRT-2, MRT-3, MRT-7). Exports `findNearestStations(lat, lng)` (Haversine, returns top 3 within 100 km) and `getCoordinates(location)` (Nominatim/OpenStreetMap geocoding).

- **`src/utils/FareMatrix.ts`** — Reads fare from `.xlsx` files in `public/` using the `xlsx` library. File naming convention: `{RAILWAY}-{type}-matrix.xlsx` for LRT-1/LRT-2 (type = `sjt` or `svf`), `MRT3-matrix.xlsx` / `MRT3-discounted-matrix.xlsx` for MRT-3. Discounted SJT for non-MRT3 lines applies 50% multiplier at runtime.

### Fare matrix files (in `public/`)

- `LRT1-sjt-matrix.xlsx`, `LRT1-svf-matrix.xlsx`
- `LRT2-sjt-matrix.xlsx`, `LRT2-svf-matrix.xlsx`
- `MRT3-matrix.xlsx`, `MRT3-discounted-matrix.xlsx`

### Styling conventions

- Dark theme throughout: base background `#0a1a1a`, card/panel `#0d2222`, elevated elements `#1a2e2e`
- Accent color: **emerald** (`emerald-400`/`emerald-500`) for interactive elements; **yellow-500** for the primary CTA button
- Tailwind CSS v4 with `@tailwindcss/postcss`
- Framer Motion used for entrance animations (`opacity`/`y` transitions) on all pages
- Font: Roboto (Google Fonts) via `next/font`

### External dependencies to be aware of

- **`@react-google-maps/api`** — installed but not currently used in active pages; `src/components/ui/map.tsx` uses a plain `<iframe>` Google Maps embed instead
- **`@mui/material`** — installed but not used in any current page
- **Nominatim (OpenStreetMap)** — used for geocoding in the Route Finder; no API key required but subject to usage limits

### `next.config.ts`

Allows `next/image` to load from external domains: `images.unsplash.com`, `developers.google.com`, `img.icons8.com`, `i.postimg.cc`.
