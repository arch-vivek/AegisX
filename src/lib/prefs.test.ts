import { describe, expect, it } from "vitest"
import { sanitizePrefs } from "./prefs"

describe("sanitizePrefs", () => {
  it("defaults to medium text and the system theme", () => {
    expect(sanitizePrefs(null)).toEqual({ textSize: "md", theme: "light" })
    expect(sanitizePrefs(undefined, true)).toEqual({ textSize: "md", theme: "dark" })
  })

  it("accepts valid values", () => {
    expect(sanitizePrefs({ textSize: "lg", theme: "contrast" })).toEqual({ textSize: "lg", theme: "contrast" })
  })

  it("rejects unknown values and non-objects", () => {
    expect(sanitizePrefs({ textSize: "huge", theme: "<script>" })).toEqual({ textSize: "md", theme: "light" })
    expect(sanitizePrefs("lg")).toEqual({ textSize: "md", theme: "light" })
    expect(sanitizePrefs(42)).toEqual({ textSize: "md", theme: "light" })
  })

  it("never copies unknown keys", () => {
    const out = sanitizePrefs({ textSize: "sm", theme: "dark", __proto__: { x: 1 }, evil: "y" })
    expect(Object.keys(out).sort()).toEqual(["textSize", "theme"])
  })
})
