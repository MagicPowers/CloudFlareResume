# Deployment plan

**Recommendation: Cloudflare, free tier, serving `davidpower.eu`. Registration
stays at GoDaddy; only the nameservers move. Ongoing cost: the €8.99/yr domain
renewal and nothing else.**

> The `.ie` was €40/yr and has been allowed to expire. Everything below uses
> `davidpower.eu` as the single canonical domain, which removes the second zone
> and the cross-domain redirect entirely.

---

## The thing worth knowing first

This site is not more intense than the GitHub Pages sites you've hosted before.
It's less intense than most of them.

Everything that looks expensive — the WebGL hero, the terminal, the command
palette, the scroll-driven timeline — runs in the visitor's browser. There is no
server, no database, no API route, no server-side rendering at request time. The
whole thing prerenders to a folder of files at build time:

```
Route (app)
┌ ○ /                    ○ (Static)
├ ○ /_not-found          ○ (Static)
├ ○ /cv                  ○ (Static)
├ ○ /icon                ○ (Static)
├ ○ /opengraph-image     ○ (Static)
├ ○ /robots.txt          ○ (Static)
└ ○ /sitemap.xml         ○ (Static)

out/  →  2.1 MB, 70 files
```

I've already configured and verified this: `next.config.ts` has
`output: "export"`, `npm run build` produces `out/`, and I've run the full
browser test suite against that folder served by a dumb static file server. The
shader renders, the terminal runs, the palette opens, the map animates. No
Node process involved.

**So the hosting decision is not about capability. It's about four things:**

1. Two custom domains, one of which needs to redirect to the other
2. How photos get delivered once you add them (the only real cost driver)
3. Whether builds run automatically on push
4. Whether the host can pull your site down at its own discretion

---

## The options

| | GitHub Pages | Cloudflare Pages | Vercel Hobby | AWS S3 + CloudFront |
| --- | --- | --- | --- | --- |
| Hosting cost | Free | Free | Free | ~$0–1/mo |
| Bandwidth | Fair-use, ~100 GB/mo | **Unmetered** | 100 GB/mo | 1 TB/mo free, then $0.085/GB |
| Custom domains | **1 per repo** | 100 per project | Unlimited | Unlimited |
| Commercial use on free tier | Allowed | Allowed | **Prohibited** | N/A |
| Host can remove your site | Unlikely | Unlikely | **Explicitly reserved, without notice** | No |
| Build on git push | GitHub Actions | Built in | Built in | You build it |
| DNS + TLS | Free | Free | Free | Route 53 $0.50/zone/mo + free ACM |
| Setup effort | Low | Low | Lowest | High |
| Ongoing maintenance | None | None | None | Cache invalidation, IAM, certs |

### Why not GitHub Pages

Worth being straight about this: my original argument against GitHub Pages was
that it reads a single `CNAME` file and therefore handles one custom domain per
repository, which didn't work when the plan involved `.ie` and `.eu`. **Now that
there's only `davidpower.eu`, that objection is gone and GitHub Pages would
genuinely work.**

It's still not what I'd switch to, for one remaining reason and one practical
one. The remaining reason is below. The practical one is that Cloudflare is
already set up and building — there's nothing to gain by moving.

**No image layer.** Once you add "loads of photos", they're served as-is at
whatever size came off the camera. That's fixable at build time (see the image
pipeline section below) and I'd recommend doing it regardless of host — but on
GitHub Pages it's mandatory rather than optional.

### Why not Vercel

Vercel is the best developer experience for Next.js by a distance, and the
zero-config deploy is genuinely one click. If this site used ISR, server actions
or middleware, I'd say use Vercel and stop reading.

It doesn't. And the Hobby tier carries a clause that matters more than it looks:

> Hobby teams are restricted to non-commercial personal use only.
>
> We may shut down and terminate projects or deployments using the Hobby plan
> without notice for any reason or no reason.

A personal CV is non-commercial, so you'd be within the terms. But "receiving
payment to create, update, or host the site" is on their list of commercial
triggers, and enforcement is automated, unilateral and appealed by email. The
entire job of this site is to be reachable at the moment a recruiter clicks the
link in your application. Accepting a discretionary takedown risk to save
nothing over the alternative isn't a good trade.

