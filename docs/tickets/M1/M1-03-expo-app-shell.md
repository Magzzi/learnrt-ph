# M1-03: Expo app shell

Spec: [M1](../../specs/M1.md) · Depends on: none

## What
`apps/mobile`: Expo SDK 58, Expo Router, TypeScript, NativeWind, Metro configured for the pnpm workspace. Four tabs (Map, Fares, Nearest, Learn) with placeholder screens that render data from `@learnrt/core` (e.g. the Station count). Dark theme tokens from the website. A small shared `Unverified` badge component.

## Acceptance criteria
- `pnpm --filter mobile start` opens in Expo Go and shows the four tabs.
- `npx expo-doctor` passes; `npx expo export --platform android --platform ios` succeeds.
- `pnpm typecheck` covers mobile; `pnpm build:web` still succeeds.

## Demo
Expo Go on a phone (owner), plus export and doctor output.
