# M2-02: Route Fare in core

Spec: [M2](../../specs/M2.md) · Depends on: M2-01

## What
`routeFare(route, ticket, discounted)`: one `getFare` result per leg plus the total, test first.

## Acceptance criteria
- Per-leg Fares match `getFare` for each leg's origin and destination.
- Any leg without a Fare makes the total unknown (null), never a partial sum.
- A walk-only route has no legs and a total of 0 with no Fare lines (rendered as "No Fare").
