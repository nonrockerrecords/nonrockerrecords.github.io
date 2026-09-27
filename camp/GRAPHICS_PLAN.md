# Camp Kanahoma Graphics Review and Production Plan

## Current State

The `camp` folder contains one main splash page and many concept variants. The strongest existing visual assets are:

- `assets/img/kanahoma-camp-stories-booth.jpg`: production-quality booth scene with clear camp, claw machine, store, and brand context.
- `assets/img/kanahoma-camp-stories-banner.jpg`: clean branded campaign panel art, useful for texture and secondary sections.
- `Kanahoma-BOOTH-Go Boldering-v1.jpg`: polished mountain/campaign direction that could support a second A/B concept.
- `assets/svg/claw-machine.svg`: good concept, but the inlined versions are more refined than the standalone SVG.
- `assets/svg/campfire-scene.svg`, `pine-tree.svg`, `creatures.svg`, `werewolf*.svg`: useful prototype art, but not yet a cohesive production illustration system.

The main campaign goal is now clear: newsletter signup first, then reveal a code for a free company-store item.

## Implemented Generated Assets

- `assets/img/booth-hero-v2-generated.png`: improved production hero source with warmer camp lighting, forest depth, and stronger left-side overlay space.
- `assets/img/booth-hero-v2-web.jpg`: optimized desktop hero now used by `index.html`.
- `assets/img/booth-hero-v2-mobile.jpg`: optimized mobile crop focused on the claw-machine/store area, now used by `index.html`.
- `assets/img/social-preview-v2.jpg`: optimized Open Graph / Twitter card crop from the v2 booth scene, now used by `index.html`.
- `assets/img/booth-claw-detail-v2.jpg`: updated proof-section crop focused on the Grab Your Swag claw machines, now used by `index.html`.
- `assets/img/booth-store-detail-v2.jpg`: updated proof-section crop focused on the company-store shelf, now used by `index.html`.
- `assets/img/kanahoma-camp-stories-booth-v2.jpg`: optimized wide booth background for traditional/chaotic concept pages.
- `index-booth-tour.html` now uses `assets/img/kanahoma-camp-stories-booth-v2.jpg` for the hotspot tour while retaining the original booth photo for rollback/reference.
- `assets/img/kanahoma-camp-stories-banner-v2-generated.png`: generated production banner source for the campaign story visual.
- `assets/img/kanahoma-camp-stories-banner-v2.jpg`: optimized campaign banner now used by traditional/chaotic concept pages.
- `assets/img/camp-store-pass-v2-generated.png`: improved production voucher source with richer paper texture and print finish.
- `assets/img/camp-store-pass-v2-web.jpg`: optimized pass graphic now used by `index.html`.
- `assets/img/camp-store-pass-generated.png`: original generated voucher source.
- `assets/img/camp-store-pass-web.jpg`: previous optimized production voucher retained for rollback.
- `assets/img/prize-capsule-key.png`: original generated capsule on chroma-key background.
- `assets/img/prize-capsule-generated.png`: transparent capsule source created from the generated image.
- `assets/img/prize-capsule-web.png`: optimized transparent production capsule used by `index.html`.
- `assets/img/booth-hero-desktop.jpg`: previous desktop hero crop from the booth render, retained for rollback.
- `assets/img/booth-hero-mobile.jpg`: previous mobile hero crop focused on the claw-machine offer, retained for rollback.
- `assets/img/booth-claw-detail.jpg`: previous detail crop for the "Grab Your Swag" proof section, retained for rollback.
- `assets/img/booth-store-detail.jpg`: previous detail crop showing company-store items, retained for rollback.
- `assets/img/social-preview-generated.png`: original generated social preview source.
- `assets/img/social-preview.jpg`: previous optimized Open Graph / social preview image, retained for rollback.
- `assets/img/favicon-capsule.png`: campaign favicon generated from the capsule graphic.
- `assets/img/werewolf-hero-generated.png`: original generated hero source inspired by the werewolf SVG silhouettes.
- `assets/img/werewolf-hero-web.jpg`: optimized experimental hero image for a flashlight/night-camp concept.
- `assets/img/claw-machine-hero-generated.png`: original generated claw-machine campaign hero source.
- `assets/img/claw-machine-hero-web.jpg`: optimized production claw-machine hero image with left-side negative space for live HTML copy.
- `assets/img/campfire-chaos-inferno-generated.png`: original generated inferno/bonfire source with enhanced demon silhouettes.
- `assets/img/campfire-chaos-inferno-web.jpg`: optimized scroll-intensifying background layer for `index-campfire-chaos.html`.
- `assets/img/campfire-scene-v2-generated.png`: generated production raster inspired by `assets/svg/campfire-scene.svg`.
- `assets/img/campfire-scene-v2-web.jpg`: optimized campfire background now used by `assets/css/main.css`.
- `assets/img/claw-machine-v2-generated.png`: generated production raster inspired by `assets/svg/claw-machine.svg`.
- `assets/img/claw-machine-v2-web.jpg`: optimized standalone claw-machine asset retained for static hero/feature use.
- `assets/img/forest-creature-v2-generated.png`: generated production raster inspired by `assets/svg/creatures.svg`, `werewolf.svg`, and `werewolf-stalker.svg`.
- `assets/img/forest-creature-v2-web.jpg`: optimized night forest creature background now used by `index-flashlight.html` and `assets/css/flashlight.css`.

