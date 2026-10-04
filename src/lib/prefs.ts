import { useSyncExternalStore } from "react"

export type TextSize = "sm" | "md" | "lg"
export type Theme = "light" | "dark" | "contrast"
export interface Prefs {
  textSize: TextSize
  theme: Theme
}

export const PREFS_KEY = "aegisx:prefs:v1"
const SIZES: TextSize[] = ["sm", "md", "lg"]
const THEMES: Theme[] = ["light", "dark", "contrast"]

/** Validates untrusted stored data; anything unexpected falls back to defaults. */
export function sanitizePrefs(input: unknown, systemDark = false): Prefs {
  const base: Prefs = { textSize: "md", theme: systemDark ? "dark" : "light" }
  if (!input || typeof input !== "object") return base
  const o = input as Record<string, unknown>
  return {
    textSize: SIZES.includes(o.textSize as TextSize) ? (o.textSize as TextSize) : base.textSize,
    theme: THEMES.includes(o.theme as Theme) ? (o.theme as Theme) : base.theme,
  }
}

function systemPrefersDark(): boolean {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  } catch {
    return false
  }
}

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    return sanitizePrefs(raw && raw.length < 500 ? JSON.parse(raw) : null, systemPrefersDark())
  } catch {
    return sanitizePrefs(null, systemPrefersDark())
  }
}

export function applyPrefs(p: Prefs) {
  const root = document.documentElement
  root.dataset.textSize = p.textSize
  root.dataset.theme = p.theme
  root.classList.toggle("dark", p.theme === "dark")
}

let current: Prefs | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function getPrefs(): Prefs {
  if (!current) current = loadPrefs()
  return current
}

export function setPrefs(next: Prefs) {
  current = next
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable: preference applies for this visit only
  }
  applyPrefs(next)
  emit()
}

export function resetPrefs() {
  try {
    localStorage.removeItem(PREFS_KEY)
  } catch {
    // ignore
  }
  current = sanitizePrefs(null, systemPrefersDark())
  applyPrefs(current)
  emit()
}

export function usePrefs(): Prefs {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    getPrefs
  )
}
