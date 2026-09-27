import { describe, expect, it } from "vitest"
import { analyze, extractUrls } from "./riskEngine"
import { sampleCases } from "./__fixtures__/sampleData"

describe("analyze() — sample case classification", () => {
  for (const c of sampleCases) {
    it(`${c.id}: "${c.label}" -> ${c.expectedLevel}`, () => {
      const result = analyze(c.input)
      expect(result.level, `expected ${c.expectedLevel} but got ${result.level} (score ${result.score}); indicators: ${result.indicators.map((i) => i.id).join(", ") || "none"}`).toBe(c.expectedLevel)
    })
  }
})

describe("analyze() — explainability", () => {
  it("returns at least one named indicator whenever the level is not Low", () => {
    const result = analyze("Share your OTP now to avoid account suspension.")
    expect(result.level).not.toBe("Low")
    expect(result.indicators.length).toBeGreaterThan(0)
    for (const ind of result.indicators) {
      expect(ind.label).toBeTruthy()
      expect(ind.detail).toBeTruthy()
    }
  })

  it("returns no indicators for a clean, ordinary message", () => {
    const result = analyze("Let's catch up this weekend, are you free Saturday?")
    expect(result.indicators).toHaveLength(0)
    expect(result.level).toBe("Low")
  })

  it("never exceeds a score of 100 even with many stacked signals", () => {
    const result = analyze(
      "URGENT! Immediately share your OTP and UPI PIN to claim your prize and avoid account suspension. Pay a small fee here: paypal-verify-account-now.xyz"
    )
    expect(result.score).toBeLessThanOrEqual(100)
    expect(result.level).toBe("High")
  })
})

describe("extractUrls()", () => {
  it("extracts bare domains with no http:// or www. prefix", () => {
    expect(extractUrls("go to hdfc-kyc-update.xyz/verify now")).toContain("hdfc-kyc-update.xyz/verify")
  })

  it("extracts explicit https:// links", () => {
    expect(extractUrls("visit https://www.uidai.gov.in/ for info")).toContain("https://www.uidai.gov.in/")
  })

  it("does not extract plain sentences with no domain-like token", () => {
    expect(extractUrls("Hi, are we still meeting at 6pm for coffee?")).toHaveLength(0)
  })

  it("de-duplicates repeated links", () => {
    const urls = extractUrls("click http://scam.top/a or http://scam.top/a again")
    expect(urls).toHaveLength(1)
  })
})

describe("analyze() — official / legitimate domains are not falsely flagged", () => {
  it("does not flag a hyphen-free official-looking domain as brand mismatch", () => {
    const result = analyze("https://www.uidai.gov.in/")
    expect(result.indicators.find((i) => i.id === "brand-mismatch")).toBeUndefined()
    expect(result.level).toBe("Low")
  })
})
