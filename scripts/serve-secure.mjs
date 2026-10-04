// Serves ./dist locally with the SAME security headers and SPA rewrite rules
// that vercel.json applies in production, so you can test them before deploying.
//   npm run build && npm run preview:secure
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"))

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
}

function headersFor(urlPath) {
  const out = {}
  for (const rule of config.headers ?? []) {
    const applies = rule.source === "/(.*)" || (rule.source === "/assets/(.*)" && urlPath.startsWith("/assets/"))
    if (applies) for (const h of rule.headers) out[h.key] = h.value
  }
  if (!urlPath.startsWith("/assets/")) out["Cache-Control"] ??= "public, max-age=0, must-revalidate"
  return out
}

export function startSecureServer(port = 4173) {
  const server = http.createServer((req, res) => {
    let urlPath
    try {
      urlPath = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname)
    } catch {
      res.writeHead(400)
      res.end("Bad request")
      return
    }
    const headers = headersFor(urlPath)
    const candidate = path.normalize(path.join(dist, urlPath))
    const inside = candidate === dist || candidate.startsWith(dist + path.sep)
    let file = null
    if (inside && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) file = candidate
    else if (!urlPath.startsWith("/assets/")) file = path.join(dist, "index.html") // SPA rewrite
    if (!file) {
      res.writeHead(404, { ...headers, "Content-Type": "text/plain; charset=utf-8" })
      res.end("Not found")
      return
    }
    res.writeHead(200, { ...headers, "Content-Type": MIME[path.extname(file)] ?? "application/octet-stream" })
    fs.createReadStream(file).pipe(res)
  })
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)))
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!fs.existsSync(path.join(dist, "index.html"))) {
    console.error("dist/ not found. Run `npm run build` first.")
    process.exit(2)
  }
  const port = Number(process.env.PORT) || 4173
  await startSecureServer(port)
  console.log(`Serving dist/ with production headers at http://127.0.0.1:${port}`)
}
