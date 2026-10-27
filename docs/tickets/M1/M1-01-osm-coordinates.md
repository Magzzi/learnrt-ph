# M1-01: Station coordinates from OpenStreetMap

Spec: [M1](../../specs/M1.md) · Depends on: none

## What
Replace Station coordinates in `packages/core` with OSM positions (approved for D7, D8). Record each Station's OSM element id, and add ODbL attribution to the network metadata. MRT-7 Stations missing from OSM keep their repo coordinates with `osmId: null`. A checked-in script records the Overpass query and regenerates the data, and the OSM extract is committed so tests run offline.

## Acceptance criteria
- Every LRT-1, LRT-2 and MRT-3 Station has an `osmId`, and its coordinates equal the committed OSM extract.
- LRT-2 Santolan is more than 2 km from MRT-3 Santolan (D7 regression test).
- `networkData.source` names OpenStreetMap with "© OpenStreetMap contributors, ODbL".
- Nearest Station tests are updated to the new positions, with expected values recomputed independently.
- data-todo D7 and D8 are marked resolved (source: OSM, date).

## Demo
Test output, and the D7 test.
