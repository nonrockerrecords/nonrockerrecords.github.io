# Florida Man — first slice implementation plan

## Scope and output

One complete local playable County Jurisdiction encounter, using the approved style. Title/start, brief tutorial, playable board, card inspection, pause/settings, result/replay and local resume. No travel map, full roster, multiplayer, storefront or deployment in the first slice.

The current deliverable is the design pack. No additional image batch or game implementation has been executed by writing this plan.

## 1. Rules prototype

Implement the encounter as a small TypeScript rules module independent of Three.js. Pure state transitions take actions and emit state plus presentation events. Seeded shuffle; versioned saved state includes piles, exhaust, hand, all counters, RNG state and tutorial order. Load into a stable input-ready state; never replay a paid action because an animation was interrupted.

Validate both victory routes, damage modifiers, Chaos-before-victory ordering, deck exhaustion and the five-turn deadline. Balance the real deck through scripted play and human play before expanding card counts.

## 2. Production composition and UX

One fixed three-quarter 3D camera with a restrained inspection arc. Crew at left/near edge, sinkhole center-right, barricade between crew and rift, generator at right. Hand in the lower screen, concise threat strip above the encounter, Actions/Endurance always readable. Secondary inspection exposes more rules without cluttering the main view.

State flow: title -> tutorial or normal start -> player choosing -> targeting/mode -> confirming -> action resolution -> player choosing; End Turn -> incident -> next player turn; any terminal result -> recap/replay. XState can orchestrate this lifecycle while the pure rules module remains authoritative.

Drag or click/tap selects cards. Highlight legal targets; hovering previews exact numbers. Cancel with Escape or outside tap. Confirm explicitly for touch and mode choices. End Turn stays reachable. Keyboard cycle/activate targets and provide DOM controls reflecting the same game state. Invalid moves explain their reason. A log allows review of recent consequences.

## 3. Small asset manifest

All entries are proposed and pending. Do not resume the superseded 17-image queue.

| Slug | Target under Florida/game/assets/ | Consumer | Direction / constraints |
| --- | --- | --- | --- |
| darlene-idle | characters/darlene-idle.png | Crew standee | Full exaggerated painted figure, pointing, transparent; no base/shadow/text |
| ron-idle | characters/ron-idle.png | Crew standee | Full tall wiry caricature, huge mustache/glove, transparent; no base/shadow/text |
| manager-idle | characters/manager-idle.png | Crew standee | Full compact caricature, raised eyebrow/coffee pot, transparent; no base/shadow/text |
| barricade-art | cards/barricade.webp | Orange Cone Authority | Bold painted barricade silhouette; no text/frame |
| permit-art | cards/permit.webp | County Jurisdiction | Illustrated stamp and permit shapes; no readable writing |
| generator-art | cards/generator.webp | Emergency Requisition | Chunky yellow portable generator; no brand/text |
| bait-art | cards/bait.webp | Questionable Bait | Dubious bait bucket; graphic readable shape |
| ghost-gator-art | cards/ghost-gator.webp | Catch and Release | Expressive mint spectral alligator silhouette |
| field-notes-art | cards/field-notes.webp | Field Notes | Field notebook and binoculars; no writing |
| coffee-art | cards/coffee.webp | Fresh Pot | Oversized glass pot with warm coffee; no writing |
| hospitality-art | cards/hospitality.webp | On the House | Coffee cup and saucer with warm playful gesture |
| closing-art | cards/closing.webp | Closing Time | Keys and turning lock; no text |
| liability-art | cards/liability.webp | Wrong Department | Tangled paperwork, bold frustrated stamp shape; no writing |

Begin with the three standees and two card illustrations, inspect them together in the renderer, then complete remaining cards. Distinct images get distinct requests and review records. Source PNGs remain alongside optimized derivatives. New prompts describe characters from prose and the approved style; original cards are not input images.

Ground, building, palms, bases, card shapes, generator, barricade and rift are geometry. Use procedural/painted materials for the first build. Only commission additional raster surfaces where the rendered scene demonstrates a need. The concept image is an art-direction anchor, not a background substitute for interactive geometry.

## 4. Rendering and audio

Proposed stack: React/TypeScript, Three.js via React Three Fiber/Drei, Anime.js for coordinated presentation, restrained postprocessing, Radix for accessible menus/dialogs, Howler for sound. Use a single animation owner per property. Physics is optional and unnecessary for initial rule resolution/card placement.

Build a WebGL baseline; pin compatible dependency versions at implementation. Use one canvas, avoid per-frame React state churn, dispose GPU resources, cap pixel ratio and offer a lower quality tier. Lazy-load larger optional assets and pause decorative work while hidden. Profile on actual target devices before making performance claims. Target 60 fps on the development desktop and a stable playable lower-effects mode; these are targets, not measurements.

Make initial procedural ghost effects, rising papers and rift glow reflect rules. Cards and targets use a shared highlight language. Standees lean/bob slightly on action. Audio starts only after user interaction, with independent music/effects levels, card sounds and location ambience. Skip/speed controls never alter rules outcomes.

## 5. Verification and review

- Rules: card payment/eligibility, no duplicate play, Block cap/expiry, generator bonus once, Distracted consumption/expiry, relocation clamp, heal clamp, Liability insertion, seeded reshuffle, zero-health priority, both wins and deadline loss.
- Resume: reload before/after card confirmation, during presentation, after incident, and on results. Never double-apply effects or lose an accepted play.
- Input: complete encounter with mouse, tap and keyboard. Inspect and cancel, choose Closing Time mode, end turn, replay same seed, new shuffle, pause and audio.
- Visual: compare screenshot to approved anchor; inspect card text at actual size, standee edges/shadows, target visibility, readable UI and narrow layout. Validate reduced motion and low-effects mode.
- Runtime: missing image handling, WebGL unavailable message/retry, load errors, no console exceptions, no card controls hidden behind scenes.

## Model assignments

Astra High: encounter rules, architecture, approved-style interpretation, first integrated scene and final review. Sol High: bounded feature implementation and test fixes once patterns exist. Built-in image generation: production artwork under the written prompts, with visual review. No claim that this tool exposes a chosen highest model. No runtime model calls are needed for the playable game.

## Expansion gate

Expand after a real play session demonstrates readable decisions, a satisfying card/target loop, at least two useful strategies, dependable save/resume and acceptable target-device performance. The next content would be one contrasting encounter and a small reward choice, before building a statewide campaign.
