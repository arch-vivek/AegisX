# AegisX — UI/UX Design Document

| | |
|---|---|
| **Document type** | UI/UX Design Document |
| **Version** | 1.0 |
| **Related documents** | [`APP_FLOW.md`](./APP_FLOW.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`PRD.md`](./PRD.md) |

---

## 1. Design principles

1. **Calm, not alarming.** A tool about fraud and scams must never itself feel panic-inducing. No red
   flashing, no siren iconography, no countdown pressure — the same anti-patterns AegisX teaches people
   to recognise in scams.
2. **Explain, don't just warn.** Every risk result shows *why*, in plain language — never a bare "unsafe"
   label with no reasoning.
3. **Government-adjacent trust, without impersonation.** The visual language borrows the restraint of
   official Indian digital services (navy/blue, high legibility, no stock-photo gloss) while the copy is
   explicit that AegisX is independent.
4. **Accessible by default, not as an afterthought.** Text size, contrast, and keyboard support are
   first-class controls in the main toolbar, not buried in a settings menu.
5. **Text-first.** No decorative imagery competing for attention with safety guidance; icons support
   meaning, they don't replace it.

## 2. Colour system

The palette is the **"Accessible & Ethical"** navy/blue direction: calm, high-contrast, and legible for
users who may be reading under stress.

| Token | Light mode | Dark mode | High contrast | Usage |
|---|---|---|---|---|
| `--color-primary` | `#0F172A` | `#E2E8F0` | `#FFFF00` | Primary actions, nav active state |
| `--color-accent` | `#0369A1` | `#38BDF8` | `#FFFF00` | Links, secondary emphasis |
| `--color-background` | `#F8FAFC` | `#0B1220` | `#000000` | Page background |
| `--color-foreground` | `#020617` | `#F1F5F9` | `#FFFFFF` | Body text |
| `--color-success` | `#166534` | `#4ADE80` | `#8CFFAA` | Low-risk, correct-answer states |
| `--color-warning` | `#92400E` | `#FBBF24` | `#FFD166` | Medium-risk states |
| `--color-destructive` | `#B91C1C` | `#F87171` | `#FF9E9E` | High-risk, incorrect-answer states |

> **Never colour-alone:** every risk level, correct/incorrect state, and status is always paired with a
> text label and/or icon (see `AlertTitle`, `Badge` text, `aria-label`s). Colour is reinforcement, not the
> only signal — required both by WCAG 1.4.1 and by the reality that red/green confusion is common.

Three selectable themes — Light, Dark, and **High Contrast** (pure black/white/yellow, for users who need
maximum differentiation) — are implemented as CSS custom-property sets swapped via a `data-theme`
attribute on `<html>`, applied before first paint to avoid a flash of the wrong theme.

## 3. Typography

| Property | Value | Why |
|---|---|---|
| Typeface | **Atkinson Hyperlegible** (self-hosted) | Designed by the Braille Institute specifically for maximum legibility and letterform disambiguation (e.g., clearly distinct `1`, `l`, `I`) — directly relevant for a safety tool read under stress or by users with low vision |
| Base size | `1rem` (16px), scalable via the toolbar to 87.5% / 100% / 125% | User-controlled without needing browser zoom |
| Weight scale | 400 (body), 700 (headings, emphasis, buttons) | Two weights keep the bundle small and the hierarchy simple |
| Line height | 1.5 body | WCAG 1.4.8 recommended minimum |

```
H1  28–32px / 700 / tight leading   — one per page, focused after navigation
H2  20px    / 700                    — section headings within a page
H3  18px    / 700                    — card titles
Body 16px   / 400 / 1.5 line-height
Small 14px  / 400                    — helper text, captions
```

## 4. Layout & spacing

