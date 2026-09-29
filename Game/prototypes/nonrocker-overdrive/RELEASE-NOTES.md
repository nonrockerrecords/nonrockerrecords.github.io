# Full Throttle visual update

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
