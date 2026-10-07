# Full Throttle visual update

## Arcade Flight — October 7, 2026

This follow-up adds an evasive roll (C / Space / on-screen ROLL), focused fire (Shift or the Focused touch fire setting), level-3 homing missiles, formation-clear bonuses, a visible chain meter, three boss attack phases with warning windups, banked player animation and original ground landmarks. It also corrects canvas redraw on resize and keeps defeated enemies out of collision checks. The existing new enemy art, bombs, stage terrain and pause debounce remain integrated.

See [the production review](PRODUCTION-REVIEW.md) for the 1942, Raiden IV and DoDonPachi research, implementation decisions and verification scope. The gameplay suite and 29 arcade checks passed on Edge, including six responsive layouts, keyboard activation and emulated touch. Physical device testing and human balance review remain next steps.

## Earlier Full Throttle pass

This release responds to playtest feedback about speed, object readability, and screen size.

- Terrain scrolls vertically beneath the player. Distant dust, nearer streaks and edge markers move at different speeds; overdrive accelerates the scenery. Reduced effects slows this motion.
- Incoming bullets are red diamonds with a white core and dark outline. Enemy ships have red warning chevrons. Player fire remains cyan.
- Collectibles are rounded square capsules with symbols and labels: P / POWER, + / SHIELD, $ / CHARGE. Collection produces a colored ring and a brief reward message. Damage produces a separate SHIELD LOST message and red frame.
- The arena scales with the viewport instead of stopping at 480 CSS pixels. Phone portrait uses the full available width when height permits, preserving the original 2:3 gameplay coordinates and collision behavior. Fullscreen is offered when the browser supports it.
- Canvas resolution follows rendered size and pixel density, capped at 3x logical resolution. Settings and scores remain local.

## Verification

The browser regression script checks rewards, collision damage, overdrive, pause, campaign transitions, pointer steering, reduced-effects persistence, asset failures and runtime errors. Six viewport sizes cover desktop, small phones and phone landscape. Campaign checks use invulnerability and forced boss defeat; they verify progression, not human difficulty balance.

Serve this directory on http://127.0.0.1:8781, then run `node tests/flight.cjs` with Playwright installed and Microsoft Edge available. `PLAYWRIGHT_MODULE` can point to an existing Playwright installation. Screenshots are written to the working directory.

Desktop and phone screenshots were visually reviewed. Physical iPhone/Safari performance and human play balance still require device playtesting.
