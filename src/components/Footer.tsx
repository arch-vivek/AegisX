import { Link } from "@/lib/router"
import { ExternalLink } from "@/components/ExternalLink"
import { SITE, formatDate } from "@/config/site"
import type { RoutedPage } from "@/lib/routes"

const policyLinks: { to: RoutedPage; label: string }[] = [
  { to: "privacy", label: "Privacy Policy" },
  { to: "terms", label: "Terms of Use" },
  { to: "accessibility", label: "Accessibility Statement" },
  { to: "disclaimer", label: "Disclaimer, Copyright & Hyperlinking" },
  { to: "contact", label: "Contact & Feedback" },
  { to: "sitemap", label: "Sitemap" },
]

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border bg-card">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="text-base font-bold">AegisX</p>
          <p className="text-muted-foreground">
            An independent citizen digital-safety awareness project. It is <strong>not</strong> an official
            Government of India website and is not operated by, affiliated with or endorsed by any
            government body, bank or payment provider.
          </p>
          <p>
            Lost money or been targeted? Report at{" "}
            <ExternalLink href="https://cybercrime.gov.in">cybercrime.gov.in</ExternalLink> or call{" "}
            <a className="font-bold underline underline-offset-4" href="tel:1930">1930</a>.
          </p>
        </div>
        <nav aria-label="Website policies">
          <p className="mb-2 text-base font-bold">Website policies</p>
          <ul className="flex flex-col gap-1">
            {policyLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="inline-block min-h-6 underline underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-5xl px-4 py-4 text-xs text-muted-foreground">
          Content owned and maintained by {SITE.owner}. Last updated: {formatDate(SITE.lastUpdated)} · Version{" "}
          {SITE.version} · Source code under the MIT licence.
        </p>
      </div>
    </footer>
  )
}
