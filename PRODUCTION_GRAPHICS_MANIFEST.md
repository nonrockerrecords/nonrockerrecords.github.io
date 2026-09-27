# Production Graphics Manifest

This tracks production-grade raster/vector upgrades made with the production-image-batch workflow.

## Active v2 Replacements

- `logo-draft-01-pixel-merch-v2.jpg`: cleaned arcade/pixel Nonrocker logo lockup, now used by `epk-arcade.html`.
- `logo-draft-02-win95-titlebar-v2.jpg`: cleaned Win95-style Nonrocker system-error lockup, now used by `epk-arcade.html`.
- `camp/assets/img/kanahoma-camp-stories-booth-v2.jpg`: production booth scene now used by the main camp concept backgrounds and the booth-tour hotspot page.
- `camp/assets/img/booth-hero-v2-web.jpg`: optimized camp main-page desktop hero.
- `camp/assets/img/booth-hero-v2-mobile.jpg`: optimized camp main-page mobile hero crop.
- `camp/assets/img/social-preview-v2.jpg`: optimized camp Open Graph / Twitter image.
- `camp/assets/img/booth-claw-detail-v2.jpg`: optimized proof-section claw-machine crop.
- `camp/assets/img/booth-store-detail-v2.jpg`: optimized proof-section store crop.
- `camp/assets/img/kanahoma-camp-stories-banner-v2.jpg`: optimized story/banner visual for camp concept pages.
- `camp/assets/img/camp-store-pass-v2-web.jpg`: optimized free-item pass graphic.
- `camp/assets/img/campfire-scene-v2-web.jpg`: generated production campfire background replacing the large SVG scene.
- `camp/assets/img/forest-creature-v2-web.jpg`: generated production night-forest creature background for the flashlight concept.
- `camp/assets/img/campfire-chaos-inferno-web.jpg`: generated production inferno background for the campfire chaos concept.
- `camp/assets/img/claw-machine-v2-web.jpg`: generated standalone production claw-machine raster retained for static feature/hero use.

## Active Production SVGs

- `camp/assets/svg/Kanahoma_logo_Green.svg`: retained as a scalable brand mark and updated with SVG-level metadata.
- `camp/assets/svg/Kanahoma_Logo_White.svg`: retained as a scalable brand mark and updated with SVG-level metadata.
- `camp/assets/svg/pine-tree.svg`: retained as a lightweight repeated decorative vector with title/description metadata.
- `camp/assets/svg/claw-machine.svg`: retained as the interactive/vector claw-machine component; static raster counterpart is `camp/assets/img/claw-machine-v2-web.jpg`.
- `camp/assets/svg/campfire-scene.svg`: retained as a vector source/reference; large-scene usage now points to `camp/assets/img/campfire-scene-v2-web.jpg`.
- `camp/assets/svg/creatures.svg`, `camp/assets/svg/werewolf.svg`, `camp/assets/svg/werewolf-stalker.svg`: retained as symbol/reference assets; production raster counterpart is `camp/assets/img/forest-creature-v2-web.jpg`.

## Retained Source Or Rollback Assets

- `logo-draft-01-pixel-merch.jpg`: earlier pixel-merch logo draft retained for rollback/reference.
- `logo-draft-02-win95-titlebar.jpg`: earlier Win95 titlebar logo draft retained for rollback/reference.
- `camp/assets/img/kanahoma-camp-stories-booth.jpg`: original booth render/photo retained for rollback/reference.
- `camp/assets/img/booth-hero-desktop.jpg`, `camp/assets/img/booth-hero-mobile.jpg`, `camp/assets/img/booth-claw-detail.jpg`, `camp/assets/img/booth-store-detail.jpg`, `camp/assets/img/social-preview.jpg`, `camp/assets/img/camp-store-pass-web.jpg`, `camp/assets/img/kanahoma-camp-stories-banner.jpg`, `camp/assets/img/werewolf-hero-web.jpg`, `camp/assets/img/claw-machine-hero-web.jpg`: earlier web exports retained for rollback/reference where no active HTML/CSS/JS usage remains.
- `camp/Kanahoma-BOOTH-Camp Stories-v2.jpg`, `camp/Kanahoma-BOOTH-Go Boldering-v1.jpg`, `camp/Kanahoma-Camp Stories-Mockup-v2.jpg`, `camp/Kanahoma-Go Boldering-Mockup-v1.jpg`: source/mockup JPGs retained for reference and future A/B direction.

## Notes

- Exact-text logo assets were upgraded through deterministic rendering to avoid generated text artifacts.
- Brand logos in `camp/assets/svg` remain SVG because they are sharper and more appropriate as scalable brand marks.
- No `.jpeg` or `.webp` files are present in the current tree as of this audit.
- Decorative `pine-tree.svg` usages now use empty `alt` plus `aria-hidden="true"` where they are not meaningful content.
