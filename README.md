# AegisX

**My Bharat Hackathon · Theme: Digital Safety and Cyber Fraud Awareness**

A citizen-centric digital-safety companion. Paste a suspicious message or link and get an
explainable, rule-based risk assessment — then clear guidance on what to do next.

> AegisX is an **advisory awareness tool**. It does not and cannot definitively prove
> fraud, and it is designed to complement — never replace — official cybercrime
> reporting channels (cybercrime.gov.in, helpline 1930).

## Flow

`RECOGNIZE → VERIFY → RESPOND → REPORT → LEARN`

## Features (hackathon MVP)

- **Analyzer** — paste a message or URL; a transparent, rule-based engine (no black box)
  matches named indicators (suspicious domains, URL obfuscation, urgency language,
  OTP/PIN requests, impersonation patterns, advance-fee hooks, etc.), and shows an
  explainable risk level (Low / Medium / High) with a reason for every flag raised.
- **Scenario Simulator** — realistic scam scenarios (fake KYC SMS, courier-fee scam,
  job-offer scam, "bank security" OTP call); pick a response and see why it was safe or risky.
- **Learn** — short awareness modules (phishing, social engineering, OTP/UPI safety) plus a
  5-question quiz with explained answers.
- **Respond** — a step-by-step incident-response playbook for four common situations
  (clicked a link, shared an OTP, made a payment, installed a remote-access app), each
  pointing to the official reporting channels.
- **Dashboard** — a simple on-device summary of what you've checked. No account, no
  server, nothing leaves the browser (uses `localStorage` only).

Everything runs **entirely client-side** — no backend, no data collection, matching the
project's minimal-data-collection, privacy-first stance.

## Tech stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4**
- Hand-built, accessible **shadcn/ui-pattern components** (Radix UI primitives +
  `class-variance-authority` + `cn()` merge utility) — same conventions as the shadcn/ui
  library, authored locally rather than pulled from the shadcn registry (this
  environment's network egress doesn't reach `ui.shadcn.com`)
- Design system: **"Accessible & Ethical"** navy/blue palette, **Atkinson Hyperlegible**
  font (WCAG-friendly, dyslexia-conscious) — chosen to read as a trustworthy,
  government-adjacent civic tool rather than a flashy product
- `lucide-react` icons (no emoji-as-icon)

## Accessibility

4.5:1+ text contrast, visible focus rings, 44×44px touch targets, keyboard-navigable
tabs/accordion (Radix primitives), skip-to-content link, `prefers-reduced-motion`
support, risk levels always paired with text/labels (never color alone).

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
  components/ui/    shadcn-pattern primitives (button, card, badge, tabs, ...)
  components/Nav.tsx
  lib/riskEngine.ts explainable rule-based URL/message risk engine
  lib/content.ts    scenario, quiz, and incident-response content
  lib/stats.ts      local-only session stats (localStorage)
  pages/            Home, Analyzer, Simulator, Learn, Respond, Dashboard
```

## Verification

Production build (`npm run build`) compiles cleanly with no TypeScript or bundler
errors. The full click-through flow (Home → Analyze → Simulator → Learn → Respond →
Dashboard) was smoke-tested against the built app in a headless browser, confirming
each page renders and the Analyzer correctly flags a known scam example as High risk
with matching explanations.

## Limitations

Rule-based detection can produce false positives/negatives and will not catch novel
scam wording it has no pattern for. Risk scores are advisory signals, not verdicts.
See the in-app "What AegisX is — and isn't" section for the full scope statement.
