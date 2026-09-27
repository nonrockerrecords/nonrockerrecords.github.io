# Florida Man — approved visual direction

## Anchor

Use approved-style-preview.png as the composition and style anchor. It shows the target relationship between illustration, miniature geometry, lighting and card interaction. It is a flat concept image, not evidence of a working 3D renderer.

**Painted pulp caricatures in a handcrafted supernatural Florida diorama.** Adult comic absurdity, with affection for the locals. Strange events are real; characters respond with weary professional confidence. No graphic horror.

## Character shape language

- Heads noticeably oversized; short or elongated bodies chosen per character, not one shared mascot proportion.
- Strong angular shadow masses, confident outline accents, broad painted strokes, restrained paper texture.
- Expressions readable at gameplay size. No photographic pores, smooth realistic faces, glossy toy skin or cute chibi proportions.
- Darlene: short, broad, enormous blonde beehive, angular dark cat-eye glasses, protruding skeptical lower lip, pointed gesture, oversized iced coffee, orange safety vest and floral shirt.
- Gator Ron: tall and wiry, long nose, huge drooping mustache, aviators, olive deputy uniform, exaggerated gloved hands, uneasy stop gesture.
- The Manager: sturdy squat shape, huge messy dark bun, arched brow and half-lidded stare, cocked hip, teal uniform with mustard checker trim, oversized coffee pot.
- Keep hands and signature equipment distinct from bodies. Do not cut off hair, fingers, tools or feet.

## Standees

Each production source is a complete flat painted character cutout with transparent surroundings, no scenery, cast shadow or base baked into the art. Build the shallow cream edge, base and floor shadow in 3D. Begin with one idle pose per character; animate the standee as a rigid object. Generate action/reaction poses only after their need is established in play.

Use near-frontal three-quarter poses matching a limited gameplay camera. Establish one consistent relative scale: Darlene broad, Ron tallest, Manager compact. Avoid orbiting far enough to expose flat characters edge-on. A later rear surface can use a simple deliberately painted backing rather than a mirrored face.

## World

Actual sculpted 3D ground, sinkhole, building facade, palms, barricade and generator. Materials resemble painted wood, clay, card and weathered miniatures. Chunky readable geometry, subtly crooked construction, restrained small detail. Warm sunset from upper left; mint light from the sinkhole. Strong grounded shadows.

The background is lower contrast than the crew and targets. Preserve a quiet foreground for the card hand. Diagonal scene depth should lead attention from crew through barricade to the sinkhole. Focused animation: ghost orbit, levitating permit sheets, neon flicker and occasional palm sway.

## Palette

| Color | Role |
| --- | --- |
| Swamp teal #143F3D | World shadows, tabletop, card frames |
| Sun-bleached cream #ECE0C2 | Paper, cut edges, readable type |
| Faded coral #DC786D | Buildings and secondary surfaces |
| Mustard gold #DCA83E | Warm light, selection, key accents |
| Safety orange #ED782E | Darlene and physical barriers |
| Spectral mint #75E8CB | Supernatural entities and sinkhole |

These are starting design tokens; test actual contrast in the UI. Selection and valid targets must also have shapes/labels, not color alone.

## Cards and UI

Physical card thickness, matte printed surface, restrained corner wear. Generated illustrations occupy a defined artwork window. Names, costs, descriptions and counters are rendered separately from art and driven by the rules data. Never bake mutable stats or fake UI text into generated images.

Selected card rises modestly; cost and target preview stay visible. Gameplay camera avoids cutting off the card hand. On narrow screens show readable cards in a horizontal tray and open a large inspection panel. Clicking/tapping a card and target must perform every action that dragging supports.

## Motion

Direct input feedback should begin immediately. Illustrative timing targets: hover 100–150 ms; card lift 150–250 ms; ordinary action 400–700 ms. Important effects can run longer but should be skippable. The rules resolve once and emit presentation events; animation never determines the result. Reduced motion removes camera swoops, shaking and continuous decorative movement.

## Fresh generation policy

Original cards inform written descriptions only. Generate new poses and compositions. Do not use the original files, inspection contact sheets or earlier realistic portrait as inputs or game art. Character briefs explicitly prohibit photo realism. A new prompt should specify subject, pose, silhouette, medium, palette, transparent/background requirements, intended crop, and avoid list.

Use the available built-in image tool. It exposes no explicit model selector; never label outputs highest-model-verified. A named-model requirement needs a tool/API route that actually exposes that control.

## Acceptance

Inspect at full size and at the intended game size. Reject indistinct silhouettes, mismatched proportions, broken hands, cropped hair/equipment, unwanted text, photographic faces and backgrounds that compete with targets. Inspect transparent edges against both light and dark surfaces. Verify consistent lighting and standee scale in the real renderer before expanding the asset set.
