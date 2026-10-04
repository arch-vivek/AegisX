# Architecture Decision Records

An ADR records a structural decision, its context, and what was considered and rejected — the part of
"vibe coding" a conversation history doesn't preserve on its own. Format: lightweight Michael Nygard style
(Status / Context / Decision / Consequences / Alternatives considered).

| ID | Title | Status |
|---|---|---|
| [0001](./0001-client-only-architecture.md) | Client-only architecture — no backend in the MVP | Accepted |
| [0002](./0002-hand-built-ui-components.md) | Hand-built shadcn/ui-pattern components instead of the shadcn CLI | Accepted |
| [0003](./0003-risk-scoring-calibration.md) | Severity-weighted risk scoring: a single high-severity signal is decisive | Accepted (superseded an earlier calibration) |
| [0004](./0004-in-house-router.md) | In-house router instead of a routing library | Accepted |
| [0005](./0005-self-hosted-fonts-and-csp.md) | Self-hosted fonts; strict CSP with no `unsafe-inline` in `script-src` | Accepted |
| [0006](./0006-three-layer-testing.md) | Three-layer test strategy (jsdom, real HTTP, real browser) | Accepted |
| [0007](./0007-mit-license.md) | MIT license for the hackathon submission | Accepted |

## When to write a new ADR

Per [`AGENTS.md`](../../AGENTS.md): any change to the data model, routing approach, a core library choice,
the scoring model, or the security header policy. Pure implementation detail (refactoring a component,
adding a new scenario, fixing a bug) does not need one. Copy the template below.

## Template

```markdown
# ADR-NNNN: <short title>

**Status:** Proposed | Accepted | Superseded by ADR-XXXX

## Context
What problem or constraint forced a decision?

## Decision
What was decided, stated as a single clear sentence.

## Consequences
What becomes easier, what becomes harder, what risk is accepted.

## Alternatives considered
What else was evaluated and why it was rejected.
```
