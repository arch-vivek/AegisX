# Deploying AegisX to Vercel for Free

AegisX is a static site (no backend, no database), which is exactly what Vercel's free **Hobby** plan
is built for. This guide gets you from the project folder to a live HTTPS URL.

> **Vercel's Hobby plan is free for personal, non-commercial projects.** A hackathon submission,
> portfolio piece, or personal demo qualifies. If you later run AegisX for a company or as a paid
> product, Vercel's terms require the paid **Pro** plan — check current plan details and limits at
> <https://vercel.com/pricing> and <https://vercel.com/docs/limits/fair-use-guidelines>, since exact
> numbers change over time.

## Prerequisites

- A [GitHub](https://github.com) account (or GitLab/Bitbucket) with this project pushed to a repository.
  Vercel can also deploy directly from your computer without Git (see Method B), but Git-based deploys
  give you automatic redeploys on every push, which is worth having.
- A free [Vercel](https://vercel.com/signup) account — you can sign up directly with your GitHub account.
- Node.js 20+ installed locally only if you want to build/test before pushing (recommended, not required).

## What's already set up for you

This repo includes a [`vercel.json`](../vercel.json) that tells Vercel exactly how to build and serve
AegisX, so you should not need to configure anything by hand:

- **Framework:** Vite (auto-detected, and pinned explicitly)
- **Install command:** `npm ci`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Security headers** (CSP, HSTS, X-Frame-Options, etc. — see [`SECURITY.md`](../SECURITY.md)) applied to every response
- **SPA rewrite** so routes like `/analyze` or `/respond` work on direct load and on refresh, not just via in-app navigation
- **Immutable caching** for fingerprinted JS/CSS assets

## Method A — Deploy via the Vercel dashboard (recommended, no CLI needed)

1. Push this project to a GitHub repository (skip if it's already there):
   ```bash
   git init
   git add .
   git commit -m "AegisX: production-ready hackathon submission"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. Go to <https://vercel.com/new>.
3. Click **Import Git Repository**, authorise Vercel to access GitHub if asked, and select your repo.
4. Vercel reads `vercel.json` and should show **Framework Preset: Vite** with the build command and
   output directory already filled in. You don't need to change these.
5. (Optional) Add an environment variable — see [Environment variables](#environment-variables) below.
6. Click **Deploy**. The first build takes roughly 30–90 seconds.
7. When it finishes, Vercel gives you a live URL like `https://aegisx-yourname.vercel.app`. Open it.

From now on, **every `git push` to `main` automatically redeploys** the live site, and every pull
request gets its own temporary preview URL for review before merging.

## Method B — Deploy via the Vercel CLI (no GitHub required)

```bash
npm install -g vercel     # one-time global install
cd aegisx                 # this project's folder
vercel login              # opens a browser to authenticate — free, no card required
vercel                    # first run: answer the setup prompts, deploys a *preview* build
vercel --prod             # promotes to your production URL
```

The CLI prompts (set up and deploy? which scope/account? link to existing project? project name?
directory?) can all be accepted with their defaults for a first deploy — `vercel.json` supplies the
build settings either way.

## Environment variables

AegisX needs **no environment variables to run** — see [`.env.example`](../.env.example). The only
optional one is the contact address shown on the Contact page:

1. In the Vercel dashboard: **Project → Settings → Environment Variables**.
2. Add `VITE_CONTACT_EMAIL` with your address, applied to **Production** (and Preview/Development if you
   want it there too).
3. Redeploy (Vercel does this automatically after an env var change if you click **Redeploy**, or on the
   next git push).

Never put a secret in a `VITE_`-prefixed variable: Vite inlines these into the JavaScript that ships to
every visitor's browser by design. AegisX has no secrets to store.

## Verifying the deployment

1. **Headers:** confirm the security headers from `vercel.json` are live:
   ```bash
   curl -sD - -o /dev/null https://<your-deployment-url>/
   ```
   You should see `content-security-policy`, `strict-transport-security`, `x-frame-options: DENY`, and
   the other headers listed in [`SECURITY.md`](../SECURITY.md).
2. **Routing:** open `https://<your-deployment-url>/analyze` directly (not by clicking through the app)
   and refresh it — it should load the Analyzer, not a 404, confirming the SPA rewrite is working.
3. **Before pushing changes**, run the same checks locally that CI runs:
   ```bash
   npm run check   # lint, unit + accessibility tests, build, header-server tests, dependency audit
   ```

## Custom domain (optional)

Vercel gives every project a free `*.vercel.app` subdomain automatically — nothing else is required to
have a working public URL. If you own a custom domain, **Project → Settings → Domains → Add** and follow
Vercel's DNS instructions; free-plan projects can attach a custom domain at no extra cost (domain
registration itself is a separate cost from your registrar, not from Vercel).

## Rolling back a bad deploy

**Project → Deployments**, find a previous working deployment, click the **⋯** menu, and choose
**Promote to Production**. This takes effect immediately, with no rebuild needed.

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Build fails on `npm ci` | Make sure `package-lock.json` is committed — `npm ci` requires it. |
| Visiting `/analyze` (or any non-home route) directly gives a 404 | The SPA rewrite in `vercel.json` isn't being picked up — confirm `vercel.json` is committed at the project root and that Framework Preset is "Vite", not "Other". |
| Headers from `SECURITY.md` are missing | Same as above — `vercel.json`'s `headers` block only applies once Vercel recognises the config file; check **Deployments → (latest) → Source** to confirm `vercel.json` was included in that deployment. |
| Deploy succeeds but the site is blank | Open the browser console for errors; run `npm run build && npm run preview:secure` locally first to reproduce with the exact production headers before redeploying. |
| "This project exceeds Hobby plan limits" | Extremely unlikely for a static site with normal hackathon-demo traffic; if it happens, check current Hobby limits at vercel.com/pricing, or move to Pro. |
