# M1-10: Device demo checklist

Spec: [M1](../../specs/M1.md) · Depends on: M1-01 to M1-09, M1-11

## What
`docs/tickets/M1/demo-checklist.md`: the steps from each ticket's Demo, run on a device in airplane mode, in English and in Filipino, at 1.3× font scale on a small screen. Claude runs it on the local Android emulator (API 36, AVD `learnrt_api36`) with Expo Go. If the emulator cannot run, it goes to the owner as a short numbered list for Expo Go on a phone. Each step is recorded as pass or fail.

## Acceptance criteria
- Every step has a recorded result; failures become fix tickets before M1 closes.
