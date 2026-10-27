# M1-11: Approved Station names

Spec: [M1](../../specs/M1.md) · Depends on: M1-01

## What
Apply the approved display names from `docs/station-names-proposal.md` (OSM spellings, plain hyphens, sponsor names kept). Ids stay exactly as they are. The fare converter gets an explicit fare-matrix-name → Station id mapping, so it keeps working with the old spellings in the `.xlsx` files.

## Acceptance criteria
- A test pins the full list of 65 Station ids; it passes before and after the rename.
- Display names match the proposal's "Proposed" column for all 51 operational Stations.
- `pnpm --filter @learnrt/core convert-fares` regenerates identical fare data (same ids, same values).
- The round-trip fare test still checks every `.xlsx` cell.

## Demo
Test output, plus `git diff` of `src/data/fares.ts` after reconversion showing no change.
