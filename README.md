# davidpower.eu

Personal CV site for David Power — Engineering Manager / Tech Lead, Dublin.

Dark editorial single-page site with a hand-written WebGL hero, a scroll-driven
career timeline, a photo gallery, a D&D character sheet, an animated map of two
long cycles, a Cmd+K palette, a working terminal, a recruiter mode, and a
print-perfect CV route.

## Stack

| Layer      | Choice                                                   |
| ---------- | -------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack), fully static          |
| Language   | TypeScript, strict                                        |
| UI         | React 19                                                  |
| Styling    | Tailwind CSS v4 (`@theme` design tokens in `globals.css`) |
| Motion     | `motion` (Framer Motion's successor) + Lenis smooth scroll |
| Graphics   | Hand-written GLSL on raw WebGL2 — no Three.js, ~3 KB      |
| Palette    | `cmdk`                                                    |
| Icons      | `lucide-react`                                            |
| Map        | Natural Earth 1:50m, simplified, projected in-component   |

## Running it

```bash
nvm use 22          # or: fnm use 22 — Next 16 needs Node 20.9+
npm install
npm run dev         # http://localhost:3000
```

```bash
npm run build       # writes a static site to out/
npm run lint
npm run photos      # regenerate the gallery manifest (see below)

npx serve out       # preview the production build (next start won't work —
                    # the site is a static export, there's no server)
```

## Adding your photos

Photos live in `public/photos/<era>/`, named `YYYY-MM-DD-short-description.jpg`.
The full rules — era folders, thumbnails, captions, and how files are prepared —
are in [`public/photos/README.md`](./public/photos/README.md).

The short version: photos go through EXIF stripping and resizing before they're
added, each gets an 800px thumbnail in `<era>/thumbs/`, captions go in
`public/photos/captions.json`, and then:

```bash
npm run photos
```

That reads every image's real dimensions and date and writes
`src/data/gallery.generated.ts`. The gallery, the timeline cards, the cycling
section and the lightbox all read from that one manifest. The date in the
filename decides which timeline milestone a photo appears under — each card
shows the first and last photo of its chapter. `npm run build` runs it
automatically.

## Editing the content

All copy lives in `src/data/` as typed objects — no CMS, no markdown, no
database. Change the data and every surface updates together, including the
printable CV and the terminal.

| File            | What's in it                                          |
| --------------- | ----------------------------------------------------- |
| `profile.ts`    | Name, contact details, tagline, summary, headline stats |
| `experience.ts` | Roles, bullets, metrics, stack, education, certifications |
| `timeline.ts`   | Every milestone on the scroll-driven timeline          |
| `skills.ts`     | Skill groups, plus the whole D&D character sheet       |
| `cycling.ts`    | Ireland's coastline and the two routes                 |
| `gallery.ts`    | Era definitions (labels, years, colours)               |
| `sections.ts`   | Section registry — drives nav, palette and `ls`        |

## Things worth knowing

**Keyboard.** `⌘K` / `Ctrl+K` opens the command palette. `` ` `` opens the
terminal. `Shift+R` toggles recruiter mode. `Esc` closes whatever is open.

**Recruiter mode** strips every animation, hides decorative layers and raises
density, for people who read CVs for a living. It's stored in `localStorage` and
applied by a blocking script in `<head>`, so it never flashes the animated
version at someone who turned it off.

**The printable CV** is at `/cv`. It's a real route styled with `@media print`,
not a static PDF, so it can never drift out of sync with the site. Print it and
choose "Save as PDF" for a clean two-page document.

**The hero shader** is ~90 lines of GLSL doing two rounds of domain-warped fbm
noise. It caps device pixel ratio, drops to half resolution on phones, pauses
when scrolled offscreen or when the tab is hidden, and falls back to a CSS
gradient if WebGL2 is unavailable or the visitor has asked for reduced motion.

**Accessibility.** Every animation respects `prefers-reduced-motion`. The
timeline switches from pinned-horizontal to a plain vertical list on narrow
screens and for reduced-motion users. The hero `h1` carries the full
screen-reader sentence while the display type is `aria-hidden`.

## Deploying

Every route prerenders, so `npm run build` emits a plain 2.1 MB folder at `out/`
that any static host will serve. No Node process, no server, no runtime.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full analysis and a step-by-step
plan. The short version: a Cloudflare Worker serving static assets, free tier,
on `davidpower.eu` (registered at GoDaddy, nameservers delegated to Cloudflare).

`wrangler.jsonc` in the repo root is load-bearing — without it, `wrangler
deploy` auto-detects Next.js, assumes a server-rendered app, and rewrites the
project to use the OpenNext adapter mid-build, which then fails looking for
`.next/standalone`. A static export never produces that.

One thing left to settle: decide whether you want your phone number on a public
page. It's currently in `profile.ts`, on the contact card, in the command
palette and in the CV.

## Attribution

Coastline derived from [Natural Earth](https://www.naturalearthdata.com/)
(1:50m map units, public domain), simplified with Douglas–Peucker.
