# M1-06: Station detail

Spec: [M1](../../specs/M1.md) · Depends on: M1-02, M1-05

## What
`/station/[id]`: name, Line, Line Status, tappable neighbours, Transfers ("Walking directions not available yet"), landmarks, "Not available yet" for entrances, platforms and elevators, Unverified labels, and a "Fares from here" action.

## Acceptance criteria
- Doroteo Jose shows neighbours Carriedo and Bambang, and a Transfer to Recto (LRT-2).
- An unknown id shows a not-found message, not a crash.
- Same-named Stations show their Line in the title.

## Demo
Map → Cubao (LRT-2) → Transfer → Cubao (MRT-3).
