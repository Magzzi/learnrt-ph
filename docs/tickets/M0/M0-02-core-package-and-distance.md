# M0-02: `packages/core` with Vitest, and `distanceKm`

Spec: [M0](../../specs/M0.md) · Depends on: M0-01

## What
Scaffold `@learnrt/core` (TypeScript, ESM, Vitest, no runtime deps). Implement `distanceKm(a, b)` (Haversine, R = 6371 km) test-first.

## Acceptance criteria
- `pnpm --filter @learnrt/core test` runs Vitest and passes.
- `pnpm -r typecheck` covers core.
- Tests: identical points → 0; symmetric; a known pair (two repo Stations) within 1 m of an independently computed value.
- `packages/core` imports nothing from React, Next.js, Node-only APIs or `fetch`.

## Demo
`pnpm --filter @learnrt/core test` output.
