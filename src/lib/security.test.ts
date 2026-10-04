// Security regression tests: they fail if someone weakens the deployment
// headers or introduces a dangerous pattern into the source.
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const root = new URL("../../", import.meta.url).pathname
const config = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8")) as {
  headers: { source: string; headers: { key: string; value: string }[] }[]
}
const global = Object.fromEntries(
  (config.headers.find((h) => h.source === "/(.*)")?.headers ?? []).map((h) => [h.key.toLowerCase(), h.value])
)

describe("vercel.json security headers", () => {
  it("sets all baseline headers", () => {
    for (const key of [
      "content-security-policy",
      "strict-transport-security",
      "x-content-type-options",
      "x-frame-options",
      "referrer-policy",
      "permissions-policy",
      "cross-origin-opener-policy",
    ]) {
      expect(global[key], `missing ${key}`).toBeTruthy()
    }
    expect(global["x-content-type-options"]).toBe("nosniff")
    expect(global["x-frame-options"]).toBe("DENY")
    expect(Number(/max-age=(\d+)/.exec(global["strict-transport-security"])?.[1])).toBeGreaterThanOrEqual(31536000)
  })

  it("has a strict Content-Security-Policy", () => {
    const csp = global["content-security-policy"]
    for (const must of ["default-src 'self'", "script-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'", "form-action 'self'"]) {
      expect(csp).toContain(must)
    }
    expect(csp).not.toMatch(/unsafe-inline|unsafe-eval|https?:|\*/)
  })

  it("caches only fingerprinted assets as immutable", () => {
    const rule = config.headers.find((h) => h.source === "/assets/(.*)")
    expect(rule?.headers[0].value).toContain("immutable")
  })
})

describe("index.html", () => {
  const html = readFileSync(join(root, "index.html"), "utf8")
  it("has no inline scripts or inline styles (CSP-safe)", () => {
    expect(html).not.toMatch(/<script(?![^>]*\bsrc=)[^>]*>/i)
    expect(html).not.toMatch(/\sstyle=/i)
  })
  it("references no third-party origins", () => {
    expect(html).not.toMatch(/(src|href)=["']https?:/i)
  })
})

describe("source code", () => {
  function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const full = join(dir, name)
      return statSync(full).isDirectory() ? walk(full) : [full]
    })
  }
  const files = walk(join(root, "src")).filter((f) => /\.(ts|tsx)$/.test(f) && !/\.test\.ts$/.test(f))

  it("has no dangerous DOM/JS sinks", () => {
    const bad = /dangerouslySetInnerHTML|\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML|\beval\s*\(|new Function\s*\(|document\.write\s*\(/
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toMatch(bad)
  })

  it("makes no network requests", () => {
    const net = /\bfetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|new WebSocket|new EventSource/
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toMatch(net)
  })

  it("every target=_blank link also sets rel=noopener noreferrer", () => {
    for (const f of files) {
      const src = readFileSync(f, "utf8")
      if (src.includes('target="_blank"')) expect(src, f).toContain("noopener noreferrer")
    }
  })
})
