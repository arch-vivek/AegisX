# Alignment with Indian Government Web Standards

> **This is an engineering self-assessment, not a legal opinion and not a certification.**
> AegisX is an independent, non-government project. It has no legal obligation to comply with
> government-website-specific rules, but has voluntarily aligned its technical design with the public
> standards below because they are a solid, India-specific bar for quality, accessibility and security.
> Formal certification (e.g., STQC's Certified Quality Website mark, or a CERT-In/STQC-empanelled
> auditor's "safe to host" certificate) requires an actual third-party audit that has **not** been
> performed. If this project is ever deployed as, or on behalf of, an actual government entity, get a
> qualified legal and compliance review before relying on anything in this document.

## 1. Guidelines for Indian Government Websites and Apps (GIGW 3.0)

GIGW 3.0 (2023) is issued by NIC/MeitY, formulated jointly with the STQC Directorate and CERT-In. It
covers four areas: Quality, Accessibility, Cybersecurity, and Lifecycle Management. It legally binds
government organisations; AegisX follows it voluntarily.

| Area | What GIGW 3.0 asks for | Where AegisX stands |
|---|---|---|
| **Accessibility** | WCAG 2.1 Level AA | Automated axe-core testing across every route and every colour theme finds **zero violations** (`src/App.a11y.test.tsx`); see [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md#7-accessibility) and the in-app Accessibility Statement. Manual screen-reader testing (NVDA/JAWS/TalkBack/VoiceOver) and a third-party audit have **not** been done. |
| **Quality — content ownership, currency** | Clear ownership, "last updated" dates, no misleading claims | Footer states content ownership and a build-time "last updated" date; the Home page explicitly states AegisX is not a government service. |
| **Quality — mandatory policy pages** | Privacy Policy, Terms of Use, Accessibility Statement, Disclaimer/Copyright/Hyperlinking policy, Contact/feedback, Sitemap | All present under `/privacy`, `/terms`, `/accessibility`, `/disclaimer`, `/contact`, `/sitemap`. |
| **Quality — responsive/mobile-friendly** | Works across devices | Tailwind responsive layout; tested down to small mobile widths. |
| **Multilingual support** | Content in Indian languages, not just English | **Not yet implemented.** AegisX is English-only today; the risk engine's phrase lists are also English/romanised-text only. Documented as a known gap in the Accessibility Statement and the roadmap in [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md#9-future-scalability). |
| **Cybersecurity** | Secure hosting, HTTPS, vulnerability management | HTTPS enforced by the hosting platform, HSTS header, strict CSP and other security headers (see [`SECURITY.md`](../SECURITY.md)), dependency auditing in CI. **No CERT-In/STQC-empanelled security audit has been performed.** |
| **Lifecycle management** | Ongoing maintenance plan, versioning, contact for issues | `SECURITY.md`, CI on every push, Dependabot for dependency updates, a versioned `package.json`, and a Contact page. |
| **No State Emblem / official branding** | Government sites use the State Emblem; others must not imply government status | AegisX uses no government emblem or logo, and both the Home page and Disclaimer page state plainly that it is independent. |

**Overall:** strong alignment on Accessibility, the mandatory policy-page set, and baseline Cybersecurity
hygiene. The clearest gap against the full GIGW 3.0 bar is **multilingual support**, and no formal STQC
Certified Quality Website review has been sought (nor is one required, since this is not a government
website).

## 2. Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025

The DPDP Rules, 2025 were notified 13 November 2025 by MeitY, with core obligations (consent notices,
security safeguards, breach reporting, children's-data protections, etc.) phased in over 18 months from
that date. They apply to "Data Fiduciaries" processing digital personal data.

**AegisX's position: it does not collect, transmit, or store any personal data**, so most DPDP
obligations do not currently apply:

- The Analyzer's input is processed entirely in the browser and is never sent to a server.
- The only locally stored data is anonymous usage counters and display preferences (see
  [`SECURITY.md`](../SECURITY.md) and the in-app Privacy Policy) — no name, contact detail, government ID,
  or any other personal identifier is collected, and nothing is linkable to an individual.
- There are no accounts, no cookies, and no analytics/tracking.

If a future version introduces accounts, server-side storage, or any collection of personal data, it
would need a proper DPDP compliance review at that point (consent notices under Rule 3, security
safeguards under Rule 6, breach reporting under Rule 7 within 72 hours to the Data Protection Board,
data-retention limits, etc.) — this is flagged in [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md#9-future-scalability)
as a prerequisite for that roadmap item, not something already built.

## 3. CERT-In Directions (28 April 2022) and Chakshu / cybercrime.gov.in integration

- **Reporting integration:** every high-risk result in the Analyzer, the whole Respond page, and the
  Contact page point to the two channels the Indian government actually operates for this exact problem:
  the National Cyber Crime Reporting Portal (**cybercrime.gov.in**) and the **1930** helpline for cases
  involving loss, and the Department of Telecommunications' **Chakshu** facility (Sanchar Saathi portal)
  for suspicious-but-not-yet-costly communications. AegisX does not duplicate or replace either.
- **6-hour incident reporting obligation:** this applies to specific categories of "covered entities."
  See the note in [`SECURITY.md`](../SECURITY.md#cert-in-incident-reporting) — this document does not
  make a legal determination of whether a given deployment is covered, and recommends treating a
  confirmed incident as reportable regardless.

## 4. Summary table

| Standard | Status |
|---|---|
| WCAG 2.1 AA (via GIGW 3.0) | Automated zero-violation testing in place; no manual/third-party audit |
| GIGW 3.0 mandatory policy pages | Complete |
| GIGW 3.0 multilingual requirement | Not implemented (English only) |
| GIGW 3.0 STQC certification | Not sought (voluntary alignment only; not a government site) |
| DPDP Act/Rules | No personal data collected, so most obligations don't apply yet; documented trigger for future review |
| CERT-In reporting channel integration (cybercrime.gov.in / 1930 / Chakshu) | Complete, linked throughout the app |
| CERT-In 6-hour incident-reporting *obligation* | Not determined (legal question; process documented as good practice regardless) |
