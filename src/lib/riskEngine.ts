// AegisX rule-based risk engine.
// This is deliberately transparent: every signal below is a named, explainable
// heuristic, not a black-box score. It is an ADVISORY assessment, not proof of fraud.

export type Severity = "low" | "medium" | "high"

export interface Indicator {
  id: string
  label: string
  detail: string
  severity: Severity
  points: number
}

export type RiskLevel = "Low" | "Medium" | "High"

export interface AnalysisResult {
  input: string
  urlsFound: string[]
  indicators: Indicator[]
  score: number
  level: RiskLevel
  guidance: string[]
  /** True when the input was longer than MAX_INPUT_CHARS and was cut before analysis. */
  truncated: boolean
}

/** Upper bounds keep analysis fast and bounded regardless of what is pasted. */
export const MAX_INPUT_CHARS = 5000
export const MAX_URLS_ANALYZED = 10

// Weights are calibrated so that a single "high" severity indicator is, on its
// own, already enough to cross the High-risk threshold below (e.g. a direct OTP
// request or a brand name paired with a look-alike domain each independently
// warrant a strong warning). "medium" and "low" signals need to accumulate.
const SEVERITY_POINTS: Record<Severity, number> = { low: 8, medium: 20, high: 50 }

function push(list: Indicator[], id: string, label: string, detail: string, severity: Severity) {
  if (list.some((i) => i.id === id)) return
  list.push({ id, label, detail, severity, points: SEVERITY_POINTS[severity] })
}

// Matches explicit http(s)/www links AND bare domains ending in a recognised
// TLD (e.g. "hdfc-kyc-update.xyz/verify" with no scheme at all) — real scam
// SMS/WhatsApp messages very often omit the "http://" or "www." prefix.
const KNOWN_TLDS = [
  "com", "net", "org", "in", "co", "io", "info", "online", "site", "shop", "link", "click",
  "gov.in", "co.in", "org.in", "net.in", "nic.in",
  "xyz", "top", "tk", "ml", "ga", "cf", "club", "work", "support", "win", "live", "icu", "buzz", "rest",
]
const URL_REGEX = new RegExp(
  `(https?:\\/\\/[^\\s<>"')]+|www\\.[^\\s<>"')]+|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+(?:${KNOWN_TLDS.join("|")})(?:\\/[^\\s<>"')]*)?)`,
  "gi"
)
const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "cutt.ly", "is.gd", "rebrand.ly", "shorturl.at", "tiny.cc", "goo.gl", "ow.ly"]
const RISKY_TLDS = [".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".club", ".work", ".support", ".win", ".live", ".icu", ".buzz", ".rest"]
const BRAND_KEYWORDS = [
  "paypal", "amazon", "google", "microsoft", "apple", "netflix", "sbi", "hdfc", "icici",
  "axis", "kotak", "paytm", "phonepe", "gpay", "whatsapp", "irctc", "indiapost", "incometax",
  "aadhaar", "uidai", "rbi", "lic", "sbicard",
]

export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX) || []
  return Array.from(new Set(matches.map((m) => m.trim())))
}

function safeParse(raw: string): URL | null {
  try {
    const withScheme = raw.startsWith("http") ? raw : `http://${raw}`
    return new URL(withScheme)
  } catch {
    return null
  }
}

export function analyzeUrl(raw: string, indicators: Indicator[]) {
  const parsed = safeParse(raw)
  if (!parsed) {
    push(indicators, "url-unparseable", "Malformed link", "The link is structured oddly enough that a browser may interpret it unpredictably.", "medium")
    return
  }
  const host = parsed.hostname.toLowerCase()

  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    push(indicators, "ip-host", "Raw IP address instead of a domain", "Legitimate services almost never send links that point straight at a numeric IP address.", "high")
  }
  if (parsed.protocol !== "https:") {
    push(indicators, "no-https", "Not using a secure (HTTPS) connection", "Data sent to this link is not encrypted in transit. Weak on its own — many older legitimate sites still lack HTTPS — but it adds to other signals.", "low")
  }
  if (raw.includes("@")) {
    push(indicators, "at-symbol", "\"@\" symbol inside the link", "Browsers ignore everything before an \"@\", so the real destination can be hidden after it.", "high")
  }
  if (host.startsWith("xn--") || host.includes(".xn--")) {
    push(indicators, "punycode", "Punycode / look-alike characters in the domain", "This can be used to mimic a trusted brand name using visually similar letters.", "high")
  }
  if (SHORTENERS.some((s) => host === s || host.endsWith("." + s))) {
    push(indicators, "shortener", "Uses a link-shortening service", "Shorteners hide the real destination until after you click.", "medium")
  }
  if (RISKY_TLDS.some((t) => host.endsWith(t))) {
    push(indicators, "risky-tld", "Uncommon domain ending", "This domain ending is inexpensive and commonly abused in scam campaigns, though it is not proof of fraud by itself.", "low")
  }
  const dotCount = host.split(".").length - 1
  if (dotCount >= 4) {
    push(indicators, "subdomain-chain", "Unusually long subdomain chain", "Extra subdomains can be used to make a fake link look like it belongs to a trusted brand.", "medium")
  }
  const hyphenCount = (host.match(/-/g) || []).length
  const mentionsBrand = BRAND_KEYWORDS.some((b) => host.includes(b))
  if (mentionsBrand && hyphenCount >= 1) {
    push(indicators, "brand-mismatch", "Brand name combined with an unofficial-looking domain", "The link mentions a known brand but the domain itself does not match that brand's official site.", "high")
  } else if (hyphenCount >= 3) {
    push(indicators, "hyphen-heavy", "Hyphen-heavy domain name", "Domains strung together with many hyphens are a common pattern in disposable scam sites.", "low")
  }
  if ((parsed.search.match(/%[0-9A-Fa-f]{2}/g) || []).length > 6) {
    push(indicators, "encoded-query", "Heavily encoded link parameters", "Long encoded parameters can be used to redirect or disguise the final destination.", "low")
  }
}

