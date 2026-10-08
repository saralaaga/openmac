# OpenMac — openmac.dev

A curated, hands-on directory of open source apps for the Apple ecosystem, with
reviews based on real daily use. **Free your Mac. It can do anything.**

Full research and decision log: `Research/mac-ios-开源软件导航站-调研.md`.

## Stack (phase 1)

| Layer | Choice |
|---|---|
| Framework | Astro 7 (static) + MDX |
| Styling | Tailwind CSS v4 + daisyUI v5 (dark-first, Apple-flavored tokens) |
| CMS | Sveltia CMS at `/admin` (git-based, Decap-compatible) |
| Reviews | `src/content/reviews/*.mdx`, linked to apps via `app: slug` frontmatter |
| Directory data | `src/data/apps/*.json` + `src/data/taxonomy.json` |
| Search | Pagefind (build-time static index) |
| Comments | **Self-hosted on D1** (`functions/api/comments/*` + `src/components/Comments.astro`); posting requires better-auth sign-in |
| RSS | `/rss.xml` via @astrojs/rss |
| Deploy | Cloudflare Pages (`wrangler.toml`) |
| Metadata sync | GitHub Actions daily cron → `scripts/sync-metadata.mjs` |

## Page map

- `/` — hero, categories, most starred, latest reviews
- `/apps` — directory with client-side category filter
- `/apps/category/[category]` — category pages (SEO intros in `taxonomy.json`)
- `/platform/[platform]` — device axis: mac / iphone / ipad / watch / tv / vision
- `/apps/[slug]` — app page: install aggregation (brew copy button, MAS,
  TestFlight), metadata badges (stars, last release, license, Apple Silicon,
  activity status), linked review card, related apps, Giscus, JSON-LD
- `/reviews`, `/reviews/[slug]` — hands-on reviews (Cactus-inspired dark minimal)
- `/about` — E-E-A-T author page
- `/admin` — Sveltia CMS

Activity badge logic (`src/lib/apps.ts`): last release < 6 months = active,
6–12 = slowing down, > 12 = unmaintained.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ + pagefind index
npm run sync     # manual metadata refresh (needs GITHUB_TOKEN for rate limits)
```

## Deploy (Cloudflare Pages)

```bash
npx wrangler pages deploy dist --project-name=openmac
```

Custom domain `openmac.dev` is already an active zone in the CF account.

## Phase 2 (planned, see research doc §13.2)

- better-auth (Google sign-in) on Astro server endpoints via
  `@astrojs/cloudflare` adapter + D1
- Comments migrate from Giscus to D1-backed, unified with site accounts
- CF Turnstile on forms/login (better-auth captcha plugin)
- `/compare/[a]-vs-[b]` pages
- CF anti-bot day-one checklist: Bot Fight Mode, AI crawler controls
  (block AI bots), WAF rules, rate limit — remember to keep Googlebot unblocked

## Notes

- The 4 sample apps (`rectangle`, `maccy`, `stats`, `localsend`) ship with
  approximate metadata; `npm run sync` (or the Actions cron once pushed to
  GitHub) refreshes stars/releases from the GitHub API.
- `public/admin/config.yml` needs the real GitHub username after repo creation.
- Giscus needs the repo public + Discussions enabled → https://giscus.app