The 100 GB/month bandwidth cap is not a real constraint — that's roughly 30,000
visits — but the behaviour when you hit a cap is that the project *pauses*
rather than bills you. Same objection.

### Why not AWS (for cost)

S3 + CloudFront + ACM is what I'd reach for if this were a company's site. For
this, it buys you nothing and costs you time:

- CloudFront's free tier covers 1 TB/month, so bandwidth is effectively free
- S3 storage for 2 MB plus photos is cents per month
- But Route 53 is $0.50 per hosted zone per month — $12/year for two domains
- And you own the work: Origin Access Control, an ACM cert that must live in
  `us-east-1`, a cache invalidation step in CI, an OIDC role for GitHub Actions
  to assume, and a bucket policy you have to get right

That's a day of setup and a permanently larger surface area, to end up slower to
deploy than the alternative. **There is one good reason to do it anyway — see
the appendix.**

### Why Cloudflare

- **Free, with unmetered bandwidth.** No cap to hit, so no pause-on-cap
  behaviour to worry about.
- **Free DNS with CNAME flattening**, which is what lets a bare apex domain
  (`davidpower.eu` with no `www`) point at a hosted site at all. The DNS spec
  forbids a CNAME at the apex, and GoDaddy's panel offers no ALIAS/ANAME record
  to work around it. Cloudflare solves this transparently.
- **You keep registration at GoDaddy.** You only change nameservers. No
  transfer, no new registrar relationship, no change to the €8.99 renewal.
- **No commercial-use clause**, so if you ever add a "hire me" page or a link
  to consulting work, nothing changes.
- Free TLS, free DDoS protection, free privacy-preserving analytics.
- Build-on-push from GitHub, preview URLs per branch, one-click rollback.

The only meaningful limits on the free tier are 500 builds/month and one
concurrent build. You will not approach either.

---

## Cost, once it's running

| Item | Cost |
| --- | --- |
| Cloudflare Pages hosting | €0 |
| Cloudflare DNS | €0 |
| TLS certificates | €0 |
| Bandwidth | €0, unmetered |
| GitHub repository | €0 |
| `davidpower.eu` renewal (GoDaddy) | €8.99/yr |
| **Total ongoing** | **€8.99/yr** |

---

## Step by step

### Phase 0 — Decisions before anything ships

- [x] **Canonical domain: `davidpower.eu`.** Registered at GoDaddy, €8.99/yr,
      renews 28 July 2027. `.eu` is a perfectly good signal for someone
      targeting Irish and EU roles, and it's a quarter the price of the `.ie`.

- [x] **`profile.site` is set** to `https://davidpower.eu` in
      `src/data/profile.ts`. That single value feeds the canonical link tag,
      the Open Graph tags, `sitemap.xml` and `robots.txt`.

- [ ] **Check what's currently on the domain.** The GoDaddy dashboard shows
      `davidpower.eu` connected to a site at `parrotcube.site`. Moving
      nameservers to Cloudflare will disconnect that — intended here, but make
      sure nothing you care about is running on it first.

- [ ] **Confirm there's no email on the domain.** GoDaddy currently shows
      "Get custom email @davidpower.eu" as *not* set up, which means no MX
      records to preserve. If you ever add GoDaddy email later, do it *after*
      the nameserver move so the records are created in Cloudflare.

- [ ] **Decide about your phone number.** It's currently in `profile.ts`, and
      from there it appears on the contact card, in the command palette and on
      the printed CV. A public page with your mobile on it will be scraped. My
      suggestion: keep it on `/cv` (which `robots.txt` already excludes from
      indexing) and drop it from the homepage contact card, so it reaches
      people who actually read the CV and not bots.

- [ ] **Public or private repo?** Public is a decent signal for an engineering
      leader — the source of your CV site is a work sample. If you go public,
      do the phone number decision first.

### Phase 1 — Get it into GitHub

The repo is already initialised locally with everything staged as untracked.

```bash
cd ~/Projects/davidpower-dev

# Confirm it builds clean from scratch first
npm ci
npm run build          # should produce out/ with no errors

git add -A
git commit -m "Personal CV site: Next.js static export"

gh repo create davidpower-dev --public --source=. --remote=origin --push
# or create it in the GitHub UI and:
#   git remote add origin git@github.com:<you>/davidpower-dev.git
#   git push -u origin main
```

