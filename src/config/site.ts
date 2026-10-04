// Single place for site-wide identity/config. Nothing here is secret: Vite
// inlines VITE_* variables into the public bundle.

const EMAIL_RE = /^[^\s@<>()"',;:\\]+@[^\s@<>()"',;:\\]+\.[A-Za-z]{2,}$/
const rawEmail = (import.meta.env.VITE_CONTACT_EMAIL ?? "").trim()

export const SITE = {
  name: "AegisX",
  owner: "Team AegisX",
  contactEmail: EMAIL_RE.test(rawEmail) ? rawEmail : "",
  lastUpdated: __BUILD_DATE__,
  version: __APP_VERSION__,
} as const

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
}
