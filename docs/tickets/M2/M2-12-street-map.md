# M2-12: Street-level map (cuttable)

Spec: [M2](../../specs/M2.md) · Depends on: M2-05, M2-11

## What
From Station detail, a MapLibre React Native street map centred on the Station, with the rider's position and the Station's OSM entrances (Unverified). Tiles from OpenFreeMap through one config value (the style URL); never OpenStreetMap's own tile servers.

## Acceptance criteria
- Map loads online; offline it says the street map needs a connection and the rest of the app still works.
- © OpenStreetMap contributors and OpenFreeMap attribution are visible on the map screen.
- A Station with no OSM entrances shows none.
- Changing the one config value switches the tile provider.
- Cut to a later milestone if M2 runs long (owner, 2026-10-28).
