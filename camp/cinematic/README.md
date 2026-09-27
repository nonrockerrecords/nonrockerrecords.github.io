# Camp Kanahoma — fresh collection

This is a new static campaign collection. The original camp pages are preserved; the original variations gallery now links here.

## Open locally

From this directory, run `node tools/serve.mjs` and visit:

- `http://127.0.0.1:8799/camp/cinematic/`
- `http://127.0.0.1:8799/camp/cinematic/claw-3d/`
- `http://127.0.0.1:8799/camp/cinematic/claw-arcade/`
- `http://127.0.0.1:8799/camp/field-guide/`
- `http://127.0.0.1:8799/camp/surreal/`

Use HTTP, not file://, for JavaScript modules and game textures. No backend is required. Nothing has been deployed.

## Build and maintenance

`npm ci` installs the exact locked dependencies. `npm run build` regenerates HTML, bundles the engines, and copies shared scripts/styles to the two standalone landing folders. The checked-in browser bundles run without installing Node on the host.

`tools/pages.mjs` is the HTML source for all new pages. `assets/site.css` is the shared design system. `src/core.mjs` contains the common fixed-step round and catch rules; `src/cabinet.mjs` and `src/arcade.mjs` implement their renderers and physics. `assets/claim.js` remains independent of bundles for failure resilience.

On Windows sandboxes that disallow compiler child processes, the equivalent build can be run directly:

```powershell
node tools/pages.mjs
& '.\node_modules\@esbuild\win32-x64\esbuild.exe' src/cabinet.mjs src/arcade.mjs src/site.mjs --outdir=assets/dist --bundle --minify --format=esm --splitting --target=es2022 --metafile=assets/dist/meta.json --legal-comments=linked
node tools/sync.mjs
```

## Gameplay

3D: arrows/WASD move in two axes, Space or Drop starts a round. Touch users have a joystick and direction buttons. Front/angled camera presets clarify depth.

2.5D: arrows/A/D move horizontally. Time the drop against visible claw sway. Both games use physical loose capsules with a deterministic, generous grip envelope. Covered capsules are excluded. A valid closure attaches one capsule for reliable transport; no random win odds are used. Misses permit unlimited retries. Restock resets the pile.

Pause freezes the game. Offscreen or hidden games stop advancing physics. Audio is off by default. Reduced motion removes decorative animation while retaining motion necessary to play; Skip game and claim always remains available.

## Artwork

`artwork/manifest.json` contains all 16 full text prompts, source paths, intended use, review, status, and web file sizes. Original campaign artwork was reviewed only; none was supplied to image generation or reused in new pages. Official logo files are the sole existing graphic exception. Original generated PNGs and optimized WebP files are stored locally under each direction's `assets/generated/` folder. The cabinet/arcade previews are screenshots of the new game renderers.

`tools/assets.mjs` rebuilds web derivatives from accepted built-in generations. The source mapping is in `artwork/accepted.json`; keep project-local PNGs when sharing this project because the generator's source paths are machine-specific. The first demon-bonfire request failed due to a connection error; a text-only retry succeeded. No CLI/API image fallback was used.

## Demo boundaries

Email input is validated locally, immediately cleared on success, never persisted, and never transmitted. `DEMO-CAMP` is not a redeemable code. Store links point to the existing company store. No actual subscriptions, payment, prizes, or sending of visitor stories is implemented. Illustrative content is labeled rather than presented as client evidence.

## Verification

`npm test` runs mechanics tests. `npm run verify` checks local references, matching original page counterparts, and artwork coverage. `node tools/browser-check.mjs --full` exercises real keyboard/pointer gameplay, claims, failure handling, and all pages at desktop/mobile widths using locally installed Edge. Browser screenshots and JSON results are under `verification/`. See `verification/REPORT.md` for the final review and device limitations.

Fonts use the approved DM Sans and Sacramento families via Google Fonts with system fallbacks. The official SVG wordmark remains unchanged.
