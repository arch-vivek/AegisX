# Claude Code Configuration

Please read and follow [`AGENTS.md`](./AGENTS.md) — it's the canonical, tool-neutral project context
file. Everything below is Claude-specific only; it does not restate AGENTS.md.

- This project's own `docs/` suite was itself produced collaboratively with Claude across this project's
  build history — treat `docs/adr/` as genuine decision history, not boilerplate, when reasoning about
  why something is built the way it is.
- When asked to add a new detection rule, feature, or structural change, follow the same pattern already
  established in the codebase (named indicators in `riskEngine.ts`, labeled fixtures in
  `__fixtures__/sampleData.ts`, a matching test) rather than introducing a new pattern.
- If a request would change something `docs/adr/` records a reason for, flag the conflict and ask before
  proceeding, rather than silently reversing a documented decision.
