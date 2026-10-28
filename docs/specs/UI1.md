# UI1: Visual redesign

Status: draft for review. Requested by the owner on 2026-10-28 with two mockups (Map tab, Ride planner), to be built before M3 (owner, 2026-10-28). Terms follow [GLOSSARY.md](../../GLOSSARY.md). Behaviour does not change: this is a restyle plus a few map controls.

## Why

The app is built and working (M1, M2) but looks like a developer tool: dark, dense, emerald-on-black. The owner wants a warmer, friendlier look for first-time riders, matching the mockups. Doing it before M3 means M3's new screens are built in the new style once.

## The design, from the mockups

- **Light, warm theme:** off-white page background, white cards with soft borders, near-black text, grey secondary text.
- **Orange accent:** active tab, toggles, primary buttons ("Start Guided Ride" with an arrow icon). Text on orange meets WCAG AA for large text; small text and icons in orange meet AA against the background.
- **Serif headings:** screen titles and card titles in a bold serif; body text stays the system sans-serif.
- **Screen header:** large serif title with a one-line subtitle, and a round settings button that opens About (language, data, disclaimer).
- **Tab bar:** outline icons; the active tab is orange with a short bar above it.
- **Map tab:**
  - a welcome card ("Explore Manila / See the bigger picture." plus a line of text) with an original illustration;
  - the Line map inside a card titled with the network name, with "Find a station" (search by name, opens Station detail), zoom in and out buttons, a "show me" button (centres on the rider when location is already allowed; asks with the usual explanation otherwise), and the legend (Lines, MRT-7 Coming Soon, Unverified);
  - a tip bar under the map: "Tap a Station to see details, plan a ride, or see what's nearby."
- **Ride planner:** a "Discounted Fare" card with a toggle and a subtitle; route cards ("Fewest Transfers", "Fewer stops") with "Estimated, no travel times" and an Unverified chip; each leg with a round train icon in the Line's colour joined by a vertical bar in that colour; walking legs with a walking icon; total Fare; orange "Start Guided Ride".
- **Every other screen** (Fares, Nearest, Learn, About, Station detail, Guided Ride, street map, Station picker) uses the same tokens, cards, chips and buttons.

## Not copied from the mockups

The mockups were drafted quickly and contain mistakes; the app keeps its real data and structure:
- The map mockup swaps the LRT-2 and MRT-3 colours and places Stations and names freely ("Rannatento", "Nonda Avue"). The map stays the existing schematic from OpenStreetMap positions, with the real names.
- The map mockup has a street-map background. The Line map stays offline, so it gets a plain, softly tinted background, not map tiles (tiles need a connection; the street map screen already has them).
- The tab row under the Map title duplicates the bottom tab bar; there is one tab bar.
- "LearnRT · M2 / Android development build, emulator" was the caption of Claude's preview image, not app text.
- "Manila Rail Transit" is not an official name; the map card is titled "Metro Manila rail".
- "Plan your trip" becomes "Plan your ride" (GLOSSARY: "trip" is avoided).

## Acceptance criteria

### Theme
- One set of named colour roles (page, card, card border, text, secondary text, accent, accent text, warning, success and so on), defined once for light and once for dark, used by every screen. No screen uses a raw colour or a light-only or dark-only class.
- Light is the main design. Dark follows the phone's setting automatically: same layout, warm dark surfaces, same orange accent. `app.json` follows the system (`userInterfaceStyle: "automatic"`).
- Line colours keep their hues (LRT-1 green, LRT-2 purple, MRT-3 blue), with a deeper shade on light backgrounds and the current shade on dark, so lines and dots stay legible on both. MRT-7 moves from orange to a colour that cannot be mistaken for the accent (proposed: warm brown or grey-violet). Still not the operators' brand colours (PRD §11).
- The heading font is bundled with the app (works offline), under the SIL Open Font License. Fraunces (a serif) was built first; on 2026-10-28 the owner asked for a cleaner, smoother sans similar to Montserrat, so it is now Plus Jakarta Sans Bold (`@expo-google-fonts/plus-jakarta-sans`, SIL OFL 1.1, full Filipino and ₱ coverage). Poppins was ruled out: it has no ₱. Montserrat has every glyph but is 3.5 times larger.

