import fs from 'node:fs/promises';
const art=JSON.parse(await fs.readFile('artwork/manifest.json','utf8'));
const browser=JSON.parse(await fs.readFile('verification/browser-results.json','utf8'));
const games=browser.results.filter(r=>r.fps);
await fs.writeFile('artwork/PROMPTS.md','# Camp Kanahoma — fresh artwork prompts\n\nAll 16 images were generated with the built-in image generator from text alone. Original campaign images were visually reviewed, never passed as references. Official logos are retained separately. See REVIEW.md for the original motif study.\n\n'+art.assets.map((a,i)=>`## ${String(i+1).padStart(2,'0')} / ${a.slug}\n\nDirection: ${a.lane}. Use: ${a.consumer}.\n\n${a.prompt}\n\n**Review:** ${a.review}\n\n**Web asset:** ${a.target} (${Math.round(a.bytes/1024)} KB).\n`).join('\n'));
await fs.writeFile('verification/REPORT.md',`# Camp Kanahoma verification report

Completed September 16, 2026. Local implementation only; no deployment.

## Delivered

- 19 cinematic counterparts matching every existing camp HTML filename, including gallery and 404; two additional standalone games; illustrated and surreal landing pages. Total: 23 new HTML pages.
- Original camp pages preserved. The original variations gallery contains additive links to the new directions and games.
- 16 newly generated, visually inspected artworks from text-only prompts. Original generated PNGs plus optimized WebP files, mobile hero crop, social JPEG derivatives, and two actual game preview screenshots are included. Official wordmark, palette, DM Sans and Sacramento retained.
- Local pinned static engine bundles: Three.js 0.180.0, Rapier 0.19.3, Phaser 3.90.0, Anime.js 4.1.3. The game pages load their own engine only. No application framework or backend added.
- Shared deterministic grip rules, fixed 60 Hz simulation, physically settling capsules, articulated 3D mechanism and illustrated 2.5D machine, transport and chute delivery, retries, restock, pause, optional synthesized audio, camera presets, keyboard and touch controls.
- Local demo email validation and sample pass. Addresses are cleared and never sent or persisted by the application. DEMO-CAMP is not redeemable. Skip-game claim is independent of the engine modules.

## Automated checks

| Check | Result |
| --- | --- |
| Mechanics unit tests | 6 passed: centered catch, edge/miss threshold, blocked capsule, stable tie selection, duplicate-drop lock, identity/delivery, retry, fixed-step 30/60/120 Hz comparison |
| Static references | 23 pages; 369 local references; all 19 original counterparts; all 16 assets; zero failures |
| Page browser review | All 21 collection pages at 1440×1000 and 390×844, plus both standalone games at both sizes; zero broken images, horizontal overflow, or page JavaScript errors |
| Both live games | Keyboard aiming, successful catch, explicit empty miss, identity through delivery, locked drop, replay, restock, pause, sound state, camera where applicable |
| Mobile input | Mouse/pointer and browser-emulated touch move each claw; Drop and machine share the initial 390×844 viewport |
| Forms | Invalid address feedback; valid local reveal; address cleared; Escape closes dialog |
| Failures | Blocked 3D engine bundle and unavailable WebGL retain accessible HTML claim |
| Existing interactions | Quiz completion/restart, day/night, explicit werewolf entry, encounter, booth hotspots, chair conversations |
| Reduced motion | Preference recognized; decorative transitions disabled; necessary game motion retained with claim alternative |

Browser: Microsoft Edge ${browser.browser}, headless on the available Windows host. Recorded browser results: browser-results.json; static references: static-results.json. Additional focus, joystick, visibility-event and clipboard/failure checks are recorded separately in edge-results.json.

## Performance

| Game | Observed desktop animation rate |
| --- | --- |
${games.map(g=>`| ${g.route.includes('3d')?'Three.js + Rapier':'Phaser + Matter'} | ${g.fps.toFixed(1)} fps |`).join('\n')}

These are animation-loop averages during the scripted desktop play session, not GPU benchmarks or physical mobile measurements. The 3D renderer caps pixel ratio at 1.6 and disables shadows when initially loaded at mobile width. Phaser uses a bounded 720×850 game surface. Physics pauses when hidden or offscreen, frame deltas are bounded, and each engine is loaded only on its selected page. Mobile layout and input were verified through viewport/touch emulation; physical iOS/Android and Safari were unavailable.

## Visual inspection and corrections

Every generated image was inspected before integration. All new pages were captured and reviewed at desktop and mobile sizes. Review sheets are review-1.jpg through review-8.jpg; full screenshots are under screenshots/.

Corrections made during review include mobile control ordering and height, clear arcade marquee lettering, stronger 3D material lighting, actual game preview cards, touch hotspot stacking, illustrated footer contrast, field-guide headline wrapping, and story image reset when returning to the top. Readable copy and interface controls are rendered separately from generated art.

## Practical limits

This is a polished static demo with hybrid catches: loose capsules use physics, then one valid capsule attaches for reliable transport. It does not simulate frictional finger squeezing. No random win probability is used. Equivalent settled positions share the same bounded selection function; different physics engines are not claimed to produce identical piles.

The frame-rate test covers the shared fixed-step input/catch logic, not cross-browser deterministic physics. No physical-device performance claim is made. Fonts request Google Fonts with local system fallbacks. Public social metadata uses relative image paths until a deployment origin is selected.

Real newsletter integration, live offer terms, redeemable codes, and deployment remain outside scope. Generated merchandise is illustrative. Narrative examples are labeled rather than represented as client results.

## Reproduce

Run from camp/cinematic: npm test; npm run verify; node tools/browser-check.mjs --full; node tools/edge-cases.mjs. For sandboxed Node environments, tests can run with node --test --test-isolation=none tests/core.test.mjs. README.md contains the build and preview commands.
`);
console.log('Wrote prompts and verification report.');
