# ADR-0001: Client-only architecture — no backend in the MVP

**Status:** Accepted

## Context

AegisX needed to analyze user-pasted messages/links and return a risk assessment. A conventional design
would send the input to a server for processing. The hackathon's own theme (digital safety) and target
users (citizens who may not trust an unfamiliar site with their data) made the privacy posture of that
choice unusually important, not just an implementation detail.

## Decision

Run the entire risk engine in the browser. No server, no database, no network call for the core feature.
`analyze()` is a pure function: `string in → structured result out`.

## Consequences

- **Easier:** zero data-collection risk by construction (nothing to breach, nothing to misuse); zero
  hosting cost (fits Vercel's free static-hosting tier, see ADR for deployment in `DEPLOY_VERCEL.md`);
  trivially fast (no network round-trip); simpler DPDP posture (see `docs/COMPLIANCE.md`).
- **Harder:** detection rules can't be updated without a redeploy; no server-aggregated threat
  intelligence; no cross-device history unless a user manually notes results. All three are explicitly
  deferred to Phase 2 in `docs/IMPLEMENTATION_PLAN.md`, gated on a proper DPDP review (see
  `docs/BACKEND_SCHEMA.md` Part B) specifically so this constraint isn't quietly abandoned later.

## Alternatives considered

- **Serverless function per analysis request:** rejected for the MVP — adds infrastructure, cost, and a
  data-in-transit question for no accuracy benefit, since the detection logic doesn't need server-side
  data at this stage.
- **Full backend with optional accounts from day one:** rejected — the hackathon MVP's value is in the
  core detection/education loop, not accounts; building a backend first would have traded a working,
  testable product for infrastructure nobody asked for yet.
