// Real-browser verification against the ACTUAL production build served with
// the ACTUAL vercel.json headers. This exists because the Vitest suite runs
// in jsdom, which does not enforce Content-Security-Policy — only a real
// browser engine can confirm the CSP doesn't silently break functionality,
// and that pasted content can never execute as script.
//
// Usage: npm run build && npm run test:browser
// Uses the bundled Chromium that `puppeteer` downloads on `npm install`.
// In a sandboxed/offline environment, point PUPPETEER_EXECUTABLE_PATH at an
// existing Chrome/Chromium binary instead.
import puppeteer from "puppeteer";
import { startSecureServer } from "./serve-secure.mjs";

const server = await startSecureServer(0);
const BASE = `http://127.0.0.1:${server.address().port}`;

const browser = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();

const cspViolations = [];
const consoleErrors = [];
const pageErrors = [];

page.on("console", (msg) => {
  if (msg.type() === "error") {
    const text = msg.text();
    if (/content security policy|refused to/i.test(text)) cspViolations.push(text);
    else consoleErrors.push(text);
  }
});
page.on("pageerror", (err) => pageErrors.push(err.message));
await page.evaluateOnNewDocument(() => {
  window.__cspViolations = [];
  document.addEventListener("securitypolicyviolation", (e) => {
    window.__cspViolations.push(`${e.violatedDirective}: blocked ${e.blockedURI}`);
  });
});
async function collectNativeViolations() {
  cspViolations.push(...(await page.evaluate(() => window.__cspViolations.splice(0))));
}

const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass, detail });

const routes = ["/", "/analyze", "/simulator", "/learn", "/respond", "/dashboard", "/privacy", "/terms", "/accessibility", "/disclaimer", "/contact", "/sitemap", "/this-route-does-not-exist"];
for (const route of routes) {
  await page.goto(BASE + route, { waitUntil: "networkidle0" });
  await collectNativeViolations();
  const h1Count = await page.evaluate(() => document.querySelectorAll("h1").length);
  check(`${route} renders exactly one <h1>`, h1Count === 1, `found ${h1Count}`);
}

// Analyzer: run a known scam example and confirm the result renders correctly.
await page.goto(BASE + "/analyze", { waitUntil: "networkidle0" });
await collectNativeViolations();
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Example 1"));
  btn?.click();
});
await new Promise((r) => setTimeout(r, 300));
await collectNativeViolations();
check("Analyzer: High risk banner shown for scam example", (await page.evaluate(() => document.body.innerText)).includes("High risk"));

// Confirm the Progress bar's inline style actually applies under the strict CSP
// (React sets styles via the CSSOM property interface, not the `style`
// attribute/parser, so this is expected to work even with no 'unsafe-inline'
// in style-src — this check locks that behaviour in as a regression test).
const progress = await page.evaluate(() => {
  const el = document.querySelector('[data-slot="progress-indicator"]');
  return el ? { transform: getComputedStyle(el).transform, attr: el.getAttribute("style") } : null;
});
check("Progress bar inline transform renders under strict CSP", !!progress && progress.transform !== "none" && !!progress.attr, JSON.stringify(progress));

// XSS probe: pasted markup must never be parsed as HTML or execute.
await page.evaluate(() => {
  const ta = document.getElementById("analyzer-input");
  Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(
    ta, '<img src=x onerror="window.__xss=true">Share your OTP now'
  );
  ta.dispatchEvent(new Event("input", { bubbles: true }));
});
const xss = await page.evaluate(() => ({
  fired: window.__xss === true,
  rawHtmlInBody: document.body.innerHTML.includes("<img src=x"),
  imgElements: document.querySelectorAll("img").length,
  storedSafelyAsValue: document.getElementById("analyzer-input").value.includes("<img src=x"),
}));
check("XSS payload does not execute", !xss.fired);
check("XSS payload is not parsed as HTML anywhere in the page", !xss.rawHtmlInBody && xss.imgElements === 0, JSON.stringify(xss));
check("Payload is retained only as an inert form value", xss.storedSafelyAsValue);

