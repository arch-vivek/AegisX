# AegisX

**My Bharat Hackathon · Theme: Digital Safety and Cyber Fraud Awareness**

A citizen-centric digital-safety companion. Paste a suspicious message or link and get an
explainable, rule-based risk assessment — then clear guidance on what to do next.

> AegisX is an **advisory awareness tool** and an **independent project** — it is not an official
> Government of India website. It does not and cannot definitively prove fraud, and it is designed to
> complement — never replace — official cybercrime reporting channels (cybercrime.gov.in, helpline 1930).

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
- [Security](#security)
- [Government-standards alignment](#government-standards-alignment)
- [Documentation](#documentation)
- [Contributing & AI-agent context](#contributing--ai-agent-context)
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
- **Respond** — a step-by-step incident-response playbook for four common situations, each
  pointing to India's official reporting channels: cybercrime.gov.in, helpline **1930**, and the
  Sanchar Saathi **Chakshu** facility for suspicious-but-not-yet-costly communications.
- **Dashboard** — an on-device summary of what you've checked, with a working "Clear saved data"
  control. No account, no server; nothing leaves the browser.
- **Policy pages** — Privacy Policy, Terms of Use, Accessibility Statement, Disclaimer/Copyright/
  Hyperlinking Policy, Contact & Feedback, and a Sitemap — real URL-routed pages, not placeholders.
- **Accessibility toolbar** — text-size control (A-/A/A+) and three colour themes including a
  high-contrast mode, applied before first paint.

Everything runs **entirely client-side and makes zero network requests at runtime** — no backend, no
data collection, no third-party calls (the font is self-hosted rather than fetched from Google Fonts).
See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full design, and [`SECURITY.md`](./SECURITY.md)
for how this is enforced and tested, not just claimed.

## Tech stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4**
- Hand-built, accessible **shadcn/ui-pattern components** (Radix UI primitives +
  `class-variance-authority` + a `cn()` merge utility) — the same conventions as the
  shadcn/ui library, authored locally rather than pulled from the shadcn registry (this
  build environment's network egress doesn't reach `ui.shadcn.com`; in an unrestricted
  environment `npx shadcn@latest add <component>` would work identically against these
  same files)
- A tiny in-house URL router (`src/lib/router.tsx`) — real per-page URLs without an extra dependency
- Design system: **"Accessible & Ethical"** navy/blue palette, **Atkinson Hyperlegible**
  font (WCAG-friendly, dyslexia-conscious, self-hosted via `@fontsource`)
- `lucide-react` icons
- **Vitest** + **@testing-library/react** + **axe-core** for unit, integration, and accessibility tests
- **Node's built-in test runner** for real-HTTP server security tests

## Setup

**Prerequisites:** Node.js 20+ (22 recommended — see `.nvmrc`) and npm.

```bash
git clone <this-repo-url> aegisx    # or unzip the submitted archive
cd aegisx
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

> `npm install` downloads a bundled Chromium (~300 MB, one-time) because of the `puppeteer` dev
> dependency used by `npm run test:browser` below. If you're on a restricted network and don't need
> that script, skip it with `PUPPETEER_SKIP_DOWNLOAD=true npm install`.

## Environment variables

**None are required to run AegisX.** There is no backend, no API key, and no third-party service to
configure — analysis runs entirely in the browser. See [`.env.example`](./.env.example).

The one optional variable:

| Variable | Required? | Purpose |
|---|---|---|
| `VITE_CONTACT_EMAIL` | No | Shown on the Contact & Feedback page. If unset, that page shows "not configured" instead of an email address. |

Copy `.env.example` to `.env.local` (already git-ignored) for local development, or set the same
variable in your hosting provider's dashboard (see [Deployment](#deployment)). Only variables prefixed
`VITE_` are exposed to browser code — never put a secret in one, since it ships in the public bundle.

## Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally (plain, no custom headers) |
| `npm run preview:secure` | Serve `dist/` with the **exact same security headers and SPA routing** as production — use this to sanity-check before deploying |
| `npm test` | Run the unit/integration/accessibility test suite (Vitest) |
| `npm run test:server` | Run real-HTTP tests against the production header server (headers, routing, traversal resistance) |
| `npm run test:browser` | Run a real-Chrome check against the production build: CSP enforcement, XSS safety, and a full click-through of every feature |
| `npm run lint` | Run `oxlint` (includes `jsx-a11y` accessibility linting) |
| `npm run audit:prod` | Check production dependencies for known high/critical vulnerabilities |
| `npm run check` | Everything above in sequence — the same pipeline CI runs |

## Project structure

```
.github/
  workflows/ci.yml  Lint, test, build, server-security tests, audit on every push
  dependabot.yml    Weekly dependency update PRs
docs/
  README.md           Documentation index + how the documents relate
  PRD.md              Product Requirements Document
  TRD.md              Technical Requirements Document
  APP_FLOW.md         Site map + per-feature flow diagrams
  UI_UX.md            Design system, component inventory, wireframes
  ARCHITECTURE.md     Technical Design Document (diagrams, module breakdown, security, scaling)
  BACKEND_SCHEMA.md   Current data model + proposed future database schema
  API_REFERENCE.md    Function-contract reference for analyze() and local storage
  TEST_PLAN.md        Three-layer test strategy and exit criteria
  SAMPLE_DATA.md      Labeled sample inputs and how the test suite uses them
  RISK_REGISTER.md    Risks, mitigations, and a risk heat map
  IMPLEMENTATION_PLAN.md   Delivery phases, timeline, roles
  COMPLIANCE.md       Honest alignment check against GIGW 3.0, DPDP, and CERT-In
  DEPLOY_VERCEL.md    Step-by-step free deployment guide
  adr/                Architecture Decision Records (7 real decisions, with context + alternatives)
scripts/
  serve-secure.mjs        Local server that mirrors vercel.json's headers + SPA rewrite
  serve-secure.test.mjs   Real-HTTP tests against that server
  browser-check.mjs       Real-Chrome CSP/XSS/functional check against the production build
src/
  components/ui/     shadcn-pattern primitives (button, card, badge, progress, ...)
  components/         Nav, Footer, A11yToolbar, ErrorBoundary, ExternalLink, PolicyLayout
  config/site.ts      Site-wide, non-secret configuration
  lib/router.tsx, routes.ts   URL-based routing
  lib/riskEngine.ts   Explainable, rule-based, input-capped URL/message risk engine
  lib/prefs.ts, stats.ts   Validated localStorage read/write (untrusted-input handling)
  lib/content.ts      Scenario, quiz, and incident-response content
  lib/__fixtures__/sampleData.ts   Labeled sample cases (shared by docs + tests)
  pages/              Home, Analyzer, Simulator, Learn, Respond, Dashboard, Policies
AGENTS.md            Context for AI coding agents (Claude Code, Cursor, Codex, Gemini CLI)
CLAUDE.md            Thin Claude-specific pointer to AGENTS.md
CONTRIBUTING.md      Setup, PR checklist, when to write an ADR
CODE_OF_CONDUCT.md   Community standards
CHANGELOG.md         Version history (Keep a Changelog format)
SECURITY.md          Threat model, mitigations, vulnerability disclosure
LICENSE
vercel.json          Build config + security headers + SPA rewrite for deployment
```

## Testing

```bash
npm test          # unit, integration, and accessibility tests (Vitest)
npm run test:server   # real-HTTP security tests against the production header server
```

`npm test` covers: correct Low/Medium/High classification against every labeled sample case;
explainability (every non-Low result carries named indicators with a stated reason); score capping;
URL extraction (including bare domains with no `http://`/`www.` prefix); false-positive avoidance on
legitimate domains; input-length and link-count caps; fuzz testing with hundreds of random inputs;
resistance to regex-backtracking (ReDoS) pathological input; `localStorage`/preference sanitisation
against malformed data and prototype-pollution payloads; routing correctness; content integrity
(every quiz question and scenario is well-formed); the security-header configuration itself; and
**zero axe-core accessibility violations on every route, in every colour theme**.

`npm run test:server` spins up the actual local production-header server and makes real HTTP requests
to confirm headers are present, SPA routing works, assets are cached immutably, and path-traversal
attempts (both literal `../` and `%2f`-encoded) cannot read files outside `dist/`.

`npm run test:browser` is the one layer the others structurally can't cover: Vitest's accessibility
tests run in jsdom, which does not enforce Content-Security-Policy. This script loads the real
production build through the real `vercel.json` headers in an actual Chrome instance and confirms: zero
CSP violations on any route, a pasted `<img src=x onerror=...>` payload never executes and is never
parsed as HTML (only ever held as an inert form value), the Radix-driven progress bar's inline style
still renders correctly under the strict CSP, and a full click-through of the Analyzer, Simulator, Learn
quiz, Dashboard (including "Clear saved data"), and the accessibility toolbar all work end to end with
no broken internal links.

See [`docs/SAMPLE_DATA.md`](./docs/SAMPLE_DATA.md) for the full labeled set and how to add a new case.

## Security

AegisX ships with production security hardening, not just a plain static build:

- Strict security headers (CSP, HSTS, X-Frame-Options, and more) via `vercel.json`
- Zero runtime network calls (self-hosted font, no analytics/tracking)
- No dangerous DOM sinks (`innerHTML`, `eval`, etc.) — enforced by an automated source scan
- All `localStorage` data treated as untrusted and validated before use
- Bounded, fuzz-tested input handling in the risk engine
- CI-enforced linting, testing, and dependency auditing on every push

Full details, the threat/mitigation table, and how to report a vulnerability: [`SECURITY.md`](./SECURITY.md).

## Government-standards alignment

AegisX voluntarily aligns its technical design with Indian government web standards — WCAG 2.1 AA (via
GIGW 3.0), the mandatory policy-page set, and the DPDP Act's data-minimisation principle — while being
explicit about what would still require formal third-party audit or certification. See
[`docs/COMPLIANCE.md`](./docs/COMPLIANCE.md) for the honest, section-by-section breakdown. **This is an
engineering self-assessment, not a legal opinion.**

## Documentation

AegisX ships a full professional documentation suite, not just this README. Start at
**[`docs/README.md`](./docs/README.md)** for the complete index and a diagram of how the documents relate,
or jump straight to:

- [`docs/PRD.md`](./docs/PRD.md) — product requirements: problem, personas, use cases, functional & non-functional requirements
- [`docs/TRD.md`](./docs/TRD.md) — technical requirements, stack rationale, PRD traceability matrix
- [`docs/APP_FLOW.md`](./docs/APP_FLOW.md) — site map and a flow diagram for every feature
- [`docs/UI_UX.md`](./docs/UI_UX.md) — design system, component inventory, screen wireframes, accessibility rationale
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — system architecture, module breakdown, risk-scoring model, security posture, deployment/CI, scaling path
- [`docs/BACKEND_SCHEMA.md`](./docs/BACKEND_SCHEMA.md) — current client-side data model + proposed future database schema
- [`docs/API_REFERENCE.md`](./docs/API_REFERENCE.md) — the `analyze()` function contract and proposed future REST shape
- [`docs/TEST_PLAN.md`](./docs/TEST_PLAN.md) — the three-layer test strategy and exit criteria
- [`docs/SAMPLE_DATA.md`](./docs/SAMPLE_DATA.md) — labeled example inputs and expected outcomes
- [`docs/RISK_REGISTER.md`](./docs/RISK_REGISTER.md) — risks, mitigations, and a risk heat map
- [`docs/IMPLEMENTATION_PLAN.md`](./docs/IMPLEMENTATION_PLAN.md) — delivery phases, indicative timeline, roles
- [`docs/COMPLIANCE.md`](./docs/COMPLIANCE.md) — GIGW 3.0 / DPDP / CERT-In alignment self-assessment
- [`docs/DEPLOY_VERCEL.md`](./docs/DEPLOY_VERCEL.md) — deploy to Vercel for free, step by step
- [`docs/adr/`](./docs/adr/0000-index.md) — Architecture Decision Records: 7 real structural decisions made during this build, with context and rejected alternatives
- [`SECURITY.md`](./SECURITY.md) — threat model and vulnerability disclosure

## Contributing & AI-agent context

- [`AGENTS.md`](./AGENTS.md) — context file for AI coding agents (Claude Code, Cursor, Codex, Gemini CLI) working on this repo; [`CLAUDE.md`](./CLAUDE.md) is a thin Claude-specific pointer to it
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — setup, PR checklist, when a change needs an ADR
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) — community standards
- [`CHANGELOG.md`](./CHANGELOG.md) — version history (Keep a Changelog format)

## Deployment

The app builds to static files (`npm run build` → `dist/`), so it can be hosted on any static host or
CDN with no server component. **[`docs/DEPLOY_VERCEL.md`](./docs/DEPLOY_VERCEL.md) walks through
deploying it to Vercel for free**, including how `vercel.json` wires up the build command, security
headers, and client-side routing automatically.

## Accessibility

Targets **WCAG 2.1 Level AA**. 4.5:1+ text contrast, visible focus rings, 44×44px touch targets,
keyboard-navigable components (Radix primitives), a skip-to-content link, automatic focus management on
navigation, `prefers-reduced-motion` support, a text-size control, three colour themes (including high
contrast), and risk levels that are always paired with text/labels — never colour alone. Verified with
**zero axe-core violations across every route and theme** (`src/App.a11y.test.tsx`). Manual screen-reader
testing and a third-party audit have not been performed — see the in-app Accessibility Statement and
[`docs/COMPLIANCE.md`](./docs/COMPLIANCE.md) for what's honestly still open (notably, multilingual support).

## Limitations

Rule-based detection can produce false positives/negatives and will not catch novel scam wording it has
no pattern for. Risk scores are advisory signals, not verdicts. AegisX is English-only today. See the
in-app "What AegisX is, and isn't" section on the Home page, [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
Section 6 for how scoring works, and [`docs/COMPLIANCE.md`](./docs/COMPLIANCE.md) for what full
government-standard alignment would still require.

## License

MIT — see [`LICENSE`](./LICENSE).
