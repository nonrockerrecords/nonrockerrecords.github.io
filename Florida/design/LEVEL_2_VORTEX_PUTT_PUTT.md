# Level 2 — Vortex Putt-Putt

Status: playable standalone encounter, connected September 25. Original Level 1 and approved source artwork are preserved.

Play: http://127.0.0.1:8791/?level=2
Art/motion study remains separately available at the preview link below.

## Gameplay integration

- Same rules engine, six-character roster and 18-card normal deck; no mini-golf-specific replacement cards.
- Win by 12 Stability or rehoming three spirits before five turns expire. Fatal Chaos surges still precede victory.
- Threat maps to the windmill, power to the pump, and defense to crew protection. Legacy target IDs are retained for compatibility; `TARGET_ROLES` documents their stage-independent meaning.
- Dedicated five-incident sequence retains Level 1's tested damage/Chaos pacing. Course newspaper reports currently reuse approved windmill art, not bespoke event illustrations.
- Real Stability drives the ball; Chaos drives blade irregularity; resolution stops the blades. Rehoming releases small dedicated haunted-golf-ball spirits—cream dimpled heads with mint tails—from the tunnel. Dynamic mint light weakens as spirits leave; original painted glow remains in the art.
- Selected crew appears on stage. Power lights the pump. Card targets are automatically marked, preserving one-click Play Card confirmation.
- Separate `florida-man-vortex-v1` save key. Existing county saves remain untouched and saves without a level ID migrate to county. Reload/resume does not replay prior spirit departures.
- Playable Level 2 uses a tighter 0.91 camera-fit margin so its diorama fills the board comparably to Level 1; the standalone art study retains its original 1.07 inspection margin.
- Tests: 33 pass, including all 20 crew combinations across both encounters, both wins, deadline/fatal-surge defeat, legacy save migration, and companion restoration. Browser verified normal deck, pump targeting, 2-spirit relocation, incident report and reload/resume.

Preview: http://127.0.0.1:8791/level2-preview.html

## Current composition

A shallow cardboard theatre stage, viewed at roughly 16 degrees downward rather than from above. The visible green is supporting scenery; crew and haunted windmill carry the composition.

- Compact salmon-pink platform with a real opening extruded through the top. Green felt sits 0.23 world units below the walkway, with visible inner walls and a thin cream lip.
- Course runs from the foreground tee directly to the windmill at the far-right end. Crew stands on the building side of the green, keeping the lane clear and reducing foreground prominence. The windmill's glowing tunnel IS Hole 18; there is no separate cup, flag, hose or portal effect.
- Approved crew standees are grounded on their cardboard bases and reduced slightly to restore their supporting scale relative to the architecture. Runtime alpha-bound trimming removes padding without modifying source files.
- Clubhouse is enlarged behind the crew and offset left. Complete palms remain in frame.
- Windmill is both the final hole and the primary haunted prop. New blade-free tower faces toward the incoming lane. Separate rotor shares its plane and spins around the painted spindle; lettering is now baked into the clubhouse marquee.
- Pump shack occupies the quieter left edge; the crew stands further back in front of the clubhouse, leaving the green and windmill tunnel visible. One ball provides course context.
- Small teal sunglasses-wearing concrete gator fills the front-right walkway. Decorative only: no target, label, or added mechanic.
- Serpent and mangrove art remain saved but are absent from the opening composition. A serpent appearance can be reserved for an incident.
- Camera fits actual mesh vertices after assets load and whenever its container changes.
- The preview's “Check game layout” control reserves a left objective column to test board readability at reduced width. It is an art-study control, not part of the playable game.

## Encounter concept

**Close the haunted 18th before the course comes alive.**

The windmill's ball tunnel has become a vortex. Its blades turn without wind. Three spirits haunt the attraction, with the windmill as their main visible manifestation. Over five turns, players either gain 12 Stability to seal the tunnel's vortex or relocate its three spirits, while preserving crew Endurance.

Keep shared card terms and meanings: Stability, spirits, Block, power, Actions and Chaos. Previous proposals to rename these Course Control and Curses are superseded. Avoid presenting three independently selectable cursed props until rules explicitly support that mechanic.

The pump circuit supplies power. Defensive cards protect the crew; the windmill is not a safety barrier. The windmill and ball return can visibly misbehave during incidents. Damage, pacing, exact target mapping and progression still require the separate gameplay implementation.

## Implemented artwork and motion study

Four versioned transparent assets generated with built-in imagegen and integrated September 24. Sources and prompt summaries are in `game-paper-diorama/artwork/level-2-refinement.json`; original art is untouched.

- `clubhouse-lettered-v2.png`: VORTEX / PUTT-PUTT fits the existing curved marquee. Removed the old floating text mesh.
- `windmill-tower-v2.png`: complete blade-free facade and left-facing base tunnel.
- `windmill-rotor-v2.png`: separate four-blade sprite. Tower-local pivot (-0.34, 3.15, 0.1); diameter 3.55 units. Preserve rotor canvas center instead of alpha-trimming it.
- `sunglasses-gator.png`: small low decorative cutout, 2.15 x 0.75 units, front-right.
- `haunted-golf-ball-spirit.png`: compact vertical rehoming sprite, 0.72 x 1.08 units, replacing the temporary Level 1 spectral gator.

Preview progress button advances Stability in steps of 3, then resets. A separate Preview rehoming button releases the production golf-ball spirit without changing game state. Ball follows the recessed lane and disappears into the tunnel at 12. Rotor has slow idle movement and an uneven higher-Chaos speed, stopping at sealing victory. Reduced-motion preference freezes blades and moves ball immediately. No actual card rules, saved game, or Level 1 behavior changes.

Gameplay now drives the adapter on the playable page. The preview's progress button remains an isolated art tool. See the integration notes above for lighting and spirit departure behavior; the existing painted glow itself is not dynamically removed.

## Original replacement-art specification (completed)

1. Marquee: edit the approved clubhouse art or supply a matching fitted overlay. Preserve the curved cream face, bulbs, paper edge and surrounding facade. Lettering must fill the actual face in its perspective; current canvas text is a placement guide. Exact text: VORTEX PUTT-PUTT.
2. Windmill tower: transparent cutout facing left toward the green and crew, with blades removed and the hidden facade completed. Preserve chipped coral/turquoise paint and paper edge. The glowing ball tunnel is the final hole and should be prominent at the base, aligned with the incoming lane. Include a clear spindle location.
3. Windmill rotor: separate transparent square image with the complete four-blade assembly, exactly centered on its hub with safe rotation margins. Same viewpoint and paint treatment; no tower or baked shadow. Record hub coordinates and rotor diameter in the asset manifest.
4. Mount rotor slightly forward of the tower on its own Three.js pivot. Keep both under one placement group. Test a full revolution for cropping and unwanted overlaps.
5. Motion proposal: slow uneven idle rotation; stalls, reversals and bursts during incidents; stop on resolution. Reduced-motion preference freezes the rotor and uses a static visual state.

The old whole-windmill image remains saved but is no longer used in the preview. Only the separate rotor turns.

## Verification

Review expanded stage and objective-column views. Check complete palms and rotor sweep, readable faces, unblocked marquee, grounded feet, recessed walls, lane-to-tunnel alignment and asset loading. Run the production build after code changes. No game-rule edits are needed for this composition pass.
