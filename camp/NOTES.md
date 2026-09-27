# Kanahoma Project — Review & Follow-ups

> Open items saved from our build session. Pick these back up in a future Claude Code session — point Claude at this file to resume context.

---

## 1. Review: React Spectrum S2 MCP installation

**Status:** Added to config but failing to connect — Node.js / npx is not installed (or not in PATH) on this machine.

**Config location:**
`~/.claude.json` (project-scoped to `/Users/arousseau/Desktop/claudestuff`)

**Command originally run:**
```
claude mcp add react-spectrum-s2 npx @react-spectrum/mcp@latest
```

**To finish the install:**

1. Install Node.js — easiest path:
   ```
   brew install node          # if Homebrew is available
   ```
   or download the LTS installer from https://nodejs.org

2. Verify in Terminal (not Claude Code):
   ```
   node --version
   npx --version
   ```

3. Restart Claude Code, then confirm the MCP is healthy:
   ```
   claude mcp list
   ```
   Expect: `react-spectrum-s2: npx @react-spectrum/mcp@latest - ✓ Connected`

**Why it matters for this project:**
Once connected, S2 (Spectrum 2 — Adobe's design system MCP) gives Claude access to vetted accessible component patterns, layout primitives, and tokens. Useful when we extend the site with more interactive features (forms, modals, navigation patterns) — it lets us build with proven accessibility patterns instead of from scratch.

**Decision to make:** Do we want to actually build with Spectrum S2 components, or just use it as a reference for accessibility patterns while staying in our hand-built Kanahoma CSS? Recommend the latter — Spectrum's default styling won't match the Kanahoma brand, but its accessibility guidance is gold.

---

## 2. Add brand guidelines documentation to the working directory

**Why:** Right now the Kanahoma brand spec lives inside the `anthropic-skills:kanahoma-brand` skill on this machine. If we hand this project off (to another teammate, another AI session, deployment, etc.), the brand context disappears.

**Recommended structure:**

```
claudestuff/
└── brand/
    ├── README.md             ← Overview + how to use these files
    ├── colors.md             ← Full palette with hex/RGB/CMYK/PMS + WCAG matrix
    ├── typography.md         ← DM Sans + DM Serif Display + Sacramento rules
    ├── voice.md              ← Messaging principles, tone, "Camp Kanahoma" language
    ├── logo-rules.md         ← Wordmark, K-bug, clear space, what NEVER to do
    ├── icons.md              ← Product + service icon system
    └── assets/
        ├── tokens.css        ← (Already exists as assets/css/brand.css — copy/link here)
        └── tokens.json       ← Same values in JSON for tooling/Figma/etc.
```

**Why a `brand/` folder (not just CSS):**
- Designers can read it without opening code
- Future AI sessions can ingest it without needing the skill installed
- It becomes the single source of truth — no drift between the skill, the code, and what's actually deployed

**To-do for next session:**
- [ ] Pull the full brand reference out of the skill into `brand/*.md` files
- [ ] Generate `tokens.json` from `assets/css/brand.css` (variable name → value)
- [ ] Add a `CONTRIBUTING.md` at project root explaining "read `brand/` before changing anything visual"

---

## 3. Interactive experience ideas to test

The booth is rich with metaphor — campfire, story, gathering, gear, swag. Let's exploit that. Ideas ranked by **impact ÷ effort**.

### Quick wins (worth prototyping next session)

**a) "Pull up a chair" testimonial carousel**
Five tree stumps arranged around a fire. Click a stump → that "person" speaks (their testimonial fades in above the fire). Subtle SVG animation, lots of personality, mobile-friendly with a swiper fallback. Directly references the booth design.

**b) Animated campfire that grows with scroll**
The hero campfire already exists. Hook it to scroll position — flame gets bigger and glow expands as the user scrolls deeper into the site, then settles as they reach the contact section. Makes the page feel alive; rewards engagement.

**c) "Grab Your Swag" newsletter gamification**
Riffs directly on the booth's claw machine. Hover the email field → an animated claw drops to "grab" your address. On submit, the claw lifts a colorful capsule containing a confirmation message. Charming, on-brand, increases signup completion rate.

**d) Cursor-as-flashlight on the chaotic page**
Right now the chaotic page has a sparkle trail. Alternative: dim the background and let the cursor be a flashlight beam revealing content. Camping-coded. Toggle-able for accessibility.

### Mid-effort, high-impact

**e) "Build your campsite" — interactive service recommender**
3-4 step quiz styled as setting up camp:
- *"What kind of trip are you on?"* (enrollment crisis / brand refresh / general growth) →
- *"How long are you staying?"* (single project / multi-year) →
- *"What's already in your pack?"* (in-house team / existing agency / starting fresh)

Output: a personalized recommendation (AOR vs. Brand vs. Consulting) with a "Pitch a tent here →" CTA into contact. Doubles as a lead-qualification tool.

**f) Case studies as "campfire stories"**
Each case study presented as a story being told around the fire — vertical scroll narrative with the campfire SVG persistent on the right, illustrations animating in as the reader scrolls. Beats a generic case study grid by miles.

**g) Day/night toggle (framed as "Morning Light" / "Campfire")**
Light mode: Stoddard Cream background, mountains in soft greens, "morning camp" vibe.
Dark mode: current Kanahoma Green deep-night palette.
Frame it as a brand moment, not a tech feature. Saves preference in localStorage.

### Bigger swings (test later, validate first)

**h) Interactive booth tour**
A scrollable/clickable 2D illustration of the actual Camp Kanahoma booth. Hotspots over the cabin, claw machine, fire pit, gear shelves — each reveals a service, testimonial, or story. Essentially turns the booth into the site's navigation. Strong "show, don't tell" play.

**i) "Tell us your story" voice/text input**
Reverse the funnel: instead of pitching what Kanahoma does, ask the visitor to tell *their* story (institution name + biggest current challenge, in their own words). Submit → routed to a real human + triggers a tailored response. Aligns perfectly with the "every institution has a story" tagline.

**j) Crackling campfire ambient audio**
Subtle (opt-in, muted by default) campfire crackle when the hero is in view. Adds atmosphere. Must be tasteful — autoplay-muted, user-triggered unmute, accessibility-respecting `prefers-reduced-motion`.

**k) Custom 404 — "Looks like you wandered off the trail"**
Compass animation pointing back to home. Tiny lore moment that builds brand affection.

### Easy polish (do anytime)

- Twinkling stars in the footer of every page
- Tree-stump favicon
- "Roast a marshmallow" loading state
- Animated count-up on the stats (`3×`, `150+`, `12yr`) when they scroll into view
- Sticky "Light a Fire 🔥" floating CTA on long-scroll pages
- Print stylesheet — case studies should print like actual stories

---

## Decisions to make before next session

1. **Which variation are we taking forward?** Main, newsletter, chaotic, or traditional — or are we keeping them as A/B candidates?
2. **Real content vs. placeholder?** The current copy is brand-tone-correct but invented. Do we have real case studies, testimonials, and stats to swap in?
3. **What's the deploy target?** Static site (Netlify/Vercel/GitHub Pages)? CMS? WordPress? This shapes whether we keep vanilla HTML/CSS or move to a framework.
4. **Priorities from the interactive list above?** Pick 2-3 to prototype next session.

---

*Saved 2026-05-23. To resume: open this file in Claude Code and say "pick up from NOTES.md."*
