# AegisX

** · Theme: Digital Safety and Cyber Fraud Awareness**

A citizen-centric digital-safety companion. Paste a suspicious message or link and get an
explainable, rule-based risk assessment — then clear guidance on what to do next.

> AegisX is an **advisory awareness tool**. It does not and cannot definitively prove
> fraud, and it is designed to complement — never replace — official cybercrime
> reporting channels (cybercrime.gov.in, helpline **1930**).

**Flow:** `RECOGNIZE → VERIFY → RESPOND → REPORT → LEARN`

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Setup](#setup)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Testing](#testing)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [Accessibility](#accessibility)
- [Limitations](#limitations)
- [License](#license)

## Features

- **Analyzer** — paste a message or URL; a transparent, rule-based engine (no black box)
  matches named indicators (suspicious domains, URL obfuscation, urgency language,
  OTP/PIN requests, impersonation patterns, advance-fee hooks, etc.) and shows an
  explainable risk level (Low / Medium / High) with a stated reason for every flag raised.
- **Scenario Simulator** — realistic scam scenarios (fake KYC SMS, courier-fee scam,
  job-offer scam, "bank security" OTP call); pick a response and see why it was safe or risky.
- **Learn** — short awareness modules (phishing, social engineering, OTP/UPI safety) plus a
  5-question quiz with explained answers.
- **Respond** — a step-by-step incident-response playbook for four common situations
  (clicked a link, shared an OTP, made a payment, installed a remote-access app), each
  pointing to the official reporting channels.
- **Dashboard** — a simple on-device summary of what you've checked. No account, no
  server; nothing leaves the browser (uses `localStorage` only).

Everything runs **entirely client-side** — no backend, no data collection — matching the
project's minimal-data-collection, privacy-first stance. See
[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for how this evolves toward a networked
production system.

## Tech stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4**
- Hand-built, accessible **shadcn/ui-pattern components** (Radix UI primitives +
  `class-variance-authority` + a `cn()` merge utility) — the same conventions as the
  shadcn/ui library, authored locally rather than pulled from the shadcn registry (this
  build environment's network egress doesn't reach `ui.shadcn.com`; in an unrestricted
  environment `npx shadcn@latest add <component>` would work identically against these
  same files)
- Design system: **"Accessible & Ethical"** navy/blue palette, **Atkinson Hyperlegible**
  font (WCAG-friendly, dyslexia-conscious) — chosen to read as a trustworthy,
  government-adjacent civic tool rather than a flashy product
- `lucide-react` icons
- **Vitest** for automated tests

## Setup

**Prerequisites:** Node.js 20+ and npm (or a compatible package manager).

```bash
git clone <this-repo-url> aegisx    # or unzip the submitted archive
cd aegisx
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

## Environment variables

**None are required.** AegisX's MVP has no backend, no API keys, and no third-party
services to configure — analysis runs entirely in the browser. There is intentionally no
`.env` file. If a future networked version (see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md#8-future-scalability))
adds a backend API, its URL and any secrets would be introduced as
`VITE_`-prefixed variables in a `.env.local` file (git-ignored) and documented here at
that time — the prefix is required for Vite to expose a variable to client code.

## Available scripts

| Command           | Purpose                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `npm run dev`     | Start the local dev server with hot reload                           |
| `npm run build`   | Type-check (`tsc -b`) and produce a production build in `dist/`      |
| `npm run preview` | Serve the production build locally, to sanity-check before deploying |
| `npm test`        | Run the automated test suite (Vitest)                                |
| `npm run lint`    | Run `oxlint`                                                         |

## Project structure

```
docs/
  ARCHITECTURE.md   Technical Design Document (diagrams, module breakdown, scoring model)
  SAMPLE_DATA.md     Labeled sample inputs and how the test suite uses them
src/
  components/ui/     shadcn-pattern primitives (button, card, badge, tabs, ...)
  components/Nav.tsx Top navigation
  lib/riskEngine.ts  Explainable, rule-based URL/message risk engine
  lib/riskEngine.test.ts  Automated tests for the engine
  lib/__fixtures__/sampleData.ts  Labeled sample cases (shared by docs + tests)
  lib/content.ts     Scenario, quiz, and incident-response content
  lib/stats.ts       Local-only session stats (localStorage)
  pages/             Home, Analyzer, Simulator, Learn, Respond, Dashboard
LICENSE
```

## Testing

```bash
npm test
```

Covers: correct Low/Medium/High classification against every labeled sample case,
explainability (every non-Low result carries named indicators with a stated reason),
score capping, URL extraction (including bare domains with no `http://`/`www.` prefix),
and false-positive avoidance on legitimate/official-looking domains. See
[`docs/SAMPLE_DATA.md`](./docs/SAMPLE_DATA.md) for the full labeled set and how to add a
new case.

Manual verification performed during development: a production build (`npm run build`)
was confirmed to compile with zero TypeScript/bundler errors, and a full click-through of
every page (Home → Analyzer → Simulator → Learn → Respond → Dashboard) was smoke-tested
in a headless browser against the built output, confirming each page renders and the
Analyzer correctly flags a known scam example as High risk with matching explanations.

## Documentation

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — system context, application
  architecture, data-flow, module-by-module breakdown, the risk-scoring model, security
  posture, and the future-scalability path.
- [`docs/SAMPLE_DATA.md`](./docs/SAMPLE_DATA.md) — labeled example inputs and expected
  outcomes.

## Deployment

The app builds to static files (`npm run build` → `dist/`), so it can be hosted on any
static host or CDN (e.g. Netlify, Vercel, GitHub Pages, S3+CloudFront) with no server
component. Point the host's build command at `npm run build` and its publish directory
at `dist`.

## Accessibility

4.5:1+ text contrast, visible focus rings, 44×44px touch targets, keyboard-navigable
tabs/accordion (Radix primitives), a skip-to-content link, `prefers-reduced-motion`
support, and risk levels that are always paired with text/labels — never color alone.

## Limitations

Rule-based detection can produce false positives/negatives and will not catch novel scam
wording it has no pattern for. Risk scores are advisory signals, not verdicts. See the
in-app "What AegisX is — and isn't" section on the Home page for the full scope
statement, and [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) Section 6 for how scoring
works.

## License

MIT — see [`LICENSE`](./LICENSE).
