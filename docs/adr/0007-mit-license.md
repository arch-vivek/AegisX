# ADR-0007: MIT license for the hackathon submission

**Status:** Accepted

## Context

The hackathon submission package needed an explicit license file; none was specified by the hackathon
rules as mandatory, so the choice was the project's own.

## Decision

License the project under MIT.

## Consequences

- **Easier:** maximally permissive for a hackathon submission meant to be judged, forked, and potentially
  built on by others, including by the hackathon organisers or other participants, with minimal friction.
- **Harder:** no explicit patent grant (unlike Apache-2.0) and no copyleft requirement that downstream
  forks remain open (unlike GPL) — accepted as appropriate for a project with no patent concerns and no
  strategic need to force downstream openness.

## Alternatives considered

- **Apache-2.0:** considered for its explicit patent grant; not chosen since there's no identified patent
  risk for a rule-based, non-novel detection approach, and MIT's shorter, more universally recognised text
  was judged a better fit for a submission judges will skim.
- **No license (all rights reserved by default):** rejected — would discourage exactly the kind of reuse
  and extension a hackathon project benefits from.
