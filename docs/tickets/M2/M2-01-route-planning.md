# M2-01: Route planning in core

Spec: [M2](../../specs/M2.md) · Depends on: owner decision D-M2-1

## What
`planRoute(origin, destination)` in `packages/core`, test first: legs (Line, Stations in riding order, stops, direction Station) joined by Transfers, over operational Lines only. Applies the route choice from D-M2-1 and returns the alternative when there is one.

## Acceptance criteria
- Same Line: one leg, correct direction both ways (e.g. LRT-1 Doroteo Jose → Carriedo is towards Dr. Santos).
- Cross-Line: LRT-1 → MRT-3 uses EDSA–Taft Avenue; LRT-2 → MRT-3 uses Cubao; LRT-1 → LRT-2 uses Doroteo Jose–Recto.
- Loop case: Monumento → North Avenue returns the D-M2-1 choice and its alternative.
- Origin = destination: no route. Doroteo Jose → Recto: walk only. MRT-7 Stations are rejected.
