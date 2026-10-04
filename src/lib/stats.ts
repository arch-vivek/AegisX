// Local, on-device session stats for the Dashboard. No account, no server:
// nothing leaves the browser. Stored values are treated as UNTRUSTED input
// (users or extensions can edit localStorage), so every field is validated.
import { quizQuestions } from "./content"

export interface Stats {
  analysesRun: number
  levelCounts: { Low: number; Medium: number; High: number }
  quizBestScore: number
  quizAttempts: number
  scenariosCompleted: number
}

export const STATS_KEY = "aegisx:stats:v1"
const MAX_COUNT = 1_000_000

function count(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.min(Math.floor(v), MAX_COUNT) : 0
}

function emptyStats(): Stats {
  return {
    analysesRun: 0,
    levelCounts: { Low: 0, Medium: 0, High: 0 },
    quizBestScore: 0,
    quizAttempts: 0,
    scenariosCompleted: 0,
  }
}

/** Builds a Stats object from arbitrary parsed data, ignoring unknown keys and bad types. */
export function sanitizeStats(input: unknown): Stats {
  if (!input || typeof input !== "object" || Array.isArray(input)) return emptyStats()
  const o = input as Record<string, unknown>
  const lc = o.levelCounts && typeof o.levelCounts === "object" ? (o.levelCounts as Record<string, unknown>) : {}
  return {
    analysesRun: count(o.analysesRun),
    levelCounts: { Low: count(lc.Low), Medium: count(lc.Medium), High: count(lc.High) },
    quizBestScore: Math.min(count(o.quizBestScore), quizQuestions.length),
    quizAttempts: count(o.quizAttempts),
    scenariosCompleted: count(o.scenariosCompleted),
  }
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw || raw.length > 10_000) return emptyStats()
    return sanitizeStats(JSON.parse(raw))
  } catch {
    return emptyStats()
  }
}

function saveStats(stats: Stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch {
    // storage unavailable (private mode, quota): the app keeps working without it
  }
}

export function recordAnalysis(level: "Low" | "Medium" | "High") {
  const s = loadStats()
  s.analysesRun = count(s.analysesRun + 1)
  s.levelCounts[level] = count(s.levelCounts[level] + 1)
  saveStats(s)
  return s
}

export function recordQuiz(score: number) {
  const s = loadStats()
  s.quizAttempts = count(s.quizAttempts + 1)
  s.quizBestScore = Math.min(Math.max(s.quizBestScore, count(score)), quizQuestions.length)
  saveStats(s)
  return s
}

export function recordScenario() {
  const s = loadStats()
  s.scenariosCompleted = count(s.scenariosCompleted + 1)
  saveStats(s)
  return s
}

export function clearStats() {
  try {
    localStorage.removeItem(STATS_KEY)
  } catch {
    // ignore
  }
}
