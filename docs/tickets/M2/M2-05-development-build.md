# M2-05: Development build

Spec: [M2](../../specs/M2.md) · Depends on: owner decision D-M2-2

## What
Add `expo-dev-client`, `expo-task-manager`, `expo-notifications` with `npx expo install`; config plugins and permission texts in `app.json` (background location, notifications). Produce an Android development build (local `npx expo run:android` or EAS, per D-M2-2) and run the existing app on the emulator from it. Update CLAUDE.md with the new way to run the app.

## Acceptance criteria
- The M1 app runs unchanged from the development build on the emulator.
- `expo-doctor` passes; `expo export` for Android and iOS succeeds.
- No generated `android/` or `ios/` folder is committed (CNG).
