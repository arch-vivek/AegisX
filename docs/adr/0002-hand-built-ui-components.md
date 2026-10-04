# ADR-0002: Hand-built shadcn/ui-pattern components instead of the shadcn CLI

**Status:** Accepted

## Context

The project was asked to use the `ui-ux-pro-max:ui-styling` skill, which specifies shadcn/ui (Radix UI +
Tailwind) as the component approach. The `shadcn` CLI (`npx shadcn@latest init`/`add`) fetches component
source from `ui.shadcn.com`'s registry at build time. The build environment's network egress allowlist
does not include that domain — confirmed empirically when `shadcn init` failed with an authorization/
network error against that host.

## Decision

Hand-author the needed components (`Button`, `Card`, `Badge`, `Progress`, `Alert`, `Accordion`,
`Textarea`, `Input`) in `src/components/ui/`, following the exact conventions the CLI would have produced:
Radix UI primitives for behavior, `class-variance-authority` for typed variants, a `cn()` `clsx`+
`tailwind-merge` helper for class composition — matching the local copy of the skill's reference
documentation rather than inventing a new pattern.

## Consequences

- **Easier:** the project builds and runs with zero dependency on network access to a specific external
  registry at any point (install, build, or CI) — a real reliability win, not just a workaround.
- **Harder:** if the shadcn registry's components evolve, these local copies won't pick up upstream fixes
  automatically. Mitigated by keeping components small and conventional, so manually porting an upstream
  change is low-effort if ever needed.
- In an unrestricted network environment, `npx shadcn@latest add <component>` would work identically
  against these same files (components.json was never generated, so a future `shadcn init` wouldn't
  conflict with what's here).

## Alternatives considered

- **Switch to a different component library with a pure-npm install path** (e.g., a plain Radix
  wrapper without the registry step): rejected — would diverge from the explicitly requested skill's
  guidance and lose the shadcn-specific theming conventions (CSS variables, `data-slot` attributes) the
  skill's reference docs specify.
- **Skip component primitives entirely, write raw Tailwind markup per usage:** rejected — would duplicate
  accessibility behavior (focus management, ARIA) that Radix already provides correctly for Accordion and
  Progress, increasing both code size and accessibility risk.
