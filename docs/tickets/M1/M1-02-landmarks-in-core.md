# M1-02: Landmarks in core

Spec: [M1](../../specs/M1.md) · Depends on: none

## What
Move the website's landmark lists for LRT-1, LRT-2 and MRT-3 into `packages/core`, keyed by Station id, text unchanged, with `lastVerified: null`. Map the website's old names to ids (e.g. "Roosevelt" → `lrt1-fernando-poe-jr`, the same position in Line order). PNR landmarks are skipped (learn-only Line).

## Acceptance criteria
- `landmarksAt(stationId)` returns the website's strings for that Station, in order.
- A test parses the website's landmark page and checks every LRT-1, LRT-2 and MRT-3 entry is carried over; it fails on an unmapped Station name.
- No landmark text is edited.

## Demo
Test output.
