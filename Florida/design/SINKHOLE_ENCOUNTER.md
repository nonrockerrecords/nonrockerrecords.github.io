# County Jurisdiction — encounter design v0.1

## Premise

A sinkhole opens outside Sunshine Discounts. Three spectral alligators rise from it carrying decades of unresolved county paperwork. Darlene insists it is a permitting issue. Ron insists it is a wildlife issue. The Manager has a closing shift to get to.

Player crew: Darlene Bix, Gator Ron, The Manager. Fixed physical positions. Their action cards form one shared deck. No free walking or individual health in this first encounter.

Target play length: roughly 5–8 minutes on a first visit, subject to playtesting. Up to five player turns. No real-time decision timer.

## Objective and visible state

Win immediately by **sealing the rift (12 Stability)** OR **relocating all three spirits**. A positive-Endurance win check occurs after each fully resolved card and any immediate Chaos consequence. Players may combine tactics: relocation buys safety while sealing, and Stability reduces the final-turn threat.

| State | Initial value | Rules |
| --- | --- | --- |
| Crew Endurance | 12 / 12 | Shared health; zero means defeat |
| Stability | 0 / 12 | Persistent within encounter; clamped at 12 |
| Spirits remaining | 3 | Removed only by relocation; cannot go below zero |
| Actions | 3 | Resets at turn start; unused actions expire |
| Chaos | 0 / 6 | Temporary encounter risk; surge at 6 or higher |
| Barricade Block | 0 / 4 | Absorbs the next incident's damage, then all Block expires |
| Generator | Off | Can be switched on once; remains on |
| Distracted | No | Set by Questionable Bait; cleared by relocation combo or at turn end |
| New Liabilities | 0 | Count Liability cards acquired in this encounter for the recap |

Heat and Clout are reserved for the future travel layer. They are not extra meters in the first encounter. Report proposed Clout reward in the recap only.

## Three interactive scene targets

1. **Sinkhole:** Stability actions, bait and relocation. A targeting label describes the exact intended result.
2. **Barricade:** creates Block against incident damage. Its warm highlight matches the selected card.
3. **Generator:** switching it on boosts Stability cards and powers Closing Time's relocation option, but immediately adds Chaos.

Cards affecting the crew use a clearly labeled crew-panel target. This is a UI target, not a fourth scene prop. Field Notes and On the House are self actions confirmed from the selected card.

## Turn flow

1. Reset Actions to 3. Draw five from the shared deck. No passive character bonuses in v0.1; identity comes from the cards below.
2. Display the coming incident, its damage and modifiers.
3. Select card, choose target/mode, preview costs/effects and confirm. Cancel before confirmation is free; no undo after confirmation.
4. Validate the current state, pay cost, resolve effects in written order, move the card to discard or exhaust, then process Chaos and win/loss checks.
5. Repeat until the player chooses End Turn. Warn if a legal affordable card remains, but allow ending.
6. Discard the remaining hand. Resolve incident damage after Block, clear all Block and Distracted, add the incident's Chaos and process a surge if triggered. If alive after turn five without winning, resolve deadline defeat. Otherwise advance the turn and draw.

When draw pile empties, shuffle the discard pile with the saved random seed. Exhausted cards remain unavailable until the encounter ends. If both piles run out during a draw, stop drawing rather than repeat nonexistent cards. Normal mode shuffles the 12-card deck. Tutorial mode uses the explicit opening order below, then shuffles recycled cards normally. No separate mulligan in this slice.

## Starting deck: 12 cards, 9 unique designs

Each character contributes four cards. Generator's bonus applies once to any card that explicitly gains Stability, including the conditional bonus on County Jurisdiction as part of the same gain. It does not affect Block, healing, draw or relocation.

| Owner / Card | Copies | Cost | Target / effect |
| --- | ---: | ---: | --- |
| Darlene / Orange Cone Authority | 2 | 1 | Barricade: gain 2 Block, cap total at 4 |
| Darlene / County Jurisdiction | 1 | 2 | Sinkhole: gain 5 Stability; gain 2 more if Block is currently positive |
| Darlene / Emergency Requisition | 1 | 1 | Generator: turn it on, then gain 2 Chaos. Exhaust. Illegal if already on |
| Ron / Questionable Bait | 2 | 1 | Sinkhole: gain 2 Stability and set Distracted. Playing it twice does not stack Distracted |
| Ron / Catch and Release | 1 | 2 | Sinkhole: relocate 1 spirit, or 2 if Distracted; clear Distracted; cap relocation at remaining spirits |
| Ron / Field Notes | 1 | 0 | Draw 1 card, then exhaust. Does not redraw itself |
| Manager / Fresh Pot | 2 | 1 | Crew: restore 3 Endurance, cap at 12. Disabled at full health |
| Manager / On the House | 1 | 0 | Gain 2 Actions, then gain 2 Chaos. Exhaust |
| Manager / Closing Time | 1 | 2 | Sinkhole: choose gain 4 Stability OR relocate 1 spirit (2 if generator on). Then gain 2 Chaos. Exhaust |

If a card has no legal effect/target, disable it and explain why. Relocation modes are unavailable when zero spirits remain (normally the encounter already ended). Closing Time's mode is an explicit choice before confirmation.

**Liability card — Wrong Department:** unplayable, costs nothing because it cannot be played, takes one hand slot and discards normally. The only acquisition in v0.1 is a Chaos surge. It does not replace a card in the initial deck.

## Chaos and damage

