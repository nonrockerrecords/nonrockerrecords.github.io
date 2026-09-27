# Florida Man — County Jurisdiction

**Crew roster:** The game now has six selectable locals. Pick any three; each contributes a four-card mini-deck for a focused 12-card run. DJ Rip Current, Cheryl Vortex and Mara Key join the original trio with dedicated standees and illustrated pet/object cards. The guided tutorial remains the fixed Darlene/Ron/Manager deal, and older 18-card saves still restore safely. Current rules suite: 28 passing tests.

Playable first-encounter prototype: exaggerated painted-pulp crew standees in a real Three.js parking-lot diorama. The building, palms, sinkhole, generator, barricade and ghost gators are modeled geometry. The hand and readable interface are HTML/CSS, not card meshes.

## Run locally

Requires Node 22.18+ (tested on Node 24.16).

```powershell
npm install
npm run dev
```

Open http://127.0.0.1:8790/. `npm test` runs the pure rules tests; `npm run build` type-checks and produces `dist/`. Build uses relative asset paths for eventual subdirectory hosting. Nothing has been deployed.

## Play

Choose **Teach me to play** for the fixed introductory deal, or select three locals and start their shuffled 12-card deck. Select a card, choose its scene target (or the Target button), then confirm Play Card. Personal cards automatically target your crew or hand. Escape cancels selection. End Turn discards the remaining hand and resolves the displayed incident.

Seal the rift at 12 Stability **or** relocate all three spirits within five turns, while keeping Endurance above zero. Block reduces the next attack. Bait improves Catch and Release. Powering the generator improves Stability cards but increases Chaos; reaching 6 Chaos costs Endurance and adds an unplayable Liability. Progress saves locally after each resolved action.

Pause contains quick-animation and low-graphics settings. Sound is off by default. Device reduced-motion preference is respected. Cards remain playable through text controls if WebGL is unavailable.

## Implementation and art

- Vanilla TypeScript + Three.js + Anime.js; no React layer needed for this bounded encounter.
- Pure seeded rules in `src/rules.ts`, separate from scene animation and UI.
- Six generated transparent crew illustrations with optimized WebP runtime derivatives; the three previously approved standees were preserved unchanged.
- `artwork/crew-roster.json` records full prompts and review status for DJ, Cheryl, Mara and their six signature-card illustrations. `artwork/manifest.json` retains the original trio records.
- Each crew member contributes four cards. DJ, Cheryl and Mara currently use two copies apiece of their two illustrated signature cards.
- Browser UI fonts currently request Google Fonts; system fallbacks exist. Self-host fonts before an offline/release build.

## Next production gates

This is a playable vertical slice, not a production launch. Next: broader trio-combination balance testing, more detailed environment dressing, real-device performance/accessibility checks, and deployment review. The current bundle triggers Vite's 500 KB uncompressed chunk advisory. Character PNG masters currently copy to `dist`; move masters out of public before final packaging if they are no longer needed there.

See `VERIFICATION.md` for checks completed and limitations. Design rules and approved visual direction live in `../design/`.
