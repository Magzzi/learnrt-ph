# M0-01: pnpm workspace; move the website to `apps/web`

Spec: [M0](../../specs/M0.md) · Depends on: none

## What
Create a pnpm workspace at the root and move the current Next.js site (src, public, configs) into `apps/web` with `git mv`, so history is kept. Add the root scripts `test` and `typecheck`. Update CLAUDE.md commands.

## Acceptance criteria
- `pnpm install` at the root succeeds; one root lockfile.
- `pnpm --filter web build` succeeds with routes `/`, `/explore`, `/trip`, `/landmark`, `/route`, `/stations`.
- `pnpm --filter web dev` serves the site exactly as before.
- No page, `.xlsx` file or dependency is deleted.
- The lint result is reported as-is (it may already fail because of `next lint` removal in Next 16).

## Demo
`pnpm --filter web dev` and open `/trip`; a fare still calculates.

## Notes
pnpm is not installed on this machine. It needs `npm i -g pnpm` (a local tool install).
