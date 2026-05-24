# nonrocker / Turbolag — EPK

*Single source of truth for this project: this README.*

---

## Fork

On 17 May 2026 the project forked. Turbolag is a sibling branch at `../turbolag/` with its own aesthetic direction (Linux TUI: monospace, monitor glow, terminal motifs). Both branches are primary. nonrocker is not deprecated. Same lore canon, same album, same members, divergent visual languages.

See `../turbolag/README.md` for the Turbolag manifesto. See `CLAUDE.md` in this folder for nonrocker-specific Claude Code conventions.

## What this folder is

The electronic press kit (EPK) for the pretend band **nonrocker**, currently mid-rebrand to **Turbolag**.

Two HTML variants live in this folder; both pull from the same 11 PNG assets already here. Open either in a browser. No build step.

| File | What it is | When to use |
|---|---|---|
| `index.html` | Long-scroll single-page EPK, all 8 sections stacked vertically. | Press, booking, anyone who wants to read top to bottom. |
| `slides.html` | Slide-deck variant of the same content, one section per slide, keyboard-navigable. Hero uses a heavy Black Mirror style glitch. | Showcase / presentation. Loud. Designed to be projected. |

## How to preview

Easiest: double-click the HTML file. Chrome handles it. If Spectrum Web Components fail to render under `file://`, fall back to:

```
cd /mnt/c/Users/snibo/Deimos/Projects/Music/nonrocker
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html` or `/slides.html`.

## Hosting

The EPK is live on GitHub Pages as of 17 May 2026:

| URL | Variant |
|---|---|
| https://srobins.github.io/ | Long-scroll (`index.html`) |
| https://srobins.github.io/slides.html | Slide deck |

Repo is the user-pages repo (`srobins.github.io`), so the EPK sits at the root. To update: edit files locally, push to that repo's `main` branch.

Other hosting paths considered: Netlify Drop (validated earlier), itch.io (option for a band-page vibe), local `python3 -m http.server` (fallback for `file://` browser issues).

CLI-first deploy workflow (preferred going forward) is tracked in TASK00000682.

## Slides navigation (slides.html)

- Right arrow / Space / Page Down: next slide
- Left arrow / Page Up: previous slide
- Home: first slide · End: last slide
- Number keys 1-9: jump to slide
- Touch: swipe left/right on mobile

## Source material

All copy is invented. Pulled visual cues, track names, and taglines directly from the 11 PNG assets in this folder. Highlights:

- Album: *Soju, Kazoos and Didgeridoos* (NRK-2024, 33⅓ RPM Stereo)
- Label: Soju Nation / Future Delusions Entertainment
- Tagline rotation: "No Rules Just Noise" · "Play Destroy Rewind" · "Insert Chaos Here" · "No BPM No God" · "Recorded somewhere between competence and chaos"
- Tracklist: 11 tracks, METALDATA as track 1 (ships with three logo variants)
- Members: Yung Soju · DJ 막걸리 · STATUE.EXE · NULLSOFT · ??? (the drummer, who denies being the drummer)

## Identity framing

Names flicker on purpose:

- **nonrocker** — current name, the one in the artwork
- **Turbolag** — rebrand in progress (alt casings: TurboLag · turbolag · TURBOLAG)
- **METALDATA** — *one song*, not a band name. Track 1's art ships with three logo experiments.

## Tech notes

- Spectrum Web Components loaded from jsdelivr CDN. No npm install required.
- Theme: `sp-theme color="dark" theme="spectrum-two"`.
- Custom CSS adds the chaos layer (CRT scanlines, glitch animations, vaporwave gradients, Win95 popups).
- Fonts pulled from Google Fonts: Metal Mania, Bungee, Press Start 2P, VT323, Major Mono Display.
- `slides.html` includes a JS keyboard / touch handler for slide nav; no framework.

## Updating the EPK

| Want to change... | Where to edit |
|---|---|
| Booking / press email | Search for `nonrocker.fake` in both HTML files. |
| Tracklist | `<table class="tracks">` block. |
| Tour dates | `<table class="tour">` block. |
| Press quotes | `.press__grid` block. |
| Member bios | `.members__grid` block. |
| Hero glitch tuning | `@keyframes` block in the `<style>` tag of each file. The slides variant is the more aggressive one. |
| Add a new image | Drop the PNG in this folder, add a `.gallery__cell` entry. |

## What's intentionally fake

Every email address, every social link, every tour date, every press quote, every member name. Replace as needed.

## What's out of scope

- Real audio (the track "play" buttons trigger a single Web Audio kazoo honk; no MP3s exist)
- Hosting / deployment
- PDF press kit export
- Mobile-app screenshot embeds
