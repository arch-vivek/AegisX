import { describe, expect, it } from "vitest"
import { PATHS, TITLES, pageFromPath, type RoutedPage } from "./routes"

describe("pageFromPath", () => {
  it("maps every known path to its page", () => {
    for (const key of Object.keys(PATHS) as RoutedPage[]) expect(pageFromPath(PATHS[key])).toBe(key)
  })

  it("ignores a trailing slash", () => {
    expect(pageFromPath("/analyze/")).toBe("analyzer")
  })

  it("treats unknown paths, encoded tricks and empty input safely", () => {
    expect(pageFromPath("/nope")).toBe("notfound")
    expect(pageFromPath("/analyze/../etc/passwd")).toBe("notfound")
    expect(pageFromPath("/%3Cscript%3E")).toBe("notfound")
    expect(pageFromPath("")).toBe("home")
  })

  it("gives every page a distinct title", () => {
    const titles = Object.values(TITLES)
    expect(new Set(titles).size).toBe(titles.length)
  })
})