At Chaos >= 6, immediately trigger **Manifestation**: lose 2 Endurance directly (bypasses Block), add one Wrong Department card to discard, increment New Liabilities, and subtract 6 Chaos. Repeat only if still >= 6. Resolve this before checking victory, so a fatal risky play cannot skip its price. Chaos never persists into the next encounter.

Incidents are scripted and visible. Apply only their own modifiers; no hidden random attack rolls.

| End of turn | Incident | Base damage | Chaos gained |
| --- | --- | ---: | ---: |
| 1 | Spectral Tail Slap | 2 | 1 |
| 2 | Parking-Lot Stampede | 3 | 1 |
| 3 | Something Under the Asphalt | 3 | 2 |
| 4 | The Awning Gives Way | 4 | 1 |
| 5 | Final Manifestation | 5 | 2 |

For turns 1, 2, 4 and 5, reduce base damage by one per spirit already relocated. Turn 3's ground hazard ignores relocation. On turn 5 also reduce base damage by 2 if Stability >= 8. Clamp modified damage at zero, then subtract Block and clamp again. Incident Chaos gain still occurs even when damage is fully blocked. The threat preview updates after every action and shows the arithmetic in a tooltip.

At the end of turn five, if alive but neither objective complete, the parking lot collapses and the encounter is lost. The warning is visible from the start and reiterated on turn five. Victory is checked after card resolution, so a win during turn five prevents its incident and deadline.

## Complete worked turn: safe containment opening

Tutorial opening hand: Orange Cone Authority A, County Jurisdiction, Questionable Bait A, Fresh Pot A, Emergency Requisition.

- Start: Endurance 12, Stability 0, Chaos 0, Actions 3, Block 0, spirits 3, generator off.
- Play Orange Cone Authority on the barricade: Actions 2, Block 2. Darlene points; barricade snaps into place. Preview now shows the incoming 2 damage fully blocked.
- Play County Jurisdiction on the sinkhole: Actions 0, Stability 7 (5 base + 2 because Block > 0). Darlene stamps the paperwork; the crack visibly contracts.
- End turn: discard unplayed cards; turn 1 deals max(0, 2 - 2) = 0 damage; clear Block; Chaos rises to 1. Endurance remains 12.

Next five tutorial cards in order: Orange Cone Authority B, Questionable Bait B, Catch and Release, On the House, Closing Time. Last two cards in initial draw pile: Fresh Pot B, Field Notes.

### One possible turn-two win: seal it

- Start with 3 Actions, Stability 7, Chaos 1, Endurance 12.
- On the House: 5 Actions, Chaos 3; exhaust it.
- Questionable Bait: 4 Actions, Stability 9, Distracted yes.
- Closing Time, Stability mode: 2 Actions, Stability capped at 12, Chaos 5; exhaust it.
- No surge. Win immediately; turn-two incident never occurs. Endurance 12, spirits still present but sealed beneath the rift.

### Another possible turn-two win: relocate them

- From the same turn-two starting state, On the House yields 5 Actions and Chaos 3.
- Questionable Bait: 4 Actions, Stability 9, Distracted yes.
- Catch and Release: 2 Actions, spirits 1; consume Distracted.
- Closing Time with generator off relocates the final spirit: 0 Actions, spirits 0, Chaos 5.
- No surge. Win immediately by relocation; turn-two incident never occurs. The rift is still physically present, but its spectral occupants are gone.

Order matters: playing Catch and Release before bait would move only one spirit, leaving one after Closing Time and preventing this win. Players can preview that difference before committing.

### Risk example: generator route

- Turn 1: Emergency Requisition (2 Actions, generator on, Chaos 2), Questionable Bait (1 Action, Stability 3 including generator bonus, Distracted yes), Orange Cone Authority (0 Actions, Block 2). End turn: no damage, Chaos 3; clear Distracted/Block.
- Turn 2: On the House (5 Actions, Chaos 5), Questionable Bait (4 Actions, Stability 6, Distracted yes), Catch and Release (2 Actions, spirits 1, clear Distracted).
- Closing Time with generator on relocates up to two remaining spirits, capped at one here. Actions 0, spirits 0, Chaos 7. Manifestation immediately removes 2 Endurance, adds one Liability, and reduces Chaos to 1. Endurance 10: relocation win. If Endurance had been 2 or less, it would instead be defeat despite relocating the last spirit.

The generator improves other deck sequences, but it is unnecessary and costly in this tutorial ordering. Showing that optional setup is not always advantageous is intentional. Normal seeded runs should offer different choices; neither route is claimed balanced until playtested.

## Endings and recovery

- Seal win: 'COUNTY DECLARES PORTAL STRUCTURALLY COMPLIANT.' Recap shows turns, Endurance, surges and cards played. Proposed reward: choose one card upgrade, restore 2 Endurance for future travel, 2 Clout.
- Relocation win: 'LOCAL DEPUTY REHOMES THREE DECEASED ALLIGATORS.' Same base reward; distinct narrative and one future wildlife encounter flag. No blanket stronger reward.
- Defeat by Endurance/deadline: 'PARKING LOT REZONED AS AFTERLIFE.' In this standalone slice offer Replay Same Seed or New Shuffle. No pretend campaign persistence.
- In the later travel game, a nonfatal incident retreat can trade supplies/Heat for continuing; run defeat remains Endurance zero. That campaign rule is deferred, not implemented here.

## Design risks to playtest

The fixed tutorial allows a two-turn containment solution. It teaches interaction but must not be mistaken for proof of replayability. Normal deck shuffle, two win routes and the generator create decisions, but test at least several seeds for unwinnable starts, universally optimal lines and healing traps. Avoid adding more meters to compensate for weak choices. Rebalance values or card effects first.
