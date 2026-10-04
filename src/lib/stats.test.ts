import { beforeEach, describe, expect, it, vi } from "vitest"
import { STATS_KEY, clearStats, loadStats, recordAnalysis, recordQuiz, sanitizeStats } from "./stats"
import { quizQuestions } from "./content"

function memoryStorage() {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  }
}

beforeEach(() => {
  vi.stubGlobal("localStorage", memoryStorage())
})

describe("stats storage is treated as untrusted input", () => {
  it("returns zeroed stats when nothing is stored", () => {
    expect(loadStats().analysesRun).toBe(0)
  })

  it("survives invalid JSON", () => {
    localStorage.setItem(STATS_KEY, "{not json")
    expect(loadStats().analysesRun).toBe(0)
  })

  it("rejects wrong types, negatives, NaN and arrays", () => {
    const s = sanitizeStats({ analysesRun: "9", levelCounts: "oops", quizBestScore: -3, scenariosCompleted: NaN, quizAttempts: [1] })
    expect(s).toEqual({ analysesRun: 0, levelCounts: { Low: 0, Medium: 0, High: 0 }, quizBestScore: 0, quizAttempts: 0, scenariosCompleted: 0 })
    expect(sanitizeStats([1, 2, 3]).analysesRun).toBe(0)
    expect(sanitizeStats(null).analysesRun).toBe(0)
  })

  it("caps absurd values and the quiz score", () => {
    const s = sanitizeStats({ analysesRun: 1e15, quizBestScore: 999 })
    expect(s.analysesRun).toBe(1_000_000)
    expect(s.quizBestScore).toBe(quizQuestions.length)
  })

  it("ignores prototype-pollution payloads", () => {
    const parsed = JSON.parse('{"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}},"analysesRun":3}')
    const s = sanitizeStats(parsed)
    expect(s.analysesRun).toBe(3)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
    expect(Object.keys(s).sort()).toEqual(["analysesRun", "levelCounts", "quizAttempts", "quizBestScore", "scenariosCompleted"])
  })

  it("ignores oversized stored values", () => {
    localStorage.setItem(STATS_KEY, JSON.stringify({ analysesRun: 5, pad: "x".repeat(20_000) }))
    expect(loadStats().analysesRun).toBe(0)
  })
})

describe("recording and clearing", () => {
  it("counts analyses by level and persists them", () => {
    recordAnalysis("High")
    recordAnalysis("Low")
    const s = loadStats()
    expect(s.analysesRun).toBe(2)
    expect(s.levelCounts).toEqual({ Low: 1, Medium: 0, High: 1 })
  })

  it("keeps only the best quiz score, never above the number of questions", () => {
    recordQuiz(3)
    recordQuiz(2)
    recordQuiz(99)
    const s = loadStats()
    expect(s.quizBestScore).toBe(quizQuestions.length)
    expect(s.quizAttempts).toBe(3)
  })

  it("never stores message content", () => {
    recordAnalysis("High")
    expect(localStorage.getItem(STATS_KEY)).not.toMatch(/http|@|otp/i)
  })

  it("clearStats removes everything", () => {
    recordAnalysis("Medium")
    clearStats()
    expect(localStorage.getItem(STATS_KEY)).toBeNull()
  })
})
