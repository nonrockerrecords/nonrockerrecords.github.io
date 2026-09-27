# Pets & Questionable Souvenirs — first playable pass

This document records the earlier shared 18-card expansion pass. New encounters now use the six-character pick-three system: each selected local contributes a four-card mini-deck, for 12 cards total. The tutorial stays on the original trio and exact instructional order. Existing 18-card saves still migrate without changing their deck.

The six shared cards below remain supported for legacy saves. The active roster system uses the character-owned signature variants recorded in `game/artwork/crew-roster.json`.

| Card | Effect | Lifecycle |
| --- | --- | --- |
| Emotional Support Possum | Cancels the next Chaos surge, including its damage and Liability. Chaos still resets by 6. Does not block normal attacks. | Card exhausts; companion leaves when protection triggers. |
| Rhinestone Chihuahua | Distracts spirits for Catch and Release this turn; +1 Chaos. | Card exhausts; companion remains for Pool Noodle synergy. Distraction expires normally. |
| Pool Noodle of Protection | 2 Block alone; 4 with any active companion. Total Block cap remains 4. | Normal discard and reshuffle. |
| Gas Station Crystal | 3 Stability (+1 while generator is on), +1 Chaos. | Normal discard and reshuffle. |
| Iguana in the Fuse Box | If generator is off: turn it on, +3 Chaos. If on: gain exactly 3 Stability and turn it off. | Exhaust. The shutdown effect does not receive its own generator bonus. |
| Haunted Lawn Flamingo | After each of the next two incidents, gain 2 Stability (+1 while powered), if the crew survived. | Card exhausts; companion leaves after the second boost. |

Companion status badges appear above the hand. Exhausting a card does not remove its ongoing companion effect. Flamingo resolves after incident damage and Chaos surge checks, but before the final-turn deadline. It cannot revive a defeated crew. Possum protection resolves before a victory check, consistent with existing Chaos ordering.

## Art and UI

Six new text-only built-in generations; no original graphics supplied. Rich painted-pulp illustrations share turquoise backgrounds, coral pink, cream and gold accents. PNG masters are in `game/artwork/deck-masters`; optimized runtime WebPs in `game/public/assets/cards`. Full prompts and review status are in `game/artwork/deck-expansion.json`.

The deck gallery explains all six cards without requiring them to be drawn. Existing three crew standees are unchanged. Companions currently appear as illustrated status badges, not additional 3D standees.

## Verification and balance

26 automated tests pass, covering all six effects, companion expiry, fatal surge ordering, old-save migration, expanded-save round trips and card conservation. Browser verified a shuffled expanded hand, flamingo activation, Crystal play, an incident boost, and reload/resume with the active countdown retained.

This is a first balance pass, not a validated win-rate target. The expanded deck is less consistent than the tutorial. Next playtesting should assess whether two early defensive draws feel useful and whether companions are drawn early enough to justify their cost.
