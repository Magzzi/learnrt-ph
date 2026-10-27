# M1-05: Schematic Line map

Spec: [M1](../../specs/M1.md) · Depends on: M1-03, M1-04

## What
The Map tab: an SVG schematic of LRT-1, LRT-2 and MRT-3 built from core data, with Transfers joined and MRT-7 dashed and labelled Coming Soon. Pan and pinch-zoom. Tapping a Station navigates to `/station/[id]` (a stub screen until M1-06). The layout logic (Station → x,y) is a pure function with tests.

## Acceptance criteria
- Every Station on the four Lines is drawn exactly once and is tappable, with an accessible label "<Station>, <Line>".
- Transfer Stations are visually joined.
- A layout test checks there are no overlapping Station positions and Line order is preserved.

## Demo
Tap Doroteo Jose on the map; the stub detail screen opens.
