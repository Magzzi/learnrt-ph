# Maintenance to do

Temporary workarounds in the repo, each with the date or condition that lets us remove it.

| # | Item | Where | Why it exists | Remove when |
|---|---|---|---|---|
| T1 | `minimumReleaseAgeExclude` list (14 exact versions: `expo`, `expo-router`, `@expo/cli`, `expo-dev-client` and other Expo SDK 58 packages) | `pnpm-workspace.yaml` | `npx expo install` in M1 and M2 needed Expo releases published on 2026-10-27, inside pnpm's 24-hour waiting period for new versions | On or after 2026-10-29: delete the list and its comment, run `pnpm install`, and check the lockfile does not change |
| T2 | App identifier `dev.learnrt.app` | `apps/mobile/app.json` (`android.package`, `ios.bundleIdentifier`) | Needed for the M2 development build; chosen as a placeholder | Before the first store submission (M6): the owner picks the final identifier, which cannot change after publishing |
