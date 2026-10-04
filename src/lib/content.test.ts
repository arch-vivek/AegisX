import { describe, expect, it } from "vitest"
import { quizQuestions, responsePlaybook, scenarios } from "./content"

describe("content integrity", () => {
  it("every scenario has unique option ids and exactly one correct answer", () => {
    for (const s of scenarios) {
      expect(new Set(s.options.map((o) => o.id)).size).toBe(s.options.length)
      expect(s.options.filter((o) => o.correct)).toHaveLength(1)
      for (const o of s.options) expect(o.feedback.length).toBeGreaterThan(10)
    }
  })

  it("every quiz question has a valid correct answer and an explanation", () => {
    for (const q of quizQuestions) {
      expect(q.options.length).toBeGreaterThanOrEqual(2)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
      expect(q.explanation.length).toBeGreaterThan(10)
    }
    expect(new Set(quizQuestions.map((q) => q.id)).size).toBe(quizQuestions.length)
  })

  it("the response playbook is non-empty and points to official reporting", () => {
    expect(responsePlaybook.length).toBeGreaterThan(0)
    for (const r of responsePlaybook) expect(r.steps.length).toBeGreaterThan(1)
    expect(JSON.stringify(responsePlaybook)).toMatch(/1930/)
    expect(JSON.stringify(responsePlaybook)).toMatch(/cybercrime\.gov\.in/)
  })
})
