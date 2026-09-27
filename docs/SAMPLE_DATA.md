# Sample Data & Test Cases

The canonical sample set lives in code at
[`src/lib/__fixtures__/sampleData.ts`](../src/lib/__fixtures__/sampleData.ts) so it can be
both documented here **and** run as real automated tests
([`src/lib/riskEngine.test.ts`](../src/lib/riskEngine.test.ts)) — the numbers below are not
just claims, they're checked on every `npm test` run.

Run the suite:

```bash
npm test
```

## Labeled examples

| ID | Case | Input (fictionalised) | Expected level | Why |
|---|---|---|---|---|
| s1 | Fake bank KYC SMS | `Dear Customer, your bank a/c will be blocked within 24 hours. Update your KYC immediately: hdfc-kyc-update.xyz/verify` | **High** | Brand name + mismatched hyphenated domain, risky TLD, urgency language, "KYC" + urgency read as authority impersonation, generic greeting |
| s2 | OTP-sharing request | `This is your bank's security team. Please share the OTP...` | **High** | Direct OTP request — decisive on its own |
| s3 | Courier customs-fee scam | `Your parcel is on hold at customs. Pay a small fee...pay-parcel-release.top` | **High** | Advance-fee hook + authority impersonation + risky TLD |
| s4 | Lottery/prize win message | `Congratulations! You have won...pay a processing fee.` | **High** | Unsolicited prize + fee-to-release pattern |
| s5 | Bare shortened link | `Check this out: https://bit.ly/3xample` | **Medium** | One moderate signal (shortener), nothing else |
| s6 | Plain HTTP link, no other signal | `http://example-shop.com/summer-sale` | **Low** | A single weak signal alone stays below the Medium threshold |
| s7 | Ordinary personal message | `Hi, are we still meeting at 6pm for coffee tomorrow?` | **Low** | Negative control — no indicators should fire |
| s8 | Legitimate official domain | `https://www.uidai.gov.in/` | **Low** | Negative control for the URL path — HTTPS, no obfuscation |
| s9 | Raw IP-address link | `Login here to continue: http://192.168.45.12/login` | **High** | Numeric-IP host is decisive on its own |

## Adding a new case

1. Add an entry to `sampleCases` in `src/lib/__fixtures__/sampleData.ts` with a unique
   `id`, the input text, the level you expect, and a one-line reason.
2. Run `npm test` — the new case is picked up automatically by
   `riskEngine.test.ts` (it iterates `sampleCases`), no test file edit needed.
3. If the engine's actual output doesn't match your expectation, the test failure prints
   the computed score and every matched indicator id, which is usually enough to tell you
   whether the *engine* needs a new rule or your *expectation* needs correcting.
