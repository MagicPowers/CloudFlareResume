# Deployment plan

**Recommendation: Cloudflare Pages, free tier, with `davidpower.ie` as the
canonical domain and `davidpower.eu` redirecting to it. Ongoing cost: your two
domain renewals at letshost and nothing else.**

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

It would genuinely work, and it's the familiar path. Two things rule it out:

**One custom domain per repository.** GitHub Pages reads a single `CNAME` file.
You have two domains and want one to redirect to the other. You'd need a second
repo or a third-party redirect service to handle `davidpower.eu`.

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

### Why Cloudflare Pages

- **Free, with unmetered bandwidth.** No cap to hit, so no pause-on-cap
  behaviour to worry about.
- **Both domains on one project.** 100 custom domains per project, and the
  `.eu → .ie` redirect is a native Redirect Rule, free, no code.
- **Free DNS with CNAME flattening**, which is what lets an apex domain
  (`davidpower.ie` with no `www`) point at a hosted site at all. Many registrar
  DNS panels, letshost included, don't offer ALIAS/ANAME records — this solves
  it cleanly.
- **You keep registration at letshost.** You only change nameservers. No
  transfer, no new registrar relationship.
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
| `davidpower.ie` renewal (letshost) | ~€20–30/yr |
| `davidpower.eu` renewal (letshost) | ~€10–15/yr |
| **Total ongoing** | **Your existing domain renewals, nothing more** |

---

## Step by step

### Phase 0 — Decisions before anything ships

- [ ] **Confirm the canonical domain.** I'd use `davidpower.ie`: you're Dublin
      based, an Irish citizen, and targeting Irish and EU roles. `.eu`
      redirects to it. Everything below assumes that; swap if you disagree.

- [ ] **Set the real URL.** In `src/data/profile.ts`, change `site` from the
      placeholder to `https://davidpower.ie`. It feeds the canonical link tag,
      the Open Graph tags, `sitemap.xml` and `robots.txt`, so getting it wrong
      is visible to Google and to LinkedIn's link preview.

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

### Phase 2 — Create the Cloudflare Pages project

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) — free, no card.
2. **Workers & Pages → Create → Pages → Connect to Git**, authorise GitHub,
   pick `davidpower-dev`.
3. Build settings:

   | Field | Value |
   | --- | --- |
   | Framework preset | None (or "Next.js (Static HTML Export)") |
   | Build command | `npm run build` |
   | Build output directory | `out` |
   | Root directory | `/` |

4. **Add an environment variable — this one bites people:**

   | Name | Value |
   | --- | --- |
   | `NODE_VERSION` | `22` |

   Cloudflare's default build image ships an older Node than Next.js 16
   requires (`>=20.9.0`). Without this the build fails with the exact error I
   hit locally when the shell defaulted to Node 18.

5. **Save and Deploy.** You get a `davidpower-dev.pages.dev` URL in about a
   minute. Check it works before touching DNS.

### Phase 3 — Move DNS to Cloudflare (registration stays at letshost)

Do this for `davidpower.ie` first, then repeat for `davidpower.eu`.

1. Cloudflare dashboard → **Add a site** → `davidpower.ie` → **Free** plan.
2. Cloudflare scans your existing DNS and shows you two nameservers, something
   like `xxx.ns.cloudflare.com`.
3. Log into **letshost.ie** → your domain → **Nameservers** → replace theirs
   with Cloudflare's two. Save.
4. Wait for propagation. Usually minutes, occasionally a few hours. Cloudflare
   emails you when the zone goes active.
5. Before you switch, **check the existing DNS records Cloudflare imported** —
   if you have email on this domain (MX records) they must survive the move, or
   your mail stops. Cloudflare usually imports them correctly; verify anyway.

> You are *not* transferring the registration. letshost still owns the
> registration and still takes your renewal money. You're only changing which
> servers answer DNS queries.

### Phase 4 — Attach the domain

1. Pages project → **Custom domains → Set up a custom domain**.
2. Add `davidpower.ie`. Cloudflare creates the record itself, using CNAME
   flattening so the apex works.
3. Add `www.davidpower.ie` as well, so both spellings resolve.
4. TLS is provisioned automatically. Give it a few minutes, then load
   `https://davidpower.ie`.

### Phase 5 — Point `.eu` at `.ie`

Do **not** attach `davidpower.eu` to the Pages project — that would serve the
same site at two addresses, which splits your SEO and looks sloppy. Redirect it.

1. In the `davidpower.eu` zone, add a **proxied** (orange cloud) DNS record so
   there's something for the rule to act on:

   | Type | Name | Content | Proxy |
   | --- | --- | --- | --- |
   | `A` | `@` | `192.0.2.1` | Proxied |
   | `A` | `www` | `192.0.2.1` | Proxied |

   `192.0.2.1` is the reserved documentation address. Nothing ever connects to
   it — Cloudflare intercepts at the edge and the rule below answers.

2. **Rules → Redirect Rules → Create rule**:

   - **If**: `Hostname` `equals` `davidpower.eu` **OR** `Hostname` `equals`
     `www.davidpower.eu`
   - **Then**: Dynamic redirect, expression:
     ```
     concat("https://davidpower.ie", http.request.uri.path)
     ```
   - Status: **301 (Permanent)**, preserve query string: on

3. Test: `curl -sI https://davidpower.eu | head -3` should show
   `301` and `location: https://davidpower.ie/`.

### Phase 6 — Verify before you put the link on anything

- [ ] `https://davidpower.ie` loads, padlock is valid
- [ ] `https://www.davidpower.ie` loads
- [ ] `https://davidpower.eu` 301s to `https://davidpower.ie`
- [ ] `https://davidpower.ie/cv` prints to a clean two-page PDF
- [ ] `https://davidpower.ie/sitemap.xml` shows the real domain, not the placeholder
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
preview URL. If a deploy looks wrong, **Pages → Deployments → Rollback** puts
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
