# Data to verify

Data the app uses that has not been verified against a source the owner has approved. Nothing here may be "fixed" by guessing; each item needs an approved source first.

| # | Item | Current value / where | Problem | Needed |
|---|---|---|---|---|
| D1 | All fares | `apps/web/public/*.xlsx` | Unknown date or source of the matrices | Owner will supply official fare tables (D1–D4). Shown as Unverified until then |
| D2 | LRT-1 SJT MIA Road ↔ EDSA | `LRT1-sjt-matrix.xlsx` | Asymmetric (as the website reads it): EDSA → MIA Road ₱25, MIA Road → EDSA ₱20 | Correct value |
| D3 | MRT-3 discounted SJT | `MRT3-discounted-matrix.xlsx` | Asymmetric in 3 pairs: ₱10 North Ave → Boni, GMA-Kamuning → Buendia, Cubao → Ayala, but ₱12 in the reverse direction; also does not line up with the regular table's fare bands | Correct table |
| D4 | Discount rules | `src/utils/FareMatrix.ts` | LRT-1/2 discounted SJT = ceil(50%); discounted SVF = no discount on all Lines; MRT-3 SVF uses the SJT table | Official discount rules (PRD §9) |
| D5 | SVF same-Station fare | LRT-1 SVF diagonal 16, LRT-2 SVF diagonal 13 | Unclear whether this is a real fare (entry and exit at the same Station) | Confirm |
| D6 | Station display names | matrices vs `findnearest.ts` vs `explore` page | Three spellings per Station (e.g. "North Ave" / "North Avenue", "UN Avenue" / "United Nations", "Marikina" / "Marikina - Pasig", "Fernando Poe Jr." / "Roosevelt") | Resolved 2026-10-28: OSM names approved ([station-names-proposal.md](station-names-proposal.md)), applied in M1. Sponsor names: see D16 |
| D7 | LRT-2 Santolan coordinates | `findnearest.ts` (14.60808, 121.05641) | Almost identical to MRT-3 Santolan; the LRT-2 Station of that name is a different place | Resolved 2026-10-28 (M1-01): OSM `way/30411347`, 14.622108, 121.085964, moved 3.5 km |
| D8 | All Station coordinates | `findnearest.ts` | Unknown source | Resolved 2026-10-28 (M1-01): all 51 operational Stations and 11 of 14 MRT-7 Stations from OSM (extract `packages/core/data-sources/osm-stations.json`); other moves were under 150 m |
| D9 | Cavite extension Stations open | Fares exist for all five | PRD §9 says to verify which are open | Official status per Station |
| D10 | Transfer walking details | none | No walking time, distance or route for Doroteo Jose–Recto, EDSA–Taft Ave, Cubao–Cubao | Curated walkthroughs (PRD §9) |
| D11 | Operating hours | `explore` page: LRT-1 4:30–22:30, MRT-3 4:30–21:30, LRT-2 5:00–21:30 | Weekends and holidays unknown; source unknown | Official hours |
| D12 | Headways | none | Needed for Headway Estimate (F9) | Published headways per Line and time of day |
| D13 | MRT-7 Stations | `findnearest.ts` | Under construction. The `explore` page lists 10 different Stations (e.g. "UP Diliman", "SM Fairview") from `findnearest.ts`'s 14; OSM has 11 of the 14 (missing Quezon Memorial Circle, Tala, San Jose del Monte) | Confirm Station list; not blocking |
| D14 | Landmarks | website `landmark` page | Unknown source; some entries look doubtful (e.g. "UST via LRT-2 walkway" at Tayuman) | Review; shown as Unverified |
| D15 | Entrances, exits, platform per direction, elevators | none | No data at all. Entrances: OSM entrance points approved as a source (owner, 2026-10-28), shown as Unverified on the street map. As of OSM 2026-10-28, 50 entrances at 19 Stations are linked through OSM stop areas (`packages/core/src/data/entrances.ts`); the other Stations show none | Curated data (PRD §9); app shows "Not available yet" |
| D16 | Sponsor Station names | Yamaha Monumento, Araneta Center-Cubao (LRT-2), GMA Kamuning | Taken from OSM; naming-rights names change over time | Check against LRMC, LRTA and MRT-3 official pages |
| D17 | Areas each Line serves | website `explore` page | LRT-1 lists "Cavite" though its southern end is Dr. Santos; MRT-3 lists "North Avenue" as an area; LRT-2 lists only Manila, San Juan, Quezon City although it reaches Antipolo | Correct lists; shown as Unverified |
| D18 | Status of Lines LearnRT does not cover | website `explore` page: PNR "Limited Operations", NSCR "Under Construction"; Metro Manila Subway absent | The app states no status for them. The Learn tab lists them under "Not in LearnRT yet" (owner, 2026-10-28): PNR runs today, so "coming soon" would be wrong for it | Official status per Line before showing one |
| D19 | First-timer tip: the exit gate keeps a Single Journey Ticket | removed from the app (owner, 2026-10-28) | Not checked against an operator source | Confirm per Line with LRMC, LRTA and MRT-3, then restore the sentence in the gates tip |
| D20 | First-timer tip: some Stations have a separate entrance for each direction | removed from the app (owner, 2026-10-28) | Not checked against an operator source; which Stations is unknown (see D15) | Confirm with the operators, then restore as a tip |
| D21 | Direction names | Guided Ride says "towards <last Station>" from core's Line order (M2) | The operators' own platform and direction wording (e.g. "Northbound", "To Baclaran") is unknown | Operator signage wording per Line |
| D22 | Line colours | `apps/mobile/src/theme/tokens.js` | LearnRT's own colours, chosen for contrast and colour-blind riders (UI1); they are not the operators' official Line colours, and the app never claims they are (PRD §11: no operator branding) | None needed; revisit only if an operator asks |

D9–D13: not blocking M1 (owner, 2026-10-28).
