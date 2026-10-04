# AegisX Documentation

A complete documentation suite, as a professional team would ship alongside the code — not an
afterthought bolted on for submission. Every diagram below is live Mermaid, rendered directly from the
markdown source; every requirement/claim is cross-referenced to the automated test that proves it.

## How the documents relate

```mermaid
flowchart TB
    PRD["PRD.md\nWhat to build, for whom, and why"]
    TRD["TRD.md\nHow it's technically built,\ntraceable to the PRD"]
    FLOW["APP_FLOW.md\nScreen-by-screen user journeys"]
    UX["UI_UX.md\nDesign system & screen layouts"]
    ARCH["ARCHITECTURE.md\nSystem design, modules, security posture"]
    API["API_REFERENCE.md\nFunction contracts (today's \"API\")"]
    SCHEMA["BACKEND_SCHEMA.md\nCurrent data model +\nproposed future DB schema"]
    TEST["TEST_PLAN.md\nThree-layer test strategy"]
    SAMPLE["SAMPLE_DATA.md\nLabeled test cases"]
    RISK["RISK_REGISTER.md\nWhat could go wrong + mitigations"]
    PLAN["IMPLEMENTATION_PLAN.md\nPhased roadmap"]
    COMPLY["COMPLIANCE.md\nGIGW 3.0 / DPDP / CERT-In self-assessment"]
    SEC["../SECURITY.md\nThreat model & disclosure"]
    DEPLOY["DEPLOY_VERCEL.md\nFree deployment guide"]
    ADR["adr/\nWhy structural decisions were made"]
    AGENTS["../AGENTS.md\nContext for AI coding agents"]

    PRD --> TRD --> ARCH
    PRD --> FLOW --> UX
    TRD --> API --> SCHEMA
    TRD --> TEST --> SAMPLE
    PRD --> RISK --> PLAN
    ARCH --> SEC --> COMPLY
    ARCH --> DEPLOY
    ARCH --> ADR
    ADR --> AGENTS
```

## Reading order

| If you are... | Start here |
|---|---|
| A hackathon judge, skimming | [`../README.md`](../README.md) → [`PRD.md`](./PRD.md) |
| Reviewing the technical build | [`TRD.md`](./TRD.md) → [`ARCHITECTURE.md`](./ARCHITECTURE.md) → [`TEST_PLAN.md`](./TEST_PLAN.md) |
| Evaluating government-standards alignment | [`COMPLIANCE.md`](./COMPLIANCE.md) → [`../SECURITY.md`](../SECURITY.md) |
| Deploying it yourself | [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md) |
| Extending the product | [`BACKEND_SCHEMA.md`](./BACKEND_SCHEMA.md) → [`API_REFERENCE.md`](./API_REFERENCE.md) → [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) |
| Designing a new screen | [`APP_FLOW.md`](./APP_FLOW.md) → [`UI_UX.md`](./UI_UX.md) |
| An AI coding agent (Claude Code, Cursor, Codex, etc.) | [`../AGENTS.md`](../AGENTS.md) |
| Wondering *why* something was built a certain way | [`adr/0000-index.md`](./adr/0000-index.md) |
| A human contributor opening a PR | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) |

## Full index

| Document | Covers |
|---|---|
| [`PRD.md`](./PRD.md) | Problem, personas, use cases, functional & non-functional requirements, release criteria |
| [`TRD.md`](./TRD.md) | Tech stack rationale, technical requirements by category, environments, PRD traceability |
| [`APP_FLOW.md`](./APP_FLOW.md) | Site map and a flow diagram for every feature, including error/edge states |
| [`UI_UX.md`](./UI_UX.md) | Design principles, colour/typography system, component inventory, wireframes, a11y rationale |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System architecture, module breakdown, risk-scoring model, security posture, deployment/CI, scaling path |
| [`BACKEND_SCHEMA.md`](./BACKEND_SCHEMA.md) | Current client-side data model + proposed future relational schema (ER diagrams) |
| [`API_REFERENCE.md`](./API_REFERENCE.md) | `analyze()` function contract, error modes, proposed future REST shape |
| [`TEST_PLAN.md`](./TEST_PLAN.md) | Three-layer test strategy (jsdom, real-HTTP, real-browser), exit criteria |
| [`SAMPLE_DATA.md`](./SAMPLE_DATA.md) | Labeled example inputs, shared by documentation and the automated test suite |
| [`RISK_REGISTER.md`](./RISK_REGISTER.md) | Product, security, compliance, and operational risks with mitigations and a risk heat map |
| [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) | Delivery phases, indicative timeline (Gantt), roles, definition of done |
| [`COMPLIANCE.md`](./COMPLIANCE.md) | Honest self-assessment against GIGW 3.0, the DPDP Act/Rules, and CERT-In |
| [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md) | Step-by-step free deployment to Vercel |
| [`adr/0000-index.md`](./adr/0000-index.md) | Architecture Decision Records — 7 real decisions made during this build, with context and alternatives considered |
| [`../AGENTS.md`](../AGENTS.md) | Context file for AI coding agents working on this repo (Claude Code, Cursor, Codex, Gemini CLI) |
| [`../CLAUDE.md`](../CLAUDE.md) | Claude-specific pointer to `AGENTS.md` |
| [`../CONTRIBUTING.md`](../CONTRIBUTING.md) | How to contribute: setup, PR checklist, when to write an ADR |
| [`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) | Community standards |
| [`../CHANGELOG.md`](../CHANGELOG.md) | Version history (Keep a Changelog format) |
| [`../SECURITY.md`](../SECURITY.md) | Threat/mitigation table and vulnerability disclosure process |
