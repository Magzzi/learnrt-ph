# M2-05: Development build

Spec: [M2](../../specs/M2.md) · Depends on: none (local build decided 2026-10-28)

## What
Add `expo-dev-client`, `expo-task-manager`, `expo-notifications` with `npx expo install`; config plugins and permission texts in `app.json` (background location, notifications). Produce an Android development build locally with `npx expo run:android` (EAS waits until M6) and run the existing app on the emulator from it. Update CLAUDE.md with the new way to run the app.

## Acceptance criteria
- Before any download, the exact size is reported to the owner; free disk stays at or above 10 GB afterwards, checked during the build.
- The M1 app runs unchanged from the development build on the emulator.
- `expo-doctor` passes; `expo export` for Android and iOS succeeds.
- No generated `android/` or `ios/` folder is committed (CNG).
