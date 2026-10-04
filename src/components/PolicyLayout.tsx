import type { ReactNode } from "react"
import { SITE, formatDate } from "@/config/site"

export function PolicyLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Last updated: {formatDate(SITE.lastUpdated)}</p>
      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export function PolicySection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-bold">{heading}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}
