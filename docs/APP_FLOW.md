# AegisX — App Flow Document

| | |
|---|---|
| **Document type** | App Flow / User Journey Document |
| **Version** | 1.0 |
| **Related documents** | [`PRD.md`](./PRD.md) · [`UI_UX.md`](./UI_UX.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) |

This document maps every screen, navigation path, and decision point in AegisX. It is the reference for
"what happens when the user does X" during design, development, and QA.

---

## 1. Site map

```mermaid
flowchart TB
    Home["/  Home"]
    Analyze["/analyze  Analyzer"]
    Sim["/simulator  Scenario Simulator"]
    Learn["/learn  Learn + Quiz"]
    Respond["/respond  Incident Response"]
    Dash["/dashboard  Dashboard"]
    Privacy["/privacy"]
    Terms["/terms"]
    A11y["/accessibility"]
    Disclaimer["/disclaimer"]
    Contact["/contact"]
    Sitemap["/sitemap"]
    NotFound["* (unknown) → 404, noindex"]

    Home --> Analyze & Sim & Learn & Respond & Dash
    Home -. footer .-> Privacy & Terms & A11y & Disclaimer & Contact & Sitemap
    Analyze -. footer .-> Privacy
    Dash -. footer .-> Privacy
    Sitemap -.-> Home & Analyze & Sim & Learn & Respond & Dash & Privacy & Terms & A11y & Disclaimer & Contact
```

Every page shares the same shell: **Accessibility toolbar → Top nav → page content → Footer with policy
links**. Navigation is handled by an in-house router (`lib/router.tsx`) using real browser history, so
every route is directly loadable and shareable as a URL.

## 2. First-time visit flow

```mermaid
sequenceDiagram
    actor U as User
    participant App as AegisX (browser)
    U->>App: Opens the site (any route)
    App->>App: Load saved theme/text-size prefs (or system default)
    App-->>U: Renders Home with the 5-step flow explainer
    U->>App: Clicks "Analyze something now"
    App->>U: Navigates to /analyze, focuses the page heading
    Note over App: No data has left the browser at any point
```

## 3. Core flow — Analyzer (the primary use case)

```mermaid
flowchart TD
    Start([User has a suspicious\nmessage or link]) --> Paste[Paste into the Analyzer textarea]
    Paste --> Check{Input non-empty?}
    Check -- No --> Disabled["'Check this' button stays disabled"]
    Check -- Yes --> Click[Click 'Check this']
    Click --> Cap{Over MAX_INPUT_CHARS?}
    Cap -- Yes --> Truncate[Analyze first N characters;\nshow 'input was truncated' note]
    Cap -- No --> Analyze[Run analyze&#40;&#41; synchronously]
    Truncate --> Analyze
    Analyze --> Extract[Extract up to 10 URLs\nfrom the text]
    Extract --> Rules[Run per-URL and\nper-message rule checks]
    Rules --> Score[Sum weighted indicator points,\ncap at 100]
    Score --> Level{Score thresholds}
    Level -- "< 18" --> Low[Low risk]
    Level -- "18–44" --> Medium[Medium risk]
    Level -- "&ge; 45" --> High[High risk]
    Low --> Render[Render: banner, risk meter,\nnamed indicators, guidance list]
    Medium --> Render
    High --> Render
    Render --> Record[Record Low/Medium/High count\nin local Dashboard stats only]
    Render --> Decision{User acts on guidance}
    Decision -->|Still unsure| Learn2[Visits Learn for more context]
    Decision -->|Already affected| Respond2[Visits Respond playbook]
```

## 4. Scenario Simulator flow

```mermaid
flowchart TD
    A[Open /simulator] --> B[Scenario 1 of 4 shown\nwith channel + message]
    B --> C[User picks one of 3 response options]
    C --> D{Correct option?}
    D -- Yes --> E["✓ 'Good call.' + explanation"]
    D -- No --> F["✗ 'Risky choice.' + explanation"]
    E --> G[Click 'Next scenario']
    F --> G
    G --> H{More scenarios?}
    H -- Yes --> B
    H -- No --> I[Loops back to Scenario 1\nor user clicks Restart]
```

## 5. Learn + Quiz flow

```mermaid
flowchart TD
    A[Open /learn] --> B[Read accordion topics:\nphishing, social engineering,\nOTP safety, UPI safety]
    B --> C[Answer all 5 quiz questions]
    C --> D{All questions answered?}
    D -- No --> E["'Submit answers' stays disabled"]
    D -- Yes --> F[Click Submit]
    F --> G[Each answer marked correct/incorrect\nwith its explanation]
    G --> H[Score shown: X / 5\n+ progress bar]
    H --> I{Retake?}
    I -- Yes --> C
    I -- No --> J[Best score saved to Dashboard]
```

## 6. Respond (incident response) flow

```mermaid
flowchart TD
    A[User realises they may\nhave been scammed] --> B[Open /respond]
    B --> C{Which situation matches?}
    C -->|Clicked a link, entered nothing| D1[Playbook: close page,\nscan device, monitor accounts]
    C -->|Shared OTP/PIN/password| D2[Playbook: change password,\ncall bank, report]
    C -->|Made a payment| D3[Playbook: call bank immediately,\nreport, save evidence]
    C -->|Installed remote-access app| D4[Playbook: disconnect network,\nuninstall app, change passwords]
    D1 & D2 & D3 & D4 --> E[Always shown: report via\ncybercrime.gov.in or call 1930]
    B --> F{No money lost,\njust a suspicious call/SMS?}
    F -- Yes --> G[Pointed to Sanchar Saathi\nChakshu facility instead]
```

## 7. Dashboard & data-control flow

```mermaid
flowchart TD
    A[Open /dashboard] --> B[Read local counters:\nanalyses run, by risk level,\nscenarios done, best quiz score]
    B --> C{Wants to clear data?}
    C -- Yes --> D[Click 'Clear saved data']
    D --> E[stats + preferences removed\nfrom localStorage]
    E --> F["'Saved data cleared.' confirmation"]
    C -- No --> G[Continues browsing]
```

## 8. Accessibility toolbar flow

```mermaid
flowchart LR
    A[Any page] --> B[Toolbar: text size A-/A/A+\nand theme Light/Dark/High-contrast]
    B --> C[Choice applied instantly\nto the whole app via data- attributes]
    C --> D[Choice saved to localStorage]
    D --> E[Applied again on next visit,\nbefore first paint]
```

## 9. Error and edge-case states

| Situation | What the user sees |
|---|---|
| Unknown URL | A "Page not found" screen with links to Home and Sitemap; the page is marked `noindex` |
| Pasted input over the character cap | Only the first `MAX_INPUT_CHARS` characters are analysed; a note says so |
| JavaScript disabled | A `<noscript>` message pointing to cybercrime.gov.in and 1930 |
| A rendering bug anywhere | The `ErrorBoundary` shows a calm fallback with the 1930 helpline instead of a blank page |
| `localStorage` unavailable (private browsing, quota) | Reads/writes fail silently; the app continues to work, just without persistence |
| Navigating via browser Back/Forward | Handled by the router's `popstate` listener — behaves like native navigation |
