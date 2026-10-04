// @vitest-environment jsdom
//
// Real automated accessibility testing (axe-core) against the actual rendered
// app for every route, in every colour theme. This is what backs the claim in
// the Accessibility Statement that pages are checked with axe-core.
import { cleanup, render } from "@testing-library/react"
import axe from "axe-core"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import App from "./App"
import { PATHS, type RoutedPage } from "./lib/routes"
import { applyPrefs } from "./lib/prefs"

const routes = Object.keys(PATHS) as RoutedPage[]
const themes = ["light", "dark", "contrast"] as const

beforeEach(() => {
  window.history.pushState(null, "", "/")
  document.documentElement.className = ""
  delete document.documentElement.dataset.theme
  delete document.documentElement.dataset.textSize
})
afterEach(cleanup)

describe("axe-core: zero violations on every route", () => {
  for (const page of routes) {
    it(`${page} (${PATHS[page]})`, async () => {
      window.history.pushState(null, "", PATHS[page])
      const { container } = render(<App />)
      const results = await axe.run(container, {
        rules: { region: { enabled: false } }, // App renders its own <header>/<main>/<footer> landmarks at the document root, not inside `container`, so this rule doesn't apply to the fragment under test
      })
      if (results.violations.length) {
        const detail = results.violations.map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`).join("\n")
        throw new Error(`axe found violations on ${page}:\n${detail}`)
      }
      expect(results.violations).toHaveLength(0)
    })
  }
})

describe("axe-core: theme variants", () => {
  for (const theme of themes) {
    it(`home page has zero violations in the "${theme}" theme`, async () => {
      applyPrefs({ textSize: "md", theme })
      window.history.pushState(null, "", "/")
      const { container } = render(<App />)
      const results = await axe.run(container, { rules: { region: { enabled: false } } })
      expect(results.violations).toHaveLength(0)
    })
  }

  it("large text size renders without violations", async () => {
    applyPrefs({ textSize: "lg", theme: "light" })
    const { container } = render(<App />)
    const results = await axe.run(container, { rules: { region: { enabled: false } } })
    expect(results.violations).toHaveLength(0)
  })
})

describe("structural accessibility contract", () => {
  it("every page renders exactly one h1", async () => {
    for (const page of routes) {
      window.history.pushState(null, "", PATHS[page])
      const { container, unmount } = render(<App />)
      expect(container.querySelectorAll("h1")).toHaveLength(1)
      unmount()
    }
  })

  it("navigating focuses the new page heading (no silent context loss for screen readers)", async () => {
    window.history.pushState(null, "", PATHS.home)
    const { findByRole } = render(<App />)
    const analyzeLink = await findByRole("link", { name: "Analyze" })
    analyzeLink.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }))
    await new Promise((r) => setTimeout(r, 0))
    expect(document.activeElement?.tagName).toBe("H1")
  })
})
