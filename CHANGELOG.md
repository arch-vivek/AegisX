# Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project does not yet follow
strict Semantic Versioning release cadence (it's a hackathon submission, not a published package), but
version numbers are bumped meaningfully, not cosmetically.

## [1.1.0] — Documentation suite + AI-agent context

### Added
- Full professional documentation suite: `docs/PRD.md`, `TRD.md`, `APP_FLOW.md`, `UI_UX.md`,
  `BACKEND_SCHEMA.md`, `API_REFERENCE.md`, `TEST_PLAN.md`, `RISK_REGISTER.md`, `IMPLEMENTATION_PLAN.md`,
  `docs/README.md` index
- `AGENTS.md` and `CLAUDE.md` — standing context files for AI coding agents
- `docs/adr/` — Architecture Decision Records (0001–0007) documenting real structural decisions
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, this `CHANGELOG.md`

## [1.0.0] — Production-ready hardening

### Added
- Real URL-based routing (`/analyze`, `/privacy`, etc.) replacing in-memory tab navigation
- Full GIGW-style policy page set: Privacy, Terms, Accessibility Statement, Disclaimer, Contact, Sitemap
- Accessibility toolbar: 3 text sizes, light/dark/high-contrast themes, applied before first paint
- Strict security headers via `vercel.json` (CSP, HSTS, X-Frame-Options, Permissions-Policy, etc.)
- Self-hosted font (removed the only third-party runtime network dependency) — see ADR-0005
- Input caps and fuzz/ReDoS hardening in the risk engine
- Untrusted-input validation for all `localStorage` reads (`stats.ts`, `prefs.ts`)
- `ErrorBoundary` for graceful failure
- Three-layer automated test suite: Vitest/jsdom (77 tests), real-HTTP server tests (6), real-Chrome
  CSP/XSS/functional tests (24) — see ADR-0006
- GitHub Actions CI (`npm run check` on every push/PR), Dependabot
- `SECURITY.md`, `docs/COMPLIANCE.md` (GIGW 3.0 / DPDP / CERT-In self-assessment), `docs/DEPLOY_VERCEL.md`

### Fixed
- Risk-scoring calibration: a single high-severity indicator (e.g., a direct OTP request) now correctly
  classifies as High risk on its own, rather than requiring corroborating signals — see ADR-0003
- Bare-domain scam links (no `http://`/`www.` prefix, e.g. `hdfc-kyc-update.xyz/verify`) are now correctly
  extracted and analysed; previously only fully-schemed URLs were detected

### Changed
- `no-https` indicator severity downgraded from `medium` to `low` (a non-HTTPS link alone is a weak
  signal; many legitimate older sites still lack it)

## [0.1.0] — Hackathon MVP

### Added
- Core product: Analyzer (rule-based risk engine), Scenario Simulator (4 scenarios), Learn module
  (awareness content + 5-question quiz), Respond incident-response playbook, on-device Dashboard
- Navy/blue "Accessible & Ethical" design system, Atkinson Hyperlegible typography
- Hand-built shadcn/ui-pattern components on Radix UI primitives — see ADR-0002
- Initial `README.md`, `ARCHITECTURE.md`, `LICENSE` (MIT — see ADR-0007)