### Components
- `ScreenHeader`, `Card`, `PrimaryButton`, `SecondaryButton`, `Chip` (Unverified, Coming Soon), `Toggle row`, and the Line leg icon, shared by all screens.

### Map tab
- Welcome card with an original SVG illustration drawn for LearnRT (an elevated train, a simple skyline and a sun, in the palette), bundled and offline. No traced or copied artwork.
- Map card: title, subtitle ("Tap a Station · Pinch to zoom"), "Find a station", zoom +/−, "show me", legend with Unverified; the existing pan, pinch and tap keep working.
- Tip bar under the map.

### Ride planner and Guided Ride
- As in the mockup; same data, same labels from M2.
- Guided Ride screen, alert cards and the "Continue your Guided Ride" banner restyled to match.

### All screens
- Fares, Nearest, Learn, About, Station detail, street map and the Station picker restyled.
- Every new string in English and Filipino ("needs review").

### Accessibility
- Text contrast meets WCAG AA in both themes (checked with a contrast calculation for every text and background role pair, recorded in the ticket).
- No clipped text at 360 dp and 1.3× font, in both languages and both themes, as in M1 and M2.

## Edge cases
- Phone switches between light and dark while the app is open: the app follows without a restart.
- Font not yet loaded on first launch: the app waits for it (splash) rather than flashing a different font.
- Location not allowed: "show me" asks with the Nearest explanation; if refused, it says so and does nothing else.
- "Find a station" with no match: says so; names match without accents and case ("dona" finds "Doña Carmen").

## Out of scope
- Changing what the app does. Data, routes, Fares, alerts and labels stay as in M2.
- The website (`apps/web`) keeps its look until M4b.
- App icon and splash artwork (M6, with store listings).

## Decisions for the owner
- **UI1-D1 Heading font:** Plus Jakarta Sans, bold (changed from Fraunces by the owner).
- **UI1-D2 Accent orange:** a deep orange close to the mockup that passes AA for large text with white on it (proposed `#E4572E`); exact value checked by the contrast test.
- **UI1-D3 MRT-7 colour:** warm brown (proposed) instead of orange.

## Verification for UI1
1. `pnpm test`, `pnpm typecheck`, app lint, `expo-doctor` and the Android and iOS exports pass; behaviour tests from M1 and M2 unchanged.
2. A test that every colour role pair used for text meets WCAG AA in both themes.
3. On the emulator, light and dark: every screen screenshotted; 360 dp at 1.3× font in English and Filipino; the M2 Guided Ride playback still passes (one locked-screen run across a Transfer).
4. A new preview PNG for the owner, light and dark side by side.

## As built (differences found in review, 2026-10-28)
- Dark Line shades differ from the old dark colours for LRT-1 and MRT-3 (and light LRT-2 equals the old shade): the colour-blind distinction test required it. Hues are unchanged.
- The Line leg badge is a round train icon; "Start Guided Ride" uses the `navigate` arrow icon.
- Chips are `UnverifiedBadge` and plain legend text for "Coming Soon"; there is no generic `Chip` component yet.
- `WelcomeArt` colours are artwork and exempt from colour roles.
- At enlarged text (font scale above 1.15) the Map tab's welcome card shrinks to its title and the tip bar is hidden, so the map keeps room; tab labels keep a fixed size because the bar has a fixed height.
- Two small changes beyond the spec: a "you are here" dot for "show me", and the Nearest tab icon.

## Owner requests after the first phone test (2026-10-28)
- **Theme toggle:** About has an "Appearance" choice: same as phone (default), light or dark; saved on the device. This replaces "follows the phone only" above.
- **Station picker:** Ride and Fares pick the Line first (LRT-1, LRT-2, MRT-3 or All Lines), then a Station, with a search box that ignores accents and case.
- **Nearby Station route:** tapping a Station on the Nearest tab opens a street map with the rider, the Station and its entrances joined by a dotted straight line and the distance, plus "Open in Google Maps" (walking directions; only the Station's position is sent to Google, the rider's stays on the phone) and "Station details". LearnRT draws no walking path: there is no routing data and none is invented.
