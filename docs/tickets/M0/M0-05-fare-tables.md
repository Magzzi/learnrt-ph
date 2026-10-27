# M0-05: Fare tables and `getFare`

Spec: [M0](../../specs/M0.md) · Depends on: M0-03

## What
A checked-in script (`packages/core/scripts/convert-fares.ts`, a dev-only dependency on `xlsx`) converts the six matrices into typed data keyed by Station id. Implement `getFare(...)` test-first, reproducing the current website's rules.

## Acceptance criteria
- A round-trip test reads every `.xlsx` cell and matches it to the generated data.
- Rule tests: LRT discounted SJT = ceil(50%); LRT discounted SVF = regular SVF; MRT-3 discounted SJT uses the discounted table; MRT-3 SVF uses the regular table; same-Station SJT → `null`; unknown Station or wrong Line → `null`.
- Directional lookup preserved (D2 and D3 asymmetries kept; one test pins D2).
- The generated data includes `source` and `lastVerified: null`.

## Demo
`getFare({ line: "LRT1", from: "lrt1-baclaran", to: "lrt1-monumento", ticket: "single-journey", discounted: false })` in a test, plus full test output.
