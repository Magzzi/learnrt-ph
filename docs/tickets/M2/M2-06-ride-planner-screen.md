# M2-06: Ride tab (planner)

Spec: [M2](../../specs/M2.md) · Depends on: M2-03

## What
Fifth tab **Ride**: origin and destination pickers across Lines, ticket and Discounted Fare, route summary (legs, Transfers, stops, per-leg Fares and total, Unverified), the alternative, and Start. The routes are labelled "Fewest Transfers" and "Fewer stops", with the note "Estimated, no travel times". Station detail gains "Ride from here" / "Ride to here". English and Filipino (needs review).

## Acceptance criteria
- Monumento → North Avenue shows the chosen route and its alternative.
- Same Station: says there is no route. Walk-only Transfer pair: shows the walk.
- No clipped text at 360 dp and 1.3× font, five tabs included.
