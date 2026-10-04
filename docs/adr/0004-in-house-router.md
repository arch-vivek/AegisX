# ADR-0004: In-house router instead of a routing library

**Status:** Accepted

## Context

The production hardening phase required real, bookmarkable per-page URLs (`/analyze`, `/privacy`, etc.) —
needed both for the GIGW-style policy pages to be independently linkable and for a sane browser
back/forward experience, replacing the earlier MVP's in-memory tab-switch navigation. AegisX has a small,
fixed set of ~12 known routes with no nested/dynamic segments.

## Decision

Write a minimal router (`src/lib/routes.ts` for path↔page mapping, `src/lib/router.tsx` for a context
provider, `popstate` handling, and a `Link` component) rather than adding a routing library.

## Consequences

- **Easier:** zero added dependency for a problem that's genuinely small (a fixed path-to-page lookup
  table); the whole implementation is under 100 lines and fully unit-tested (`routes.test.ts`), including
  adversarial inputs (path-traversal-looking strings, encoded tricks) which a general-purpose router would
  also need to handle but whose handling wouldn't be visible/auditable in this project's own test suite.
- **Harder:** no nested routes, route params, or code-splitting-per-route — all currently unneeded. If
  the route set grows significantly (e.g., per-scenario deep links with IDs), this should be revisited.

## Alternatives considered

- **A general-purpose router library:** rejected for now — would add a dependency and an API surface
  (loaders, nested outlets, etc.) far larger than ~12 flat routes need, and a security/dependency-audit
  surface area for functionality unused.
