// Local, on-device session stats for the Dashboard. No account, no server —
// nothing leaves the browser, consistent with AegisX's minimal-data-collection stance.

export interface Stats {
  analysesRun: number
  levelCounts: { Low: number; Medium: number; High: number }
  quizBestScore: number
  quizAttempts: number
  scenariosCompleted: number
}

const KEY = "aegisx:stats:v1"

const defaultStats: Stats = {
  analysesRun: 0,
  levelCounts: { Low: 0, Medium: 0, High: 0 },
  quizBestScore: 0,
  quizAttempts: 0,
  scenariosCompleted: 0,
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...defaultStats }
    return { ...defaultStats, ...JSON.parse(raw) }
  } catch {
    return { ...defaultStats }
  }
}

export function saveStats(stats: Stats) {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats))
  } catch {
    // storage unavailable (private browsing, quota) — fail silently, app still works
  }
}

export function recordAnalysis(level: "Low" | "Medium" | "High") {
  const s = loadStats()
  s.analysesRun += 1
  s.levelCounts[level] += 1
  saveStats(s)
  return s
}

export function recordQuiz(score: number) {
  const s = loadStats()
  s.quizAttempts += 1
  s.quizBestScore = Math.max(s.quizBestScore, score)
  saveStats(s)
  return s
}

export function recordScenario() {
  const s = loadStats()
  s.scenariosCompleted += 1
  saveStats(s)
  return s
}
