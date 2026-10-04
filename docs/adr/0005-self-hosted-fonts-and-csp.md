# ADR-0005: Self-hosted fonts; strict CSP with no `unsafe-inline` in `script-src`

**Status:** Accepted

## Context

The MVP loaded Atkinson Hyperlegible from Google Fonts via `@import url(fonts.googleapis.com/...)`. A
real-browser smoke test (`node scripts/browser-check.mjs`'s predecessor) surfaced a console `403` on that
request — caused by the *build sandbox's* own network egress policy blocking `fonts.googleapis.com`, not a
defect in the font request itself. Separately, the production hardening pass introduced a strict CSP
(`vercel.json`) with no `unsafe-inline`/`unsafe-eval` in `script-src`, raising a real question: would
Radix UI's dynamic inline styles (e.g., the Progress bar's `style={{ transform }}`) get silently blocked
under a CSP with no `unsafe-inline` in `style-src` either?

## Decision

1. **Self-host the font** via `@fontsource/atkinson-hyperlegible` instead of depending on any external
   font CDN at runtime — this removes the *only* third-party network dependency the page ever had, in any
   environment, not just this sandbox.
2. **Keep `style-src 'self'` with no `unsafe-inline`, and verify rather than assume** whether this breaks
   Radix's inline styles. A real-Chrome test (`scripts/browser-check.mjs`) confirmed **zero CSP
   violations** and that the Progress bar's inline `transform` renders correctly. The reason: React sets
   inline styles via the CSSOM property interface (`element.style.property = value` /
   `style.setProperty()`), not via `setAttribute('style', ...)` or markup parsing — and CSP's `style-src`
   restriction governs the latter, not direct CSSOM manipulation, in current browser implementations. No
   `unsafe-inline` was needed after all.

## Consequences

- **Easier:** the app makes zero runtime network requests of any kind (verified by a source-scan test
  banning `fetch`/`XHR`/`WebSocket` outright) — stronger than just "this sandbox blocks it," a real
  privacy/reliability property in any deployment.
- **Harder:** none identified — this decision only removed a dependency and tightened a policy, and the
  empirical test exists specifically so a future change that *does* require loosening `style-src` would
  be caught by a failing test rather than discovered in production.

## Alternatives considered

- **Add `unsafe-inline` to `style-src` preemptively "to be safe":** rejected once the real-browser test
  showed it wasn't necessary — weakening a security header on an unverified assumption would have been
  the wrong default.
- **Keep Google Fonts and just note the sandbox limitation in docs:** rejected — self-hosting is strictly
  better (one fewer third party, one fewer point of failure) and costs nothing once identified.
