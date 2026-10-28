# M2-03: Guided Ride steps in core

Spec: [M2](../../specs/M2.md) · Depends on: M2-02

## What
`rideSteps(route, ticket, discounted)`: Enter, Pay, Board, Ride, Transfer, Arrive steps as data (Station ids, Line ids, numbers, Fare, and `unknown` flags for entrance, platform and walking details), test first.

## Acceptance criteria
- Same-Line ride: Enter, Pay, Board, Ride, Arrive.
- One Transfer: Enter, Pay, Board, Ride, Transfer, Pay, Board, Ride, Arrive.
- Entrance, platform and walk are flagged unknown (D10, D15), never filled in.
