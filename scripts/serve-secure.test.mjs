// Exercises the ACTUAL header/rewrite/traversal-guard logic used to serve the
// production build locally (npm run preview:secure), against a real HTTP
// server on a real socket - not a mock. Run standalone with:
//   node --test scripts/serve-secure.test.mjs
// (kept as a plain Node test, not a Vitest file, so it can run against a real
// dist/ build step without pulling jsdom/browser globals into the mix.)
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { after, before, describe, it } from "node:test"
import { fileURLToPath } from "node:url"
import { startSecureServer } from "./serve-secure.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")

let server
let base

before(async () => {
  if (!fs.existsSync(path.join(dist, "index.html"))) {
    throw new Error("dist/ missing - run `npm run build` before this test")
  }
  server = await startSecureServer(0)
  base = `http://127.0.0.1:${server.address().port}`
})

after(() => server.close())

describe("production header server", () => {
  it("serves the app with every security header on /", async () => {
    const res = await fetch(`${base}/`)
    assert.equal(res.status, 200)
    assert.equal(res.headers.get("x-frame-options"), "DENY")
    assert.equal(res.headers.get("x-content-type-options"), "nosniff")
    assert.match(res.headers.get("content-security-policy") ?? "", /default-src 'self'/)
    assert.match(res.headers.get("strict-transport-security") ?? "", /max-age=\d+/)
  })

  it("rewrites unknown client-side routes to index.html (SPA routing) with headers intact", async () => {
    const res = await fetch(`${base}/analyze`)
    assert.equal(res.status, 200)
    assert.equal(res.headers.get("x-frame-options"), "DENY")
    assert.match(await res.text(), /<div id="root">/)
  })

  it("caches fingerprinted assets as immutable", async () => {
    const html = await (await fetch(`${base}/`)).text()
    const assetPath = html.match(/\/assets\/index-[\w-]+\.js/)?.[0]
    assert.ok(assetPath, "expected a hashed JS asset reference in index.html")
    const res = await fetch(`${base}${assetPath}`)
    assert.equal(res.status, 200)
    assert.match(res.headers.get("cache-control") ?? "", /immutable/)
  })

  it("does not disclose files outside dist/ via literal ../ traversal", async () => {
    const res = await fetch(`${base}/assets/${"../".repeat(8)}etc/passwd`)
    const body = await res.text()
    assert.ok(!body.includes("root:"), "response must not contain /etc/passwd content")
  })

  it("does not disclose files outside dist/ via %2f-encoded traversal", async () => {
    const res = await fetch(`${base}/assets/..%2f..%2f..%2fetc%2fpasswd`)
    const body = await res.text()
    assert.equal(res.status, 404)
    assert.ok(!body.includes("root:"), "response must not contain /etc/passwd content")
  })

  it("returns 400 on a malformed request path instead of crashing", async () => {
    const res = await fetch(`${base}/%`)
    assert.ok(res.status === 400 || res.status === 404)
  })
})
