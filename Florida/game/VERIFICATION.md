# Verification — 2026-09-21

## Six-character roster and pick-three decks

Added DJ Rip Current, Cheryl Vortex and Mara Key without replacing the approved original trio. New runs accept exactly three distinct locals and build a 12-card deck from their four-card mini-decks. The fixed tutorial still uses the original instructional order. Legacy 12- and 18-card saves migrate with their exact card inventory.

DJ and Cheryl's approved prior renders were preserved. Mara and all six signature pet/object illustrations were generated from the saved text-only manifest, visually inspected, copied to stable project paths, optimized, and wired to the live cards. Character alpha validation passed.

## Pink-and-bling revision

Added a skippable orientation and state-driven first-turn guide. Browser verified selection → target → confirm → barricade combo → end turn → free-play handoff. New pink/turquoise/gold palette inspected in the scene and card interface; original generated standees remain unchanged. All 17 rules tests and production build pass after the tutorial/theme implementation.

## Automated

- 28/28 rules tests pass on Node 24.16.
- TypeScript strict check and Vite production build pass.
- Tests additionally cover exact pick-three validation, four cards per selected local, all six new signature effects, dynamic save validation and legacy roster migration.
- Generated PNG alpha channels inspected; transparent background exists. WebP derivatives generated and used by the scene/cards.

## Browser checks

Codex in-app Chromium browser at the local development URL:

- Played fixed tutorial through seal-the-rift victory on turn 2.
- Replayed fixed tutorial through all-three-spirits relocation victory on turn 2.
- Reloaded during turn 2 and resumed: 7 Stability, 12 Endurance, 3 Actions, 1 Chaos and correct remaining hand persisted.
- Inspected scene and freshly generated standees. Corrected washed-out artwork with unlit, non-tone-mapped cutout materials.
- Inspected 390 × 844 responsive layout, compacted objectives and separated scene targets; selected, targeted and played a card successfully at that viewport.
- Corrected optional Three.js material map construction to avoid undefined-map warnings.
- Drag-start no longer removes its own source DOM node. Drag/drop has not yet received a full browser gesture regression test; click/keyboard-target buttons are the primary verified path.
- Selected DJ, Cheryl and Mara in the roster board, started a run, and verified all three standees plus their live illustrated card art in the Three.js scene.
- Inspected the complete roster picker at 390 × 844; all six choices, selection count, start controls and resume control remain visible and usable.
- Browser console contained no warnings or errors during the roster/run smoke test.

## Not yet certified

Physical mobile hardware, Safari/Firefox, screen-reader usability, drag/drop gestures, audio quality, WebGL-loss recovery, prolonged performance, random-deal difficulty distribution and deployment. Browser checks used the development server; the production output was compiled but not separately served for a browser smoke test.
