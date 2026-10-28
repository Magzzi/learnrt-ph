# M2-11: Station entrances from OpenStreetMap (cuttable)

Spec: [M2](../../specs/M2.md) · Depends on: none

## What
Extend the OSM extract script in `packages/core` to fetch entrance points (`railway=subway_entrance` and `entrance` nodes) belonging to or near each operational Station, commit the extract, and expose `entrancesAt(stationId)` with OSM attribution and `lastVerified: null`. Test first.

## Acceptance criteria
- Each entrance records its OSM id and position; Stations without one in OSM return an empty list (nothing guessed).
- The extract records its OSM timestamp, as for Station positions.
- data-todo D15 says which Stations have OSM entrances and that they are Unverified.
