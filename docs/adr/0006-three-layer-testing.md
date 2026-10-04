# ADR-0006: Three-layer test strategy (jsdom, real HTTP, real browser)

**Status:** Accepted

## Context

Vitest/jsdom tests (Layer 1) cover logic, component rendering, and axe-core accessibility checks quickly,
but jsdom does not implement or enforce Content-Security-Policy, real network behavior, or an actual
rendering engine. This was a real, not hypothetical, gap: ADR-0005's CSP question could only be answered
by an actual browser, and the production header/path-traversal behavior in `scripts/serve-secure.mjs`
could only be meaningfully verified against a real running HTTP server, not a mocked one.

## Decision

Maintain three distinct, independently-runnable test layers, each targeting what the others structurally
cannot catch: Vitest/jsdom (`npm test`) for logic/component/accessibility; Node's built-in test runner
against a real running instance of the production header server (`npm run test:server`) for
headers/routing/path-traversal; Puppeteer against the real built app under the real headers in actual
Chrome (`npm run test:browser`) for CSP enforcement and true XSS behavior. All three run in CI
(`.github/workflows/ci.yml`) and are bundled as `npm run check`.

## Consequences

- **Easier:** each class of regression has a layer that will actually catch it — a CSP regression, a
  path-traversal regression, and a logic regression are three different kinds of bugs with three different
  minimum-viable test environments.
- **Harder:** `npm install` now downloads a bundled Chromium (~300MB) for Puppeteer, and CI takes longer.
  Accepted deliberately — see `docs/TEST_PLAN.md` for the explicit trade-off statement, and the
  `PUPPETEER_SKIP_DOWNLOAD=true` escape hatch documented in `README.md` for network-restricted setups
  that don't need Layer 3 locally (CI still runs it).

## Alternatives considered

- **jsdom only:** rejected — demonstrably insufficient; it cannot enforce CSP at all, so a whole class of
  "did the security header actually work" bugs would ship undetected.
- **Real browser for everything, drop jsdom:** rejected — far slower for the bulk of unit-level logic
  testing (77 of the project's tests are Layer 1), and axe-core's jsdom integration is already
  well-established and fast; reserving Puppeteer for what jsdom can't do keeps the fast feedback loop fast.
