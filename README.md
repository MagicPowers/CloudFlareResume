# davidpower.dev

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

This is the one thing the site is waiting on.

1. Drop images into the era folder they belong to:

   ```
   public/photos/trinity/          2011–2015  Trinity & Glasgow
   public/photos/science-gallery/  2013–2015  Science Gallery
   public/photos/webio-early/      2016–2019  Webio, building
   public/photos/webio-lead/       2019–2023  Webio, leading
   public/photos/webio-dx/         2023       Webio, developer experience
   public/photos/revium/           2024       Revium
   public/photos/hertz/            2024–now   Hertz
   public/photos/cycling/          Ongoing    On the bike
   public/photos/dnd/              Ongoing    Dungeons & Dragons
   public/photos/misc/             —          Everything else
   ```

2. Run `npm run photos`.

That scans the folders, reads each image's real dimensions, and writes
`src/data/gallery.generated.ts`. Baking the dimensions in at build time is what
stops the masonry grid from jumping around as images load. The gallery, the
timeline cards and the lightbox all read from that one manifest, so photos
appear everywhere at once. `npm run build` runs it automatically.

**Captions** are optional, and there are two ways to add one:

- In the filename, after a double underscore:
  `2019__first-week-as-team-lead.jpg` → "First week as team lead"
- Or in `public/photos/captions.json`:
  ```json
  { "webio-lead/offsite.jpg": "Team offsite, Wicklow, 2019" }
  ```

Filenames sort alphabetically within an era, so a `YYYY-MM-` prefix keeps them
in chronological order.

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
plan. The short version: Cloudflare Pages on the free tier, `davidpower.ie`
canonical, `davidpower.eu` redirecting to it, and set `NODE_VERSION=22` in the
build environment or the build will fail.

Two things to settle first:

- Set the real domain in `src/data/profile.ts` (`profile.site`) — it feeds the
  canonical URL, the OG tags, the sitemap and `robots.txt`.
- Decide whether you want your phone number on a public page. It's currently in
  `profile.ts`, on the contact card, in the command palette and in the CV.

## Attribution

Coastline derived from [Natural Earth](https://www.naturalearthdata.com/)
(1:50m map units, public domain), simplified with Douglas–Peucker.
