# M1-07: Fares screen

Spec: [M1](../../specs/M1.md) · Depends on: M1-04

## What
The Fares tab: Line, origin, destination, Single Journey or Stored Value Ticket, Discounted Fare toggle. The result comes from `getFare`, with an Unverified label. It accepts an origin parameter from Station detail.

## Acceptance criteria
- Baclaran → Monumento, Single Journey, regular shows ₱40; with Discounted Fare, ₱20.
- The same Station on a Single Journey Ticket shows "No fare" text, not ₱0.
- Changing Line clears origin and destination.

## Demo
The two Baclaran → Monumento cases above.