### Phase 2 — Create the Cloudflare project

Cloudflare has folded Pages into Workers, and new git-connected projects are
Workers projects that run a **deploy command** (`npx wrangler deploy`) rather
than just uploading a folder. That's fine — a Worker can be pure static assets
with no script at all — but it changes one thing, described below.

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) — free, no card.
2. **Workers & Pages → Create → Connect to Git**, authorise GitHub, pick the repo.
3. Build settings:

   | Field | Value |
   | --- | --- |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Root directory | `/` |

4. **`wrangler.jsonc` in the repo root is mandatory, not optional.**

   If wrangler doesn't find a config file, it auto-detects the framework, sees
   Next.js, assumes a server-rendered app, and silently rewrites the project to
   use the OpenNext adapter mid-build. That build then dies looking for
   `.next/standalone`, which a static export never produces. The config file is
   what stops that happening:

   ```jsonc
   {
     "name": "cloudflareresume",
     "compatibility_date": "2026-09-03",
     "assets": {
       "directory": "./out",
       "not_found_handling": "404-page"
     }
   }
   ```

   `name` must match the Worker name in the dashboard or you'll deploy a second,
   separate Worker. There is deliberately no `main` key — that's what makes it
   an assets-only Worker.

   `wrangler` is pinned as a devDependency for the same reason. An
   auto-updating deploy tool that rewrites your repo config is exactly the
   failure above; pinning it means a future version can't surprise you.

5. Check the Node version. Cloudflare's build image currently ships Node 24,
   which is fine. If you ever see `Node.js version ">=20.9.0" is required`, add
   a `NODE_VERSION` = `22` environment variable in the build settings.

6. **Save and Deploy.** You get a `*.workers.dev` URL in about a minute. Check
   it works before touching DNS.

   Verify the deploy log ends with wrangler reading files from `out/` — a line
   like `Read 76 files from the assets directory`. If instead you see
   "Configuring project for Next.js with OpenNext", the config file isn't being
   found.

### Phase 3 — Move DNS to Cloudflare (registration stays at GoDaddy)

**This step is not optional.** Attaching a custom domain to a Worker requires
the zone to live in your Cloudflare account — Cloudflare has to be answering
DNS for `davidpower.eu` before it will let you route the domain at your Worker.
You cannot do this by adding a CNAME in GoDaddy's DNS panel.

1. Cloudflare dashboard → **Add a domain** → `davidpower.eu` → **Free** plan.
2. Cloudflare scans the existing DNS, then shows two nameservers, something like
   `xxx.ns.cloudflare.com`. **Review the records it imported** before
   continuing — anything you still need has to be in that list.
3. In **GoDaddy**: your domain → **Domain Settings → Nameservers → Change** →
   *I'll use my own nameservers* → paste Cloudflare's two → Save.
   - If GoDaddy refuses the change, turn off **Domain Protection** first.
   - GoDaddy will warn that this disconnects the `parrotcube.site` website
     currently attached to the domain. That's expected and intended.
4. Wait for propagation — usually minutes, occasionally a few hours. Cloudflare
   emails you when the zone goes active.

> You are *not* transferring the registration. GoDaddy still owns it, still
> renews it, still takes the €8.99. You're only changing which servers answer
> DNS queries, which has no effect on your renewal price.

### Phase 4 — Attach the domain to the Worker

1. Worker project → **Settings → Domains & Routes → Add → Custom domain**.
2. Add `davidpower.eu`. Cloudflare creates the DNS record itself and uses CNAME
   flattening — that's what makes an apex domain work at all, since a bare apex
   can't be a CNAME under the DNS spec and GoDaddy offers no ALIAS record to
   work around it.
3. Add `www.davidpower.eu` as well, so both spellings resolve. The
   `<link rel="canonical">` already points at the apex, so Google won't treat
   the two as duplicate content.
4. TLS is issued automatically. Give it a few minutes, then load
   `https://davidpower.eu`.

### Phase 5 — Verify before you put the link on anything

