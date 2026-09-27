# Camp Page Review

This tracks the one-by-one page review for the `camp` folder. The production target remains `index.html`: a splash page that signs visitors up for the newsletter and reveals a free company-store item code.

## 1. `index.html` - Production Splash

Status: strongest current page.

What works:
- Clear newsletter signup goal.
- Free item code reveal is immediate after valid email entry.
- Generated voucher, capsule, and social preview graphics are in place.
- Desktop/mobile booth crops are targeted to the campaign.
- Store shelf and claw-machine detail crops support the offer.

Next improvements:
- Browser review on desktop and mobile when tooling is available.
- Replace placeholder `CAMPFREE` and Shopify URL with production values.
- Connect the signup form to the actual ESP or serverless endpoint.

## 2. `index-newsletter.html` - Playful Claw-Machine Concept

Status: concept/demo.

What works:
- The claw-machine interaction is memorable and directly related to the booth.
- Good candidate for a post-submit delight moment or campaign variant.

Issues:
- It still carries older encoding artifacts in visible copy.
- It uses a large inlined claw-machine SVG rather than the cleaned shared SVG.
- It reveals a signup confirmation, not the current free-item code offer.
- The animation should not delay access to the code on the production page.

Recommended direction:
- Keep as an A/B or demo page.
- Update copy to the free-item offer if it remains linked.
- Replace older inline SVG color syntax with the production `assets/svg/claw-machine.svg` style if the animation is rebuilt.

## 3. `index-newsletter-pure.html` - Editorial Signup Concept

Status: concept/demo with useful code-reveal patterns.

What works:
- Cleaner editorial layout than the playful claw-machine version.
- Prize modal and copy-to-clipboard pattern are useful.

Issues:
- Still uses old `10% off` messaging, which conflicts with the current free-item objective.
- Contains visible encoding artifacts.
- The inlined claw SVG repeats older nonportable SVG color syntax.

Recommended direction:
- Convert the prize modal to `FREE ITEM` / `CAMPFREE` if this page stays in the set.
- Reuse the generated capsule graphic instead of inline capsule SVG art.
- Consider this the lower-motion fallback concept.

## 4. `index-booth-tour.html` - Booth Explainer

Status: useful supporting page.

What works:
- The real booth image is the strongest visual proof asset.
- Hotspots are a natural way to explain the claw machines, store shelf, campfire, and story wall.

Issues:
- It explains the booth broadly instead of supporting the newsletter/free-item conversion.
- Hotspot buttons are generic circles and could look more like branded pins or camp badges.
- Copy should direct visitors back to the production splash after exploring.

Recommended direction:
- Reframe as "How the camp store pass works."
- Make the claw-machine and store-shelf hotspots primary.
- Add a persistent CTA back to `index.html#signup`.

## 5. Remaining Pages

Paused here to conserve usage. Resume with the bouldering pair first, then continue one page at a time.

Pending resume steps:
- Review `index-bouldering.html` and `index-bouldering-topo.html` together.
- Decide whether the bouldering direction is an A/B concept or a demo archive item.
- Align any kept bouldering offer copy with the current `CAMPFREE` free-item campaign.
- Record specific generated-image ideas before making image calls.
- Defer image generation until the page direction is approved.

Review next in this order:

1. `index-bouldering.html`
2. `index-bouldering-topo.html`
3. `index-chairs.html`
4. `index-campfire-scroll.html`
5. `index-stories.html`
6. `index-campsite.html`
7. `index-yourstory.html`
8. `index-daynight.html`
9. `index-flashlight.html`
10. `index-chaotic.html`
11. `index-campfire-chaos.html`
12. `index-traditional.html`
13. `404.html`

For each page, decide whether it is:
- A production candidate.
- An A/B concept.
- A supporting page.
- A demo archive item.
