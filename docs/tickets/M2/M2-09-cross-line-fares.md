# M2-09: Cross-Line Fares tab

Spec: [M2](../../specs/M2.md) · Depends on: M2-02

## What
The Fares tab accepts origin and destination on different Lines and shows per-leg Fares and the total from `routeFare`. Same-Line behaviour unchanged.

## Acceptance criteria
- Doroteo Jose (LRT-1) → Cubao (MRT-3) shows one Fare per Line and the total, Unverified.
- An unknown leg Fare shows the total as unknown.
