# ADR-0003: Severity-weighted risk scoring — a single high-severity signal is decisive

**Status:** Accepted (superseded an earlier calibration found incorrect during test-writing)

## Context

While writing labeled test cases in `docs/SAMPLE_DATA.md`/`riskEngine.test.ts`, the original point weights
(`low: 6, medium: 14, high: 28`, threshold `High` at score ≥ 45) produced a wrong result on a direct test
case: a message that does nothing but ask for an OTP (`credential-request`, a `high`-severity indicator)
scored only 28 points — classified `Medium`, not `High`. That's a real product bug: a direct OTP request
has essentially no legitimate use in consumer messaging and deserves the strongest warning on its own,
not only when corroborated by other signals.

## Decision

Re-weight severities so a single `high` indicator alone crosses the `High` threshold: `low: 8, medium: 20,
high: 50`, with thresholds unchanged (`≥45` High, `≥18` Medium). `medium`/`low` signals still need to
accumulate to raise the level — only `high`-severity indicators (OTP/PIN requests, brand-domain mismatch,
the `@`-redirect trick, punycode, remote-access-app requests, a raw IP-address link) are individually
"smoking gun enough."

## Consequences

- **Easier:** matches how a careful human would actually judge these specific patterns — each was
  deliberately classified `high` because it has essentially no legitimate counter-example, not because it
  merely correlates with fraud.
- **Harder:** mis-classifying a new rule's severity as `high` when it isn't actually decisive on its own
  would now cause more false "High risk" results than under the old weighting. Mitigated by the rule in
  `AGENTS.md`: every new rule needs a labeled test case, so a miscalibration is caught the same way this
  one was.
- This recalibration is exactly why `docs/SAMPLE_DATA.md` and `riskEngine.test.ts` share one source file
  (`src/lib/__fixtures__/sampleData.ts`) — the bug was caught *because* the documentation and the test
  were the same artifact, not two things that could silently drift apart.

## Alternatives considered

- **Keep the original weights, raise the `Medium`/`High` thresholds instead:** rejected — this would have
  also changed how multiple `medium` signals combine, which weren't shown to be miscalibrated; fixing only
  the actually-broken case (severity weights) is a smaller, more defensible change.
- **Special-case credential requests outside the normal scoring system:** rejected — breaks the "every
  result is just summed named indicators" explainability guarantee that's central to the product's design.
