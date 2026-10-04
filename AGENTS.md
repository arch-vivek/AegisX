# AGENTS.md

Project context for AI coding agents (Claude Code, Cursor, Codex, Gemini CLI, Copilot, etc.) working on
AegisX. Keep this file short — deep context lives in `docs/` and is linked below, not duplicated here.

## What this project is

AegisX: a client-only React/TypeScript web app for cyber-fraud awareness (My Bharat Hackathon). No
backend, no database, no accounts. Full context: [`docs/PRD.md`](./docs/PRD.md) ·
[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Commands

```bash
npm install          # also downloads a bundled Chromium for npm run test:browser
npm run dev           # local dev server
npm run build         # type-check + production build
npm test              # Vitest: unit + integration + accessibility (axe-core), jsdom
npm run test:server   # real-HTTP tests against the production header server
npm run test:browser  # real-Chrome tests: CSP enforcement, XSS safety, full click-through
npm run lint           # oxlint, includes jsx-a11y
npm run check          # everything above, in order — run this before considering any change done
```

## Non-negotiable conventions

- **No `dangerouslySetInnerHTML`, `.innerHTML =`, `eval`, or `new Function`.** Enforced by
  `src/lib/security.test.ts`; don't work around it.
- **No network calls of any kind** (`fetch`, `XMLHttpRequest`, `WebSocket`, etc.) in `src/`. AegisX is
  client-only by design (see ADR-0001). Same test file enforces this.
- **Every `target="_blank"` link must set `rel="noopener noreferrer"`.**
- **Treat all `localStorage` data as untrusted input** — validate shape/type/range on every read (see
  `src/lib/stats.ts`, `src/lib/prefs.ts` for the pattern). Never assume stored data matches its type.
- **The risk engine (`src/lib/riskEngine.ts`) must stay a pure, deterministic function.** No side effects,
  no randomness, no network. Every new detection rule needs a named indicator with a plain-language
  `detail` string — the whole point of the product is explainability, not a black-box score.
- **New risk-engine rules need a labeled test case** in `src/lib/__fixtures__/sampleData.ts`, picked up
  automatically by `riskEngine.test.ts`.
- **A change that affects a structural decision (data model, routing approach, library choice, scoring
  model) needs an ADR** — see [`docs/adr/`](./docs/adr/0000-index.md). A change that's just
  implementation detail doesn't.
- **Don't weaken the CSP in `vercel.json`** (e.g., adding `unsafe-inline` to `script-src`) without
  updating `SECURITY.md` and re-running `npm run test:browser` to confirm nothing actually required it —
  see ADR-0005 for why `style-src` doesn't need it despite looking like it should.
- **Keep English as the baseline language.** Multilingual support is a documented future phase
  (`docs/IMPLEMENTATION_PLAN.md` Phase 3), not an ad-hoc addition.
- **Before calling anything done, run `npm run check`.** If it isn't green, it isn't done.

## Where things live

| Looking for... | Go to |
|---|---|
| Requirements (what/why) | `docs/PRD.md` |
| Technical requirements (how, traceable to PRD) | `docs/TRD.md` |
| System design, module breakdown, security posture | `docs/ARCHITECTURE.md` |
| Screen flows | `docs/APP_FLOW.md` |
| Design tokens, components | `docs/UI_UX.md` |
| Data model (current + proposed future backend) | `docs/BACKEND_SCHEMA.md` |
| Function contracts | `docs/API_REFERENCE.md` |
| Test strategy | `docs/TEST_PLAN.md` |
| Why a structural decision was made | `docs/adr/` |
| Known risks | `docs/RISK_REGISTER.md` |
| Deployment | `docs/DEPLOY_VERCEL.md` |
| Full index | `docs/README.md` |

## For human contributors

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for PR conventions; this file is written for agents, that one
for people — they should never contradict each other.
