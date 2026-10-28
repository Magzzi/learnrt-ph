# M2-08: Background geofences and notifications

Spec: [M2](../../specs/M2.md) · Depends on: M2-05, M2-07

## What
Permission explanation screen, then foreground and background location and notification permissions. A top-level geofencing task feeds `arrivedAt` into the saved ride state, re-registers regions, and posts the "next Station", "get off now" and "walk to" notifications. Android ongoing notification "N stops to ___", updated and removed at the end.

## Acceptance criteria
- With the screen locked on the emulator, injected positions advance the ride and fire each notification once.
- Refused background location or notifications: the ride still works in the foreground and says alerts are off, with a link to settings.
- Ending the ride stops geofencing and removes the ongoing notification.
