# M0-06: Station graph and Transfers

Spec: [M0](../../specs/M0.md) · Depends on: M0-03

## What
A `Transfer` type, the three Transfers (Doroteo Jose ↔ Recto, EDSA ↔ Taft Ave, LRT-2 Cubao ↔ MRT-3 Cubao) with empty walking details, and a graph API: `neighbours(stationId)` on the same Line and `transfersFrom(stationId)`. Test-first. No pathfinding (M2).

## Acceptance criteria
- End Stations have one neighbour, middle Stations two.
- Transfers are bidirectional.
- A breadth-first test reaches every operational Station from any operational Station; MRT-7 is unreachable.

## Demo
Test output.
