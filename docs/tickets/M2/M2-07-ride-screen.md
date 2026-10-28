# M2-07: Ride screen in the foreground

Spec: [M2](../../specs/M2.md) · Depends on: M2-04, M2-06

## What
The ride screen: current step, Stations ahead, stops left, "I'm at ___" (route Stations only), End ride. The ride state is saved on the device and restored on launch.

## Acceptance criteria
- "I'm at ___" moves the ride forward and back; Arrive completes it.
- Killing and reopening the app returns to the ride at the same step.
- Works in airplane mode with no location permission at all.