## Implemented SVG Improvements

- `assets/svg/pine-tree.svg`: rebuilt as a polished layered evergreen asset.
- `assets/svg/claw-machine.svg`: rebuilt as a standalone production-quality claw-machine illustration, now with self-contained marquee, claw idle, glass-sheen, capsule, and reduced-motion animation.
- `assets/svg/campfire-scene.svg`: added title and description metadata.
- `assets/svg/creatures.svg`: added sprite metadata and shared production styling while preserving symbol IDs.
- `assets/svg/werewolf.svg`: added accessible metadata and cleaned rough comments.
- `assets/svg/werewolf-stalker.svg`: added accessible metadata and cleaned rough comments.

## Page Review

### `index.html`

Role: primary production splash page.

Current graphic direction:
- Uses the booth photo as the hero image.
- Dark overlay makes copy readable.
- Form panel and code card create a direct conversion flow.

Upgrade plan:
- Done: create deliberate booth crops for desktop hero, mobile hero, claw detail, and store detail.
- Done: add a generated custom "camp store pass" graphic that feels like a real voucher, not just a box.
- Done: add a generated prize capsule visual near the code reveal.
- Done: replace plain radial overlay with branded string-light and warm camp-glow treatment.
- Done: add responsive art-direction crops so mobile shows the claw/store area instead of a generic busy booth crop.

### `index-newsletter.html`

Role: playful claw-machine signup prototype.

Current graphic direction:
- Strong interaction concept.
- Claw machine is charming and on-brand.
- Visual density is high.
- `assets/img/claw-machine-hero-web.jpg` can now replace decorative prototype framing if this page becomes a higher-polish campaign variant.
- `assets/svg/claw-machine.svg` is now suitable as a reusable animated component for non-interactive placements.

Upgrade plan:
- Merge the best claw-machine animation ideas into the primary splash flow only if they do not slow signup.
- Redraw the machine once as a clean, reusable SVG component.
- Use the claw animation after form submission as optional delight, not as a barrier to seeing the free-item code.
- If this page stays active, update the modal reward to the current free-item offer and use live HTML for all offer/code text.

### `index-newsletter-pure.html`

Role: refined editorial newsletter variant.

Current graphic direction:
- Cleaner than the claw version.
- Includes a modal code reveal.
- Less tied to the physical booth than the new main page.

Upgrade plan:
- Mine this page for the best code modal and copy-to-clipboard treatment.
- Replace "10% off" messaging with the free-item offer so it matches the campaign objective.
- Keep as a lower-motion fallback if the claw-machine version feels too arcade-like.

### `index-bouldering.html` and `index-bouldering-topo.html`

Role: alternate campaign direction.

Current graphic direction:
- "Go Bold(ering)" mountain art is polished and distinctive.
- The topo version has the richest campaign worldbuilding.

Upgrade plan:
- Treat as A/B concept B, not part of the primary free-item splash unless the campaign changes theme.
- If used, create one production mountain hero, a route-map signup card, and a summit prize reveal.
- Avoid mixing bouldering graphics with Camp Stories/claw-machine graphics on the same landing page.

### `index-booth-tour.html`

Role: interactive booth explainer.

Current graphic direction:
- Uses the real booth image well.
- Hotspot concept can explain physical campaign elements.

Upgrade plan:
- Convert into a secondary "how it works" section or hidden detail page.
- Design custom hotspot pins that match the booth signage.
- Crop and annotate the claw machines and store shelf for the free-item offer.

### `index-chairs.html`, `index-campfire-scroll.html`, `index-stories.html`

Role: storytelling/case-study experiences.

Current graphic direction:
- Campfire metaphor is strong but mostly CSS/SVG prototype art.

Upgrade plan:
- Develop one polished campfire illustration system: fire, chairs, trees, rug/topo pattern, lantern glow.
- Reuse that system across testimonials, story cards, and footer, instead of maintaining one-off illustrations per page.
- Keep motion subtle and optional.

### `index-campsite.html`, `index-yourstory.html`

Role: lead qualification and user-input concepts.