// Accessibility toolbar actually mutates the DOM.
await page.goto(BASE + "/", { waitUntil: "networkidle0" });
await collectNativeViolations();
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent === "High contrast")?.click());
await new Promise((r) => setTimeout(r, 150));
check("High-contrast theme toggle updates <html data-theme>", (await page.evaluate(() => document.documentElement.dataset.theme)) === "contrast");

// Simulator end-to-end.
await page.goto(BASE + "/simulator", { waitUntil: "networkidle0" });
await collectNativeViolations();
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("official app or website directly"))?.click());
await new Promise((r) => setTimeout(r, 150));
check("Simulator shows correct feedback", (await page.evaluate(() => document.body.innerText)).includes("Good call."));

// Learn quiz end-to-end.
await page.goto(BASE + "/learn", { waitUntil: "networkidle0" });
await collectNativeViolations();
await page.evaluate(() => document.querySelectorAll("fieldset").forEach((fs) => fs.querySelector('input[type="radio"]')?.click()));
await new Promise((r) => setTimeout(r, 100));
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent === "Submit answers")?.click());
await new Promise((r) => setTimeout(r, 150));
check("Learn quiz shows a score after submit", /Score: \d \/ \d/.test(await page.evaluate(() => document.body.innerText)));

// Dashboard reflects state and "Clear saved data" genuinely clears it.
await page.goto(BASE + "/dashboard", { waitUntil: "networkidle0" });
await collectNativeViolations();
check("Dashboard reflects the earlier analysis", !(await page.evaluate(() => document.body.innerText)).includes("Messages/links analyzed\n0"));
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Clear saved data"))?.click());
await new Promise((r) => setTimeout(r, 150));
await page.reload({ waitUntil: "networkidle0" });
check("Counters reset to 0 after Clear + reload", await page.evaluate(() => [...document.querySelectorAll("p")].some((p) => p.textContent === "0")));

// Site-wide link hygiene.
await page.goto(BASE + "/", { waitUntil: "networkidle0" });
const badExternal = await page.evaluate(() =>
  [...document.querySelectorAll('a[target="_blank"]')]
    .filter((a) => !(a.rel || "").includes("noopener") || !(a.rel || "").includes("noreferrer"))
    .map((a) => a.href)
);
check("Every target=_blank link sets noopener+noreferrer", badExternal.length === 0, JSON.stringify(badExternal));

const knownPaths = new Set(["/", "/analyze", "/simulator", "/learn", "/respond", "/dashboard", "/privacy", "/terms", "/accessibility", "/disclaimer", "/contact", "/sitemap"]);
const broken = [];
for (const route of knownPaths) {
  await page.goto(BASE + route, { waitUntil: "networkidle0" });
  const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute("href")));
  for (const href of hrefs) if (!knownPaths.has(href.replace(/\/$/, "") || "/")) broken.push(`${route} -> ${href}`);
}
check("No broken internal links anywhere in the app", broken.length === 0, JSON.stringify(broken));

await browser.close();
await server.close();

console.log("\n=== RESULTS ===");
let ok = true;
for (const r of results) {
  console.log(`${r.pass ? "PASS" : "FAIL"} - ${r.name}${!r.pass && r.detail ? `  [${r.detail}]` : ""}`);
  if (!r.pass) ok = false;
}
console.log("\n=== CSP VIOLATIONS ===");
if (cspViolations.length) { cspViolations.forEach((v) => console.log(v)); ok = false; } else console.log("none");
console.log("\n=== UNCAUGHT PAGE ERRORS ===");
if (pageErrors.length) { pageErrors.forEach((e) => console.log(e)); ok = false; } else console.log("none");
console.log("\n=== OTHER CONSOLE ERRORS (informational) ===");
console.log(consoleErrors.length ? consoleErrors.join("\n") : "none");
console.log(`\nOVERALL: ${ok ? "PASS" : "FAIL"}`);
process.exit(ok ? 0 : 1);
