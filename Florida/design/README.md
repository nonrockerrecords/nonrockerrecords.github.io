# Florida Man — first playable encounter

Status: design blueprint. The exaggerated painted-pulp standees and handcrafted 3D environment are user-approved. Rules and numerical balance below are proposed starting values, not playtested results.

## Start here

- [STYLE_BIBLE.md](STYLE_BIBLE.md): approved visual language and asset requirements.
- [SINKHOLE_ENCOUNTER.md](SINKHOLE_ENCOUNTER.md): complete encounter, card rules, example turns and outcomes.
- [BUILD_PLAN.md](BUILD_PLAN.md): implementation sequence, UX, initial assets and verification.
- [approved-style-preview.png](approved-style-preview.png): approved concept illustration; not an implemented scene or production texture.

Game title: **Florida Man**. First incident: **County Jurisdiction**. Location: the Sunshine Discounts strip-mall parking lot, where ghost alligators emerge from an unpermitted sinkhole.

## Decisions already made

- Painted pulp caricatures, with strong exaggeration and distinct silhouettes.
- Characters appear as illustrated physical standees inside true 3D miniature environments.
- Supernatural weirdness is real; locals treat it as another inconvenient Florida problem.
- Fresh artwork; original card graphics are inspected for character description, not reused or supplied as generation references.
- Establish one playable encounter before expanding the cast or generating a large asset batch.

## Working implementation assumptions

The first slice is solo, uses fixed crew positions, mouse/touch/keyboard targeting, a restrained camera arc, local saves, and deterministic effects with seeded deck shuffling. These are proposed defaults rather than answers to the earlier unanswered platform/session questions. Full-run duration, multiplayer, wider map, shops, and permanent unlocks are deferred until this encounter works.

## Superseded material

The earlier production/PROMPTS.md and production/manifest.json describe a more realistic 17-image batch. That queue is paused and superseded by this visual direction. The existing production/assets/darlene-bix.png is an unapproved earlier style experiment; do not use it in the game. Original review sheets are inspection-only. No mass generation should resume from the old manifest.

The approved preview was freshly generated from text, then edited to exaggerate its caricatures. Neither operation supplied the original Florida card graphics as image inputs. The generator does not expose a model selector; its underlying model was not verified.
