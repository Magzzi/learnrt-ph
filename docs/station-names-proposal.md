# Station names (data-todo D6)

Status: **approved by the owner on 2026-10-28, with plain hyphens instead of en dashes and sponsor names kept.** Applied in M1 (ticket M1-11). Sponsor names still need checking against the operators' official pages (data-todo D16).

Rule proposed: use the OpenStreetMap `name` tag as it stood on 2026-10-28 (Overpass query, © OpenStreetMap contributors, ODbL), because OSM is the approved source for Station locations. Ids never change, only display names. Rows marked ✱ are where the proposal differs from today's name. Rows marked † use a sponsor or naming-rights name; say if you would rather drop the sponsor.

## LRT-1
| Id | Current (fare matrix) | Other spellings in repo | OSM name | Proposed |
|---|---|---|---|---|
| lrt1-dr-santos | Dr. Santos | | Dr. Santos | Dr. Santos |
| lrt1-ninoy-aquino-avenue | Ninoy Aquino Avenue | Ninoy Aquino | Ninoy Aquino Avenue | Ninoy Aquino Avenue |
| lrt1-pitx | PITX | | PITX | PITX |
| lrt1-mia-road | MIA Road | MIA (NAIA) | MIA Road | MIA Road |
| lrt1-redemptorist-aseana | Redemptorist-Aseana | Redemptorist | Redemptorist–Aseana | Redemptorist-Aseana |
| lrt1-baclaran | Baclaran | | Baclaran | Baclaran |
| lrt1-edsa | EDSA | | EDSA | EDSA |
| lrt1-libertad | Libertad | | Libertad | Libertad |
| lrt1-gil-puyat | Gil Puyat | | Gil Puyat | Gil Puyat |
| lrt1-vito-cruz | Vito Cruz | | Vito Cruz | Vito Cruz |
| lrt1-quirino | Quirino | | Quirino | Quirino |
| lrt1-pedro-gil | Pedro Gil | | Pedro Gil | Pedro Gil |
| lrt1-un-avenue | UN Avenue | United Nations | United Nations | ✱ United Nations |
| lrt1-central-terminal | Central Terminal | | Central Terminal | Central Terminal |
| lrt1-carriedo | Carriedo | | Carriedo | Carriedo |
| lrt1-doroteo-jose | Doroteo Jose | | Doroteo Jose | Doroteo Jose |
| lrt1-bambang | Bambang | | Bambang | Bambang |
| lrt1-tayuman | Tayuman | | Tayuman | Tayuman |
| lrt1-blumentritt | Blumentritt | | Blumentritt | Blumentritt |
| lrt1-abad-santos | Abad Santos | | Abad Santos | Abad Santos |
| lrt1-r-papa | R. Papa | | R. Papa | R. Papa |
| lrt1-5th-avenue | 5th Avenue | | 5th Avenue | 5th Avenue |
| lrt1-monumento | Monumento | | Yamaha Monumento | ✱† Yamaha Monumento |
| lrt1-balintawak | Balintawak | | Balintawak | Balintawak |
| lrt1-fernando-poe-jr | Fernando Poe Jr. | Roosevelt (old name) | Fernando Poe Jr. | Fernando Poe Jr. |

## LRT-2
| Id | Current | Other spellings in repo | OSM name | Proposed |
|---|---|---|---|---|
| lrt2-recto | Recto | | Recto | Recto |
| lrt2-legarda | Legarda | | Legarda | Legarda |
| lrt2-pureza | Pureza | | Pureza | Pureza |
| lrt2-v-mapa | V. Mapa | | V. Mapa | V. Mapa |
| lrt2-j-ruiz | J. Ruiz | | J. Ruiz | J. Ruiz |
| lrt2-gilmore | Gilmore | | Gilmore | Gilmore |
| lrt2-betty-go-belmonte | Betty Go-Belmonte | | Betty Go-Belmonte | Betty Go-Belmonte |
| lrt2-cubao | Cubao | | Araneta Center - Cubao | ✱† Araneta Center-Cubao |
| lrt2-anonas | Anonas | | Anonas | Anonas |
| lrt2-katipunan | Katipunan | | Katipunan | Katipunan |
| lrt2-santolan | Santolan | | Santolan | Santolan |
| lrt2-marikina | Marikina | Marikina - Pasig | Marikina-Pasig | ✱ Marikina-Pasig |
| lrt2-antipolo | Antipolo | | Antipolo | Antipolo |

## MRT-3
| Id | Current | Other spellings in repo | OSM name | Proposed |
|---|---|---|---|---|
| mrt3-north-ave | North Ave | North Avenue | North Avenue | ✱ North Avenue |
| mrt3-quezon-ave | Quezon Ave | Quezon Avenue | Quezon Avenue | ✱ Quezon Avenue |
| mrt3-gma-kamuning | GMA-Kamuning | Kamuning | GMA Kamuning | ✱† GMA Kamuning |
| mrt3-cubao | Cubao | | Cubao | Cubao |
| mrt3-santolan | Santolan | | Santolan-Annapolis | ✱ Santolan-Annapolis |
| mrt3-ortigas | Ortigas | | Ortigas | Ortigas |
| mrt3-shaw-blvd | Shaw Blvd | Shaw Boulevard | Shaw Boulevard | ✱ Shaw Boulevard |
| mrt3-boni | Boni | | Boni | Boni |
| mrt3-guadalupe | Guadalupe | | Guadalupe | Guadalupe |
| mrt3-buendia | Buendia | | Buendia | Buendia |
| mrt3-ayala | Ayala | | Ayala | Ayala |
| mrt3-magallanes | Magallanes | | Magallanes | Magallanes |
| mrt3-taft-ave | Taft Ave | Taft Avenue | Taft Avenue | ✱ Taft Avenue |

## Notes
- OSM mixes hyphens, spaced hyphens and an en dash for compound names. Approved: a plain hyphen with no spaces in every compound name.
- MRT-7 names are left out: the Line is Coming Soon and the two lists in the repo disagree (D13).
- Approving this does not change ids or Fares. The fare converter currently matches Stations by the fare matrices' spellings, so applying it also means giving the converter a matrix-name → id mapping.
