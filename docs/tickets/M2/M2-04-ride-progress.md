# M2-04: Ride progress and geofence regions in core

Spec: [M2](../../specs/M2.md) · Depends on: M2-03

## What
A pure state machine (`start`, `arrivedAt`, `imAt`, `end`) and `geofenceRegions(progress)`, test first. Serialisable state so the app can save and restore it.

## Acceptance criteria
- GPS arrival ahead on the route jumps forward; behind or off-route is ignored. "I'm at" moves anywhere on the route.
- Alerts "next Station" and "get off now" are due once each at the right Stations (before and at a Transfer or the destination).
- Stops left on the leg and the whole ride; arrival at the destination completes.
- Regions: at most 20, only Stations ahead, radius 150 m or half the distance to the nearest other Station (EDSA and Taft Avenue: 192 m apart → 96 m).
