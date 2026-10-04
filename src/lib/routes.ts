// Pure routing helpers (no React) so they can be unit-tested.

export const PATHS = {
  home: "/",
  analyzer: "/analyze",
  simulator: "/simulator",
  learn: "/learn",
  respond: "/respond",
  dashboard: "/dashboard",
  privacy: "/privacy",
  terms: "/terms",
  accessibility: "/accessibility",
  disclaimer: "/disclaimer",
  contact: "/contact",
  sitemap: "/sitemap",
} as const

export type RoutedPage = keyof typeof PATHS
export type PageId = RoutedPage | "notfound"

export const TITLES: Record<PageId, string> = {
  home: "AegisX — Digital Safety & Cyber Fraud Awareness",
  analyzer: "Analyze a message or link | AegisX",
  simulator: "Scam scenario simulator | AegisX",
  learn: "Learn and quiz | AegisX",
  respond: "Incident response and reporting | AegisX",
  dashboard: "Your safety dashboard | AegisX",
  privacy: "Privacy Policy | AegisX",
  terms: "Terms of Use | AegisX",
  accessibility: "Accessibility Statement | AegisX",
  disclaimer: "Disclaimer, Copyright and Hyperlinking Policy | AegisX",
  contact: "Contact and Feedback | AegisX",
  sitemap: "Sitemap | AegisX",
  notfound: "Page not found | AegisX",
}

export function pageFromPath(pathname: string): PageId {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname || "/"
  const match = (Object.keys(PATHS) as RoutedPage[]).find((k) => PATHS[k] === clean)
  return match ?? "notfound"
}
