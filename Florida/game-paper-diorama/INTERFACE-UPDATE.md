# Incident scrapbook implementation

The paper-diorama version on port 8791 now has a left objective/resource dossier, a separate transparent Three.js stage, a compact incident strip, a wide readable card hand, and a dedicated action dock. The original Florida/game directory was not modified.

Approved character, card, event and cutout images are reused without replacement. Card foil tracking remains active. The existing torn county citation and marquee are retained. New generated textures are tracked in artwork/interface-manifest.json, with source image paths, prompt summaries and project-local WebP consumers. Both were generated with built-in image_gen, visually accepted, optimized, and verified in the live page; no rejected generations or rate-limit retries.

Implementation lives in index.html, src/county-desk.css, the added CSS import in src/main.ts, and scene camera/background changes in src/scene.ts. Game rules and save format are unchanged.

Verification:

- Production TypeScript/Vite build passed; Vite retains its nonblocking large Three.js bundle warning.
- All 28 existing rules tests passed.
- Browser test used localhost:8791 separately from the user's 127.0.0.1 save origin.
- Tutorial, automatic card target, Play Card, +2 Block, +7 Stability combo, updated incoming damage, and illustrated turn report verified.
- Deal Turn 2 restores the hand and actions.
- At 1440 × 900, five cards fit without horizontal page or hand overflow and no visible card rules were clipped.
- At 390 × 844, only the hand scrolls horizontally. Board/resources remain within the viewport; Closing Time's alternate-mode buttons and Play Card remain available.
- Card heights can expand for longer crew descriptions rather than hiding rules text.

Generated surfaces contain no live text. Labels, values, card effects, focus states and controls remain HTML/CSS.
