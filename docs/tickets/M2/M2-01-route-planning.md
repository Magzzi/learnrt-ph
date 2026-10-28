# M2-01: Route planning in core

Spec: [M2](../../specs/M2.md) · Depends on: none (route choice decided 2026-10-28)

## What
`planRoute(origin, destination)` in `packages/core`, test first: legs (Line, Stations in riding order, stops, direction Station) joined by Transfers, over operational Lines only. Returns the route with the fewest Transfers, plus the route with fewer stops as an alternative when one exists. Each route says which kind it is (fewest Transfers or fewer stops).

## Acceptance criteria
- Same Line: one leg, correct direction both ways (e.g. LRT-1 Doroteo Jose → Carriedo is towards Dr. Santos).
- Cross-Line: LRT-1 → MRT-3 uses EDSA–Taft Avenue; LRT-2 → MRT-3 uses Cubao; LRT-1 → LRT-2 uses Doroteo Jose–Recto.
- Loop case: Monumento → North Avenue returns 28 stops with one Transfer (EDSA–Taft Avenue) as the default, and 17 stops with two Transfers (via LRT-2) as the alternative.
- Origin = destination: no route. Doroteo Jose → Recto: walk only. MRT-7 Stations are rejected.
