# Shared Deck / Multiple-Level System

Status: first playable integration implemented September 25. Both encounters use the same rules and deck. Legacy target IDs remain for save/card compatibility, with an exported `TARGET_ROLES` map and stage-specific UI/scene interpretation. Vortex has its own incident sequence, outcome copy and save slot. Full rules regression includes all 20 crew combinations across both stages.

## Decision

Keep one character deck across every level. The current numerical mechanics already travel well: Actions, Endurance, Chaos, Block, Stability, power, distraction, companions, drawing, exhausting and surge protection are all location-independent.

Do not make a second mini-golf deck. Instead, separate a card's mechanical target role from the physical prop that represents that role in each level.

## Shared target roles

| Mechanical role | Sunshine Discounts | Vortex Putt-Putt |
| --- | --- | --- |
| Threat | Sinkhole | Windmill tunnel / spirits animating the windmill |
| Defense | Barricade | Crew protection at the tee |
| Power | Generator | Pump shack / ball return |
| Crew | Crew standees | Crew standees |
| Self | Hand | Hand |

The rules engine should eventually use stable role ids such as `threat`, `defense`, `power`, `crew` and `self`. Each level configuration supplies the visible label, Three.js target group, incident list, win copy and finale copy.

## Card audit

Already portable without mechanical changes:

- Bass Possum, Bootleg Boombox, Putt-Putt, Cursed Putter, Judgmental Raccoon and Questionable Multitool.
- Emotional Support Possum, Rhinestone Chihuahua, Pool Noodle of Protection, Gas Station Crystal, Iguana in the Fuse Box and Haunted Lawn Flamingo.
- Orange Cone Authority, Emergency Requisition, Questionable Bait, Field Notes, Fresh Pot and On the House.

Needs only neutral wording, not a new effect:

- County Jurisdiction: replace “your barricade” with “you have Block.”
- Catch and Release: display a level-specific resolved-threat verb instead of always saying “relocate spirits.”
- Closing Time: display “stabilize” or the level-specific threat-resolution verb instead of always saying “seal the rift / relocate spirits.”

Level-specific content that must move out of the shared rules file:

- Incident names, damage sequence and incident artwork.
- Scene target labels and target projection groups.
- Tutorial, loss and victory prose mentioning the parking lot, sinkhole, barricade, generator or ghost alligators.
- The objective nouns shown beside Stability and remaining threats.

## Recommended Level 2 interpretation

- Keep the visible term Stability: repairs and grounded equipment help seal the windmill tunnel, which is the final hole.
- Keep spirits as spirits: three haunt the course, with the windmill their main manifestation. Relocation removes them; there are not three separate cursed holes.
- Block protects the crew and still expires after the incident. The haunted windmill is a hazard, not a defense target.
- Power means the pump shack circuit is running; it can improve repairs while increasing Chaos.

This preserves every character’s identity and every tested card interaction while allowing each stage to feel mechanically specific through labels, incidents, art and target animation.
