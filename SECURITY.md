# Security Policy

## Reporting a vulnerability

Please report security issues privately rather than opening a public GitHub issue.

- Email the address configured in `VITE_CONTACT_EMAIL` (see the live site's Contact page), or the
  repository owner directly.
- Include: what you found, steps to reproduce, and the potential impact.
- Please give us a reasonable time to fix the issue before disclosing it publicly, and avoid
  accessing data that isn't yours or disrupting the service while testing.

We aim to acknowledge reports within 5 business days.

## Scope

In scope: the AegisX web application, its build/deploy configuration (`vercel.json`, CI), and its
dependencies. Out of scope: third-party sites AegisX links to (cybercrime.gov.in, sancharsaathi.gov.in,
Google Fonts' font-hosting infrastructure — note the app self-hosts fonts precisely to avoid a runtime
dependency on that infrastructure).

## Supported versions

AegisX ships as a single rolling `main` branch (no long-term-support branches). Security fixes land on
`main`; deploy the latest build to stay covered.

## What "safe to use" means for this project

AegisX has **no backend, no database, and no user accounts** in this version — see
[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md). That significantly shrinks the attack surface (there is
no server-side auth, no SQL, no session store to compromise), so the security work here focuses on what
actually applies to a static, client-only site:

| Risk | Mitigation |
|---|---|
| XSS via injected content | No `dangerouslySetInnerHTML` / `innerHTML` assignment anywhere in the codebase (enforced by `src/lib/security.test.ts`); React escapes all rendered text by default. Verified against a real payload in a real browser by `npm run test:browser` — confirmed to never execute and never appear as parsed HTML anywhere in the page |
| Clickjacking | `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` |
| MIME-sniffing attacks | `X-Content-Type-Options: nosniff` |
| Data exfiltration via injected scripts | Strict CSP with no `unsafe-inline`/`unsafe-eval`, no wildcard sources; `connect-src 'self'` (the app makes no network calls at all — also enforced by an automated test) |
| Man-in-the-middle | `Strict-Transport-Security` (HSTS), enforced by Vercel's automatic HTTPS |
| Referrer leakage to linked sites | `Referrer-Policy: no-referrer` |
| Third-party embedding/tracking | `Permissions-Policy` disables camera/mic/geolocation/etc.; no analytics or tracking scripts of any kind |
| Tab-nabbing via external links | Every `target="_blank"` link sets `rel="noopener noreferrer"` (enforced by an automated test) |
| Malicious/oversized input to the risk engine | Input is capped (`MAX_INPUT_CHARS`, `MAX_URLS_ANALYZED`); engine is fuzz-tested and checked against ReDoS-style pathological input (`src/lib/riskEngine.hardening.test.ts`) |
| Tampered `localStorage` (shared devices, browser extensions, manual editing) | All locally stored data is treated as untrusted and validated before use, with type/range checks and a size cap (`src/lib/stats.ts`, `src/lib/prefs.ts`), including a prototype-pollution regression test |
| Path traversal against the static file server | The included local production-header server normalises and bounds-checks every request path before touching the filesystem, with an automated regression test (`scripts/serve-secure.test.mjs`); in production, Vercel's own static hosting serves this role |
| CSP silently breaking a feature (or silently not applying) | `npm run test:browser` loads the real build under the real headers in an actual Chrome instance and asserts zero CSP violations while exercising every page and feature — jsdom-based tests cannot catch this class of bug since jsdom doesn't enforce CSP |
| Known-vulnerable dependencies | `npm audit --omit=dev` runs in CI on every push, and Dependabot opens weekly update PRs |
| A rendering bug taking down the whole page | A top-level error boundary shows a calm fallback (with the 1930 helpline and cybercrime.gov.in) instead of a blank screen |

## What this is *not*

This is a good-faith engineering effort for a hackathon-to-production project, not a substitute for a
professional penetration test or a formal certification. See
[`docs/COMPLIANCE.md`](./docs/COMPLIANCE.md) for an honest breakdown of what is implemented versus what
would require external audit (e.g., STQC "Safe to Host" certification, a CERT-In empanelled auditor's
review).

## CERT-In incident reporting

The Indian Computer Emergency Response Team (CERT-In) Directions of 28 April 2022 require certain
covered entities (service providers, intermediaries, data centres, body corporates and government
organisations) to report specified categories of cyber incidents within 6 hours, to
`incident@cert-in.org.in`. Whether a specific deployment of this open-source project counts as a
"covered entity" is a legal question that depends on how and by whom it is operated — this document is
not legal advice. As good practice regardless of that determination, anyone operating a production
deployment of AegisX should have an incident-response contact (see above) and should treat a confirmed
breach as reportable.
