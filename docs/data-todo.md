# Data to verify

Data the app uses that has not been verified against a source the owner has approved. Nothing here may be "fixed" by guessing; each item needs an approved source first.

| # | Item | Current value / where | Problem | Needed |
|---|---|---|---|---|
| D1 | All fares | `apps/web/public/*.xlsx` | Unknown date or source of the matrices | Owner will supply official fare tables (D1–D4). Shown as Unverified until then |
| D2 | LRT-1 SJT MIA Road ↔ EDSA | `LRT1-sjt-matrix.xlsx` | Asymmetric (as the website reads it): EDSA → MIA Road ₱25, MIA Road → EDSA ₱20 | Correct value |
| D3 | MRT-3 discounted SJT | `MRT3-discounted-matrix.xlsx` | Asymmetric in 3 pairs: ₱10 North Ave → Boni, GMA-Kamuning → Buendia, Cubao → Ayala, but ₱12 in the reverse direction; also does not line up with the regular table's fare bands | Correct table |
| D4 | Discount rules | `src/utils/FareMatrix.ts` | LRT-1/2 discounted SJT = ceil(50%); discounted SVF = no discount on all Lines; MRT-3 SVF uses the SJT table | Official discount rules (PRD §9) |
| D5 | SVF same-Station fare | LRT-1 SVF diagonal 16, LRT-2 SVF diagonal 13 | Unclear whether this is a real fare (entry and exit at the same Station) | Confirm |
| D6 | Station display names | matrices vs `findnearest.ts` vs `explore` page | Three spellings per Station (e.g. "North Ave" / "North Avenue", "UN Avenue" / "United Nations", "Marikina" / "Marikina - Pasig", "Fernando Poe Jr." / "Roosevelt") | Proposal in [station-names-proposal.md](station-names-proposal.md), awaiting owner approval |
| D7 | LRT-2 Santolan coordinates | `findnearest.ts` (14.60808, 121.05641) | Almost identical to MRT-3 Santolan; the LRT-2 Station of that name is a different place | Source approved: OSM. Fix scheduled in M1 (OSM: 14.622108, 121.085964) |
| D8 | All Station coordinates | `findnearest.ts` | Unknown source | Source approved: OSM, with attribution. Replaced in M1 |
| D9 | Cavite extension Stations open | Fares exist for all five | PRD §9 says to verify which are open | Official status per Station |
| D10 | Transfer walking details | none | No walking time, distance or route for Doroteo Jose–Recto, EDSA–Taft Ave, Cubao–Cubao | Curated walkthroughs (PRD §9) |
| D11 | Operating hours | `explore` page: LRT-1 4:30–22:30, MRT-3 4:30–21:30, LRT-2 5:00–21:30 | Weekends and holidays unknown; source unknown | Official hours |
| D12 | Headways | none | Needed for Headway Estimate (F9) | Published headways per Line and time of day |
| D13 | MRT-7 Stations | `findnearest.ts` | Under construction. The `explore` page lists 10 different Stations (e.g. "UP Diliman", "SM Fairview") from `findnearest.ts`'s 14; OSM has 11 of the 14 (missing Quezon Memorial Circle, Tala, San Jose del Monte) | Confirm Station list; not blocking |
| D14 | Landmarks | website `landmark` page | Unknown source; some entries look doubtful (e.g. "UST via LRT-2 walkway" at Tayuman) | Review; shown as Unverified |
| D15 | Entrances, exits, platform per direction, elevators | none | No data at all | Curated data (PRD §9); app shows "Not available yet" |

D9–D13: not blocking M1 (owner, 2026-10-28).
