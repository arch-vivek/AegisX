# Contributing to AegisX

Thanks for considering a contribution. This file is for human contributors; if you're an AI coding agent,
see [`AGENTS.md`](./AGENTS.md) instead (the two should never contradict each other).

## Getting started

```bash
git clone <repo-url> aegisx && cd aegisx
npm install     # downloads a bundled Chromium too — see README.md if that's a problem on your network
npm run dev
```

## Before opening a pull request

Run the full check pipeline locally — it's exactly what CI runs:

```bash
npm run check
```

This covers lint, the full test suite (unit, integration, accessibility), a production build, real-HTTP
server security tests, real-browser CSP/XSS tests, and a dependency audit. A PR that doesn't pass this
won't pass CI either.

## Making a change

1. **Bug fix or small feature:** just make the change, add/update a test, make sure `npm run check` is
   green, open a PR.
2. **New risk-engine detection rule:** add it to `src/lib/riskEngine.ts` with a named indicator and a
   plain-language `detail` explaining *why* it's a signal (explainability is the product's core promise —
   no opaque scores). Add a labeled case to `src/lib/__fixtures__/sampleData.ts`; `riskEngine.test.ts`
   picks it up automatically.
3. **Structural change** (data model, routing, a core library choice, the scoring model, the security
   header policy): add an [ADR](./docs/adr/0000-index.md) explaining the context and decision *before* or
   alongside the change. Future contributors (human or AI) shouldn't have to reverse-engineer *why*
   something is built the way it is.
4. **Anything touching accessibility:** `npm test` includes an axe-core pass across every route and theme
   with a zero-violations requirement — it must stay zero.
5. **Anything touching `vercel.json`'s headers:** `npm run test:browser` verifies the real CSP against a
   real browser. Don't loosen a header without that test passing and `SECURITY.md` updated to match.

## Commit and PR conventions

- Commit messages: short, imperative ("Add OTP-request indicator", not "Added" or "Adding").
- Update [`CHANGELOG.md`](./CHANGELOG.md) under an `[Unreleased]` heading for any user-facing change.
- Keep documentation in sync: if your change makes a claim in `docs/` inaccurate (especially
  `docs/COMPLIANCE.md`, which is deliberately honest about what's *not* done), update it in the same PR.

## Code of conduct

Participation in this project is governed by [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

## Reporting a security issue

Do not open a public issue — see [`SECURITY.md`](./SECURITY.md) for the disclosure process.
