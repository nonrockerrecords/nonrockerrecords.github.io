# Camp Kanahoma Splash Page Launch Notes

## Production Page

Use `camp/index.html` as the live splash page.

The page currently supports:

- Newsletter signup intent.
- Email validation.
- Free item code reveal.
- Copy-to-clipboard fallback.
- Company-store link.
- Responsive desktop/mobile hero images.
- Production campaign graphics for the hero, social preview, store pass, reward capsule, proof details, and concept-page backgrounds.

## Values To Replace Before Launch

- Store URL: `https://kanahoma-shop.myshopify.com`
- Store code: `CAMPFREE`
- Newsletter endpoint: add the real ESP/API POST in `assets/js/splash.js`
- Open Graph image/domain path if the page is deployed outside the current static folder.

## Suggested Signup Flow

1. Visitor enters email.
2. Client posts email to ESP or a serverless endpoint.
3. Server confirms subscription or double-opt-in request.
4. Page reveals `CAMPFREE` or a generated per-user code.
5. Visitor clicks through to the company store.

## Store Code Options

- Static code: easiest to launch, but can be shared.
- Per-subscriber code: best for attribution and abuse prevention.
- Expiring code: useful if the campaign should drive urgency.

## Current Production Assets

- `assets/img/booth-hero-desktop.jpg`
- `assets/img/booth-hero-mobile.jpg`
- `assets/img/booth-claw-detail.jpg`
- `assets/img/booth-store-detail.jpg`
- `assets/img/camp-store-pass-web.jpg`
- `assets/img/prize-capsule-web.png`
- `assets/img/booth-hero-v2-web.jpg`
- `assets/img/booth-hero-v2-mobile.jpg`
- `assets/img/social-preview-v2.jpg`
- `assets/img/booth-claw-detail-v2.jpg`
- `assets/img/booth-store-detail-v2.jpg`
- `assets/img/camp-store-pass-v2-web.jpg`
- `assets/img/kanahoma-camp-stories-booth-v2.jpg`
- `assets/img/kanahoma-camp-stories-banner-v2.jpg`
- `assets/img/campfire-scene-v2-web.jpg`
- `assets/img/forest-creature-v2-web.jpg`

The non-v2 JPGs above are retained for rollback/reference. Use the v2 files for active pages unless a specific A/B rollback is desired. Keep the larger generated source files in `assets/img` only if they are useful for future edits.
