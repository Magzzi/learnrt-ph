# M2-11: Street-level map (cuttable)

Spec: [M2](../../specs/M2.md) · Depends on: M2-05, owner decisions D-M2-4 and D-M2-5

## What
From Station detail, a MapLibre street map centred on the Station with the rider's position, and the Station's entrances if D-M2-5 approves OSM entrance nodes (Unverified). Tiles from the source chosen in D-M2-4, with attribution.

## Acceptance criteria
- Map loads online; offline it says the street map needs a connection and the rest of the app still works.
- Attribution for OSM and the tile source is visible.
- Cut to a later milestone if M2 runs long (owner, 2026-10-28).