Current graphic direction:
- Good funnel ideas, but visually dependent on generic camp UI patterns.

Upgrade plan:
- Create illustrated "gear cards" for AOR, Brand, Consulting, and Story Challenge.
- Use a map/checklist visual language that can also support email nurture content.

### `index-daynight.html`, `index-flashlight.html`, `index-campfire-chaos.html`, `index-chaotic.html`

Role: experimental mood pieces.

Current graphic direction:
- Memorable, but too much for the main conversion page.
- `assets/img/forest-creature-v2-web.jpg` is now the stronger generated hero/background option for the flashlight/night-camp branch.
- `index-flashlight.html` now uses `assets/img/forest-creature-v2-web.jpg` as an atmospheric background layer behind the interactive flashlight scene.

Upgrade plan:
- Pull only selected details: star field, lantern glow, flashlight reveal, animated underlines.
- Do not productionize the scary/chaotic direction for the newsletter/free-item campaign unless it becomes a deliberately weird microsite.
- If the forest-creature hero is used for a conversion page, keep newsletter/signup copy in live HTML over the negative space rather than adding text to the image.

### `404.html`

Role: utility brand moment.

Current graphic direction:
- "Wandered off the trail" works.

Upgrade plan:
- Use the same polished trail/campfire asset system created for the primary campaign.
- Add a small store/newsletter CTA once the main splash page is final.

## Recommended Production Graphics System

### Primary Campaign: Camp Store Pass

Use the existing Camp Stories booth as the anchor. Build these assets:

1. Hero booth art crop
   - Desktop: wide booth crop with text on dark left overlay.
   - Mobile: portrait crop centered on the claw machines and store shelf.

2. Free item pass
   - Voucher/ticket graphic with dashed edge, "Camp Store Pass", and "Free Item Code".
   - Should be usable in hero form, success state, and social preview.

3. Prize capsule
   - Small capsule badge for code reveal.
   - Can be SVG for production; no image generation needed.

4. Store shelf detail
   - Cropped bitmap from booth image or generated clean product shelf image if needed later.
   - Use near "what you get" or in the success state.

5. Camp pattern kit
   - Pine silhouettes, string lights, topo/rug pattern, lantern glow.
   - Keep as CSS/SVG so pages remain fast.

### Secondary A/B Campaign: Route to the Summit

Use only if a second variant is needed:

1. Mountain hero crop from `Kanahoma-BOOTH-Go Boldering-v1.jpg`.
2. Route-map signup form.
3. Summit flag/code reveal.
4. Climbing hold icon set for benefits.

## Image Generation Guidance

Avoid image generation until the layout and asset list are locked. To reduce rate-limit friction:

- Prefer cropping and editing existing booth assets first.
- Use SVG/CSS for passes, capsules, icons, pins, and decorative patterns.
- Batch any generated-image requests into a small set: hero crop enhancement, product/store shelf, and social preview.
- If image generation fails due to rate limits, retry later with the same prompt and keep working on SVG/CSS assets meanwhile.

## Deferred Image Generation Queue

Status: pending by request, to conserve usage.

When ready, generate only one small group at a time and save accepted outputs into `camp/assets/img/`.

1. Bouldering A/B hero
   - Consumer: `index-bouldering.html` or `index-bouldering-topo.html` if retained.
   - Prompt direction: polished mountain route campaign art with warm Kanahoma camp palette, wide layout, no readable text, space for live HTML copy.
   - Decision needed first: keep bouldering as an A/B page or archive it.

2. Topo summit reward visual
   - Consumer: `index-bouldering-topo.html` modal or reward section.
   - Prompt direction: tactile summit pass or route-map prize card, premium printed-paper texture, no fake UI, exact reward text handled in HTML.
   - Decision needed first: confirm whether this page should reveal `CAMPFREE`.

3. Booth-tour hotspot badges
   - Consumer: `index-booth-tour.html`.
   - Prompt direction: small branded camp-map pins/badges inspired by the booth signage, generated as raster concepts only if SVG badges are not enough.
   - Decision needed first: whether the booth tour becomes a secondary "how it works" page.

4. Campfire story system
   - Consumer: `index-chairs.html`, `index-campfire-scroll.html`, and `index-stories.html`.
   - Prompt direction: cohesive illustrated campfire scene elements for testimonial/story pages, no scary mood, reusable warm lighting.
   - Decision needed first: choose one shared campfire visual system instead of one-off page art.

## Next Implementation Pass

1. Add real ESP/newsletter endpoint details when available.
2. Confirm the final Shopify/company-store URL and production discount/free-item code.
3. Run a browser review on desktop and mobile when the in-app browser or local Playwright is available.
4. Resume page review at `index-bouldering.html` and `index-bouldering-topo.html`.
