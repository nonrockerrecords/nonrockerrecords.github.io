# Arcade Flight — reference review and production pass

User direction, October 5, 2026: “Please keep working on making this game more production level, please review 1942 and raiden games and another japanese games for inspiration”. Continued at the user's request on October 6. Earlier feedback requested more background speed, a clear distinction between dangerous objects and collectibles, and a larger game on browser and phone screens.

## References reviewed

The following official descriptions, controls and promotional images informed this pass. These are design lessons and our interpretations, not a claim that every reference was played end to end. No reference artwork, audio, level data or source code was imported into Overdrive.

| Reference | Publisher evidence | Lesson applied to Overdrive |
| --- | --- | --- |
| [1942 — Capcom Town](https://captown.capcom.com/en/classic_games/44) | Capcom describes the limited bullet-dodging aerial loop and lists movement, loop and shot controls. This page is the home-console edition. | A deliberate evasive roll with a short safety window and visible recharge; banking and exhaust communicate movement. Overdrive uses a cooldown rather than copying 1942's stock system. |
| [Raiden IV × MIKADO remix — MOSS](https://raiden.mossjp.co.jp/raiden4_mikado/) | The official page describes weapon-level pickups, homing missiles, score multipliers and bombs; its gameplay image shows bright weapon effects over detailed scenery. | Focused fire, homing missiles from level 3, clear formation bonuses, a visible weapon level, and stronger hierarchy between weapons and ground detail. Existing bombs and stage artwork are retained. |
| [DoDonPachi DaiOuJou — CAVE](https://shooooooooting.cave.co.jp/archives/product_page/dodonpachi-daioujou) | CAVE describes chaining consecutive kills and the powered-up Hyper system. Its [shooting portal](https://shooooooooting.cave.co.jp/) emphasizes intense but navigable bullet patterns. | A visible chain timer, boss phases, locked attack windups and a gap in the radial storm. These are original patterns tuned for this game, not recreations of CAVE encounters. |

## Implemented

- Evasive roll: C or Space on keyboard, ROLL button on phone. Safety lasts 0.7 seconds; recharge lasts 9 seconds. It preserves bullets and movement so the player must choose an exit.
- Focus: hold Shift for slower steering and narrow, stronger shots. A persisted Focused touch fire setting applies focused fire while a touch pointer is held. It clears when the gesture ends.
- Homing missile pair at firepower level 3 and above, visually distinct from the cyan primary shot.
- Formation clear reward: destroying every member before an escape awards 600 base points plus 200 per stage index and 8 charge. The existing multiplier applies. Escapes and repeat destruction cannot award a clear.
- Boss phases at 66% and 33% health: LOCK-ON fans, CROSSFEED twin-emitter volleys, FEEDBACK STORM radial volleys with a route through the ring. A short amber warning marks the locked aim before firing. Phase changes clear old bullets and give a brief reset.
- Banked player motion, twin exhaust, cyan silhouette marker and a readable hitbox. The roll animation compresses the aircraft silhouette without changing logical collision coordinates.
- Original ground landmarks move beneath the existing stage artwork: coastal islands, industrial roofs, refinery platforms. Scrolling data is quieter and kept toward the edges.
- Chain timer, focused/spread weapon indicator and named boss phase in the HUD. Phone control widths are tightened to fit the existing arena size.
- Canvas redraws immediately on resize; paused/manual sessions no longer show a blank arena. Pausing freezes the new roll timer and scenery. Defeated enemies cannot cause collision damage during their final cleanup frame.

## Verification

`tests/flight.cjs` covers gameplay, three-stage progression, six desktop/phone layouts, pickups, damage, overdrive, pause and asset/runtime errors. Boss-arrival checks now wait for actual gameplay state rather than a fixed duration, accommodating hit pauses.

`tests/arcade.cjs` covers roll activation/protection/recharge, focused shot spread and damage, missiles, complete versus escaped formations, repeated-clear prevention, all boss phases across all three stages, active controls at 390×844, 375×667 and 320×568, real emulated touch gestures, touch-focus persistence and absence of QA controls in ordinary sessions. Desktop, phone and stage-boss screenshots were visually reviewed.

Both suites pass with zero runtime or asset errors on desktop Edge. The arcade suite includes 29 checks and keyboard Space activation of the focused Start button. A 180-frame boss-barrage sample at desktop and phone pixel densities measured a 16.7 ms median and at most 16.8 ms at the 95th percentile, with 82 bullets active; this is headless Edge on this computer, not physical phone performance. Campaign checks use invulnerability and forced boss defeat to isolate progression; they do not certify human difficulty balance. Physical phone/Safari testing, subjective audio review and user acceptance of the new art/combat direction remain open.

Run with a local static server at http://127.0.0.1:8781. Playwright and Edge must be available; set `PLAYWRIGHT_MODULE` if using a bundled installation. Run `node tests/flight.cjs`, `node tests/arcade.cjs` and `node tests/performance.cjs` from a directory where review screenshots may be saved. Implementation started October 5–6; final verification and release preparation completed October 7, 2026.
