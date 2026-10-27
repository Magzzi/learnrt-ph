# M1-08: Nearest Station screen

Spec: [M1](../../specs/M1.md) · Depends on: M1-04

## What
The Nearest tab: an explanation, then a foreground location request (expo-location), then the three nearest Stations from `findNearestStations` with formatted distance, each linking to Station detail. Denied or unavailable location → explanation plus a "Open map" button. Distance formatting is a pure, tested function.

## Acceptance criteria
- Formatting: 240 m → "240 m", 1.25 km → "1.3 km" (and the Filipino equivalents).
- No network request is made by this screen.
- Denied permission never crashes, and can be retried from settings.

## Demo
On a phone in airplane mode with location on.