const URGENCY_PHRASES = [
  "immediately", "urgent", "act now", "act fast", "within 24 hours", "within 12 hours",
  "account will be blocked", "account has been suspended", "account will be suspended",
  "will be deactivated", "last warning", "final notice", "limited time", "expire today",
  "avoid suspension", "click below immediately",
]
const CREDENTIAL_PHRASES = ["otp", "one time password", "cvv", "upi pin", "atm pin", "net banking password", "share your pin", "share your otp", "share your password"]
const MONEY_HOOK_PHRASES = [
  "you have won", "lucky winner", "claim your prize", "claim your reward", "refund of",
  "cashback of", "processing fee", "advance fee", "release your parcel", "customs duty",
  "pay a small fee", "unlock your funds",
]
const REMOTE_ACCESS_PHRASES = ["anydesk", "teamviewer", "quicksupport", "screen share", "remote access", "install this app to receive"]
const AUTHORITY_WORDS = ["income tax department", "customs", "courier", "electricity board", "police", "cyber cell", "bank security team", "kyc"]

export function analyzeMessageText(text: string, indicators: Indicator[]) {
  const lower = text.toLowerCase()

  if (URGENCY_PHRASES.some((p) => lower.includes(p))) {
    push(indicators, "urgency", "Urgency or pressure language", "Scammers create false time pressure so you act before verifying.", "medium")
  }
  if (CREDENTIAL_PHRASES.some((p) => lower.includes(p))) {
    push(indicators, "credential-request", "Asks for OTP, PIN, CVV, or a password", "No legitimate bank, UPI app, or government service ever needs you to share these.", "high")
  }
  if (MONEY_HOOK_PHRASES.some((p) => lower.includes(p))) {
    push(indicators, "money-hook", "Unexpected prize, refund, or fee demand", "Unsolicited winnings or a fee required to \"release\" money are classic advance-fee scam patterns.", "high")
  }
  if (REMOTE_ACCESS_PHRASES.some((p) => lower.includes(p))) {
    push(indicators, "remote-access", "Asks you to install a remote-access or screen-sharing app", "This gives a stranger direct control of your device and banking apps.", "high")
  }
  const authorityHit = AUTHORITY_WORDS.some((p) => lower.includes(p))
  if (authorityHit && (URGENCY_PHRASES.some((p) => lower.includes(p)) || MONEY_HOOK_PHRASES.some((p) => lower.includes(p)))) {
    push(indicators, "impersonation", "Impersonates an authority or institution under pressure", "Genuine institutions rarely combine an urgent threat with a request made over SMS/WhatsApp.", "high")
  }
  if (/dear (customer|user|valued customer)/i.test(text)) {
    push(indicators, "generic-greeting", "Generic, non-personalised greeting", "A message that doesn't use your real name is a weak but common scam signal.", "low")
  }
}

export function analyze(rawInput: string): AnalysisResult {
  const trimmed = rawInput.trim()
  const truncated = trimmed.length > MAX_INPUT_CHARS
  const input = truncated ? trimmed.slice(0, MAX_INPUT_CHARS) : trimmed
  const indicators: Indicator[] = []
  const urlsFound = extractUrls(input).slice(0, MAX_URLS_ANALYZED)

  const looksLikeBareUrl = urlsFound.length === 1 && urlsFound[0].length >= input.length - 2
  if (looksLikeBareUrl) {
    analyzeUrl(urlsFound[0], indicators)
  } else {
    analyzeMessageText(input, indicators)
    urlsFound.forEach((u) => analyzeUrl(u, indicators))
  }

  const score = Math.min(100, indicators.reduce((sum, i) => sum + i.points, 0))
  const level: RiskLevel = score >= 45 ? "High" : score >= 18 ? "Medium" : "Low"

  const guidance =
    level === "High"
      ? [
          "Do not click the link, call the number, or reply with any personal or banking details.",
          "Never share an OTP, PIN, CVV, or password with anyone who contacted you first.",
          "Verify independently: open the official app or website yourself, or call the number printed on your card/bill.",
          "If you already shared details or made a payment, see the Incident Response guide next.",
        ]
      : level === "Medium"
      ? [
          "Treat this with caution — verify through an official channel before acting on it.",
          "Do not enter your OTP, PIN, or password if you click through, even accidentally.",
          "When in doubt, contact the organisation using a number or address you already trust, not one from this message.",
        ]
      : [
          "No strong red flags were detected, but AegisX cannot guarantee a message or link is genuine.",
          "Stay cautious with any request for money, credentials, or personal information.",
        ]

  return { input, urlsFound, indicators: indicators.sort((a, b) => SEVERITY_POINTS[b.severity] - SEVERITY_POINTS[a.severity]), score, level, guidance, truncated }
}