- [ ] `https://davidpower.eu` loads, padlock valid
- [ ] `https://www.davidpower.eu` loads
- [ ] `http://davidpower.eu` upgrades to HTTPS
- [ ] `https://davidpower.eu/cv` prints to a clean two-page PDF
- [ ] `https://davidpower.eu/sitemap.xml` shows `davidpower.eu`
- [ ] A nonsense URL like `/nope` returns a real 404, not the homepage
- [ ] Paste the URL into [LinkedIn's Post Inspector](https://www.linkedin.com/post-inspector/)
      and confirm the OG card renders — this is the preview a recruiter sees
      when you share it, and it's worth getting right
- [ ] Open it on your actual phone, not a simulator — check the hero, the
      vertical timeline and the contact card
- [ ] Run Lighthouse in Chrome DevTools; expect performance in the 90s and
      accessibility 95+
- [ ] Submit the sitemap in [Google Search Console](https://search.google.com/search-console)
      so you rank for your own name

### Phase 7 — Before the photos go in

This is the one piece of engineering still outstanding, and it matters more than
the hosting choice.

Static export means Next.js's runtime image optimiser is gone —
`images.unoptimized` is set, so `next/image` emits the original file at its
original size. Fine today with zero photos. Not fine when you drop in sixty
4 MB photos straight off a phone and every visitor downloads 240 MB.

**The fix is to generate derivatives at build time**, which is better than a
runtime optimiser anyway: it's free, it works identically on every host, and it
never has a cold start.

Concretely, extend `scripts/build-gallery.mjs` to:

1. Add `sharp` as a dev dependency.
2. For each source image, emit resized AVIF and WebP derivatives at ~400, 800
   and 1600 px wide into `public/photos/_generated/`.
3. Record the `srcset` in the generated manifest alongside the dimensions it
   already captures.
4. Swap the `next/image` calls in `Gallery.tsx` and `Timeline.tsx` for a plain
   `<img srcset sizes loading="lazy" decoding="async">`, which is all
   `next/image` was giving us here anyway.
5. Cache the derivatives by content hash so rebuilds only process new photos.
6. **Strip EXIF while you're at it.** Phone photos carry GPS coordinates.
   Publishing the exact location of your house because it's in the background
   of a 2019 team photo is a genuinely bad day. `sharp` drops metadata by
   default — this is a reason to route every image through it, not just large
   ones.

Expected result: a gallery of sixty photos delivering roughly 1–2 MB for a
first view instead of a few hundred.

Say the word and I'll build this — it's an hour, and it's much easier to do
before there are photos to re-process than after.

---

## Day-to-day, once it's live

```bash
# Edit content in src/data/*.ts, then:
git commit -am "Update Hertz role"
git push
```

Cloudflare builds and deploys in about a minute. Pull requests get their own
preview URL. If a deploy looks wrong, **Workers & Pages → your project → Deployments → Rollback** puts
the previous one back instantly.

Adding photos:

```bash
# drop files into public/photos/<era>/
npm run photos     # regenerates the manifest (and derivatives, once Phase 7 is done)
git add public/photos src/data/gallery.generated.ts
git commit -m "Add Webio-era photos"
git push
```

---

## Appendix: the argument for doing it on AWS anyway

I've recommended against AWS on cost and complexity, and I stand over that as a
hosting decision. There's a different argument I want to put in front of you,
because it's about you rather than about the site.

You are an engineering leader whose CV is dense with AWS — EC2, ECS, ELB,
Aurora, CloudWatch, QuickSight, Kubernetes, a 66% cost reduction, $125k in
credits negotiated. You are interviewing for roles where someone will ask you to
talk through an architecture decision.

"My personal site is a static export behind CloudFront, with an S3 origin locked
to Origin Access Control, an ACM cert in `us-east-1`, deployed by GitHub Actions
assuming a role via OIDC with no long-lived keys, and the whole thing is
Terraform in the same repo" is a better answer to *"tell me about something you
built recently"* than "I connected a repo to Cloudflare."

That's a real benefit, and it costs about €12/year in Route 53 zones plus a day
of your time.

My honest read: **do Cloudflare Pages now, this week, because the value of this
site is having the link live while you're applying.** If you later want the AWS
version as an interview artefact, build it as a deliberate exercise and cut the
DNS over when it's ready. Migrating is trivial — the deliverable is the same
2.1 MB folder either way, and nothing in the codebase is tied to a host. That's
worth knowing: this decision is genuinely reversible in an afternoon, so don't
over-think it now.
