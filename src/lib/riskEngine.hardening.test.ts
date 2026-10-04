import { describe, expect, it } from "vitest"
import { MAX_INPUT_CHARS, MAX_URLS_ANALYZED, analyze } from "./riskEngine"

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe("input limits", () => {
  it("truncates oversized input and says so", () => {
    const r = analyze("a".repeat(MAX_INPUT_CHARS + 500))
    expect(r.truncated).toBe(true)
    expect(r.input.length).toBe(MAX_INPUT_CHARS)
  })

  it("does not flag normal-sized input as truncated", () => {
    expect(analyze("hello there").truncated).toBe(false)
  })

  it("analyses at most MAX_URLS_ANALYZED links", () => {
    const many = Array.from({ length: 40 }, (_, i) => `https://site${i}.example.com/x`).join(" ")
    expect(analyze(many).urlsFound.length).toBeLessThanOrEqual(MAX_URLS_ANALYZED)
  })
})

describe("denial-of-service resistance (regex backtracking)", () => {
  const nasty: Record<string, string> = {
    "dot chain": "a.".repeat(MAX_INPUT_CHARS / 2),
    "hyphen chain": "a-".repeat(MAX_INPUT_CHARS / 2),
    "one long label": "a".repeat(MAX_INPUT_CHARS),
    "many near-valid labels": ("a".repeat(60) + ".").repeat(80),
    "scheme plus dots": "http://" + "a.".repeat(2000),
    "percent runs": "%41".repeat(1600),
    "whitespace": " ".repeat(MAX_INPUT_CHARS),
    "at signs": "@".repeat(MAX_INPUT_CHARS),
    "punycode-like": "xn--".repeat(1200),
  }
  for (const [name, input] of Object.entries(nasty)) {
    it(`finishes quickly on: ${name}`, () => {
      const start = performance.now()
      const r = analyze(input)
      const ms = performance.now() - start
      expect(ms).toBeLessThan(750)
      expect(r.score).toBeGreaterThanOrEqual(0)
      expect(r.score).toBeLessThanOrEqual(100)
    })
  }
})

describe("fuzzing", () => {
  it("never throws and always returns a well-formed result", () => {
    const rand = mulberry32(20260928)
    const pool = "abcXYZ019 .-_/:@%?=&#~!\n\t✓₹अआ日本\u0000\ud83d\ude00http://www.xn--"
    for (let i = 0; i < 400; i++) {
      const len = Math.floor(rand() * 800)
      let s = ""
      for (let j = 0; j < len; j++) s += pool[Math.floor(rand() * pool.length)]
      const r = analyze(s)
      expect(["Low", "Medium", "High"]).toContain(r.level)
      expect(r.score).toBeGreaterThanOrEqual(0)
      expect(r.score).toBeLessThanOrEqual(100)
      expect(Array.isArray(r.indicators)).toBe(true)
    }
  })
})
