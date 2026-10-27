# M0-03: Lines and Stations dataset

Spec: [M0](../../specs/M0.md) · Depends on: M0-02

## What
Types `Line`, `Station`, `LineStatus`, and the dataset for LRT-1 (25), LRT-2 (13), MRT-3 (13) as `operational` and MRT-7 (14) as `coming-soon`. Order comes from the fare matrix headers; coordinates come from `findnearest.ts`. Stable ids, display names as in the fare matrices (pending data-todo D6), and `source`/`lastVerified: null` metadata.

## Acceptance criteria
- Tests: Station counts per Line; ids are unique; every Station has finite coordinates; Line order matches the fare matrix header order; the two Santolan and two Cubao Stations have different ids.
- No coordinate or name is changed from the repo values (D6, D7 and D8 stay open).

## Demo
Test output, plus a one-line script printing each Line with its Station count.