- **Grid:** single-column content capped at `max-w-3xl`–`max-w-5xl` depending on page density (Analyzer
  results are narrower/denser; Home's flow cards are wider).
- **Spacing scale:** Tailwind's default 4px-based scale throughout — no custom spacing values, which keeps
  rhythm consistent across hand-built components.
- **Breakpoints:** mobile-first; single column under `sm` (640px), multi-column grids (2–5 columns) from
  `sm`/`lg` upward for card groups (Home's flow steps, Dashboard stat cards).
- **Touch targets:** minimum 44×44px on all interactive controls (buttons, nav links, toolbar buttons,
  quiz options) — set directly in each component's size variant.

## 5. Component inventory

Hand-built, shadcn/ui-pattern components (Radix UI primitives + `class-variance-authority` + `cn()`):

| Component | Variants | Notes |
|---|---|---|
| `Button` | `default` · `accent` · `destructive` · `outline` · `ghost` · `link`; sizes `sm`/`default`/`lg`/`icon` | 44px minimum height on all sizes |
| `Card` | header/title/description/content/footer slots | `CardTitle` can render as `h2` or `h3` to keep heading order correct per page |
| `Badge` | `default` · `success` · `warning` · `destructive` · `accent` | Used for severity labels — always alongside text, never a bare colour chip |
| `Alert` | `default` · `success` · `warning` · `destructive` | `role="status"` for assistive-tech announcement |
| `Progress` | — | Used for the risk meter and quiz-score bar; always paired with a numeric `aria-label` |
| `Accordion` | — | Radix-managed keyboard interaction and `aria-expanded` state, used in Learn |
| `Textarea` / `Input` | — | 2px visible border, focus ring, `maxLength` enforced in the Analyzer |

## 6. Key screen layouts (wireframe-level)

### Home

```
┌───────────────────────────────────────────┐
│  [Accessibility toolbar: skip link | A- A A+ | ☀ 🌙 ◐] │
│  [Nav: AegisX   Home Analyze Simulator Learn Respond Dashboard] │
├───────────────────────────────────────────┤
│         "Recognize a scam before it costs you."     │
│         [Analyze something now]  [Try a scam scenario] │
│  ⓘ "Independent project, not a government service"  │
│  ┌────┬────┬────┬────┬────┐                         │
│  │ 1  │ 2  │ 3  │ 4  │ 5  │  RECOGNIZE→VERIFY→RESPOND│
│  │RECOGNIZE│VERIFY│RESPOND│REPORT│LEARN│  →REPORT→LEARN │
│  └────┴────┴────┴────┴────┘                         │
│  "What AegisX is, and isn't" — two-column honesty box│
├───────────────────────────────────────────┤
│  Footer: about · policy links · 1930 / cybercrime.gov.in │
└───────────────────────────────────────────┘
```

### Analyzer (result state)

```
┌───────────────────────────────────────────┐
│  "Analyze a message or link"                         │
│  ┌─────────────────────────────────────┐ │
│  │ [textarea — pasted message]          │ │
│  └─────────────────────────────────────┘ │
│  chars X/5000        [Check this] [Clear]  Example 1 | Example 2 │
├───────────────────────────────────────────┤
│  🛡 HIGH RISK — likely fraudulent   score 78/100      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░  0——50——100                     │
│  "Why this result — 3 signals found"                  │
│   • Brand name + mismatched domain  [Strong signal]   │
│   • Urgency/pressure language       [Moderate signal] │
│   • Generic greeting                [Minor signal]    │
│  "What to do now" — ordered guidance list              │
└───────────────────────────────────────────┘
```

## 7. Accessibility design decisions

| Decision | Reason |
|---|---|
| Skip-to-content link, visible on focus | Lets keyboard/screen-reader users bypass the nav+toolbar on every page |
| Focus moves to the new page's `<h1>` after navigation | Without this, SPA navigation is silent to screen-reader users — a common SPA accessibility failure this design explicitly avoids |
| Risk/quiz/scenario states shown with icon **and** text, never colour alone | WCAG 1.4.1; also helps colour-blind users distinguish Medium (amber) from High (red) |
| 3 selectable themes including high-contrast | Covers low-vision users who need more than just "dark mode" |
| `prefers-reduced-motion` respected globally | Vestibular-disorder safe by default |
| All form inputs have visible, associated `<label>`s | No placeholder-as-label anti-pattern |
| External links show an icon + visually-hidden "(opens in a new tab)" | Sets expectation before the click, for all users including screen-reader users |

## 8. Content/voice guidelines

- Plain language; avoid jargon ("phishing" is defined in-app rather than assumed knowledge).
- Never say "this is a scam" — always "this looks like it shares patterns with known scams," consistent
  with the product's advisory-not-definitive stance (see `PRD.md` FR-03).
- Second person, direct: "Do not share your OTP," not "Users should avoid sharing OTPs."
- No urgency-manufacturing language anywhere in AegisX's own copy — the product would be self-defeating if
  it used the same pressure tactics it warns against.

## 9. Iconography

`lucide-react`, used consistently at 1–1.5× text size, always `aria-hidden="true"` when paired with
visible text (icons are decorative reinforcement, not the only label).
