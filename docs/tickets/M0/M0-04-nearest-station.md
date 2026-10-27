# M0-04: Nearest Station

Spec: [M0](../../specs/M0.md) · Depends on: M0-03

## What
`findNearestStations(point, { limit = 3, statuses = ["operational"] })` on top of `distanceKm` and the dataset. Test-first.

## Acceptance criteria
- Results sorted ascending by `distanceKm`; default limit 3.
- A point at a Station's own coordinates returns that Station first with distance 0.
- MRT-7 Stations are excluded by default and included when `statuses` asks for `coming-soon`.
- A point far outside Metro Manila still returns results (no cut-off).

## Demo
Test output.
