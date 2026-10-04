import { useEffect, useRef } from "react"
import { RouterProvider, useRouter } from "@/lib/router"
import { TITLES } from "@/lib/routes"
import { A11yToolbar } from "@/components/A11yToolbar"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { Home } from "@/pages/Home"
import { Analyzer } from "@/pages/Analyzer"
import { Simulator } from "@/pages/Simulator"
import { Learn } from "@/pages/Learn"
import { Respond } from "@/pages/Respond"
import { Dashboard } from "@/pages/Dashboard"
import { Privacy, Terms, AccessibilityStatement, Disclaimer, Contact, Sitemap, NotFound } from "@/pages/Policies"

function Page() {
  const { page } = useRouter()
  switch (page) {
    case "home": return <Home />
    case "analyzer": return <Analyzer />
    case "simulator": return <Simulator />
    case "learn": return <Learn />
    case "respond": return <Respond />
    case "dashboard": return <Dashboard />
    case "privacy": return <Privacy />
    case "terms": return <Terms />
    case "accessibility": return <AccessibilityStatement />
    case "disclaimer": return <Disclaimer />
    case "contact": return <Contact />
    case "sitemap": return <Sitemap />
    default: return <NotFound />
  }
}

function Shell() {
  const { page } = useRouter()
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    document.title = TITLES[page]

    // Unknown URLs should not be indexed as real pages.
    const existing = document.querySelector('meta[name="robots"]')
    if (page === "notfound") {
      const meta = existing ?? document.head.appendChild(Object.assign(document.createElement("meta"), { name: "robots" }))
      meta.setAttribute("content", "noindex")
    } else {
      existing?.remove()
    }

    // After a navigation, move keyboard/screen-reader focus to the new page heading.
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    const h1 = mainRef.current?.querySelector("h1")
    if (h1) {
      h1.setAttribute("tabindex", "-1")
      h1.focus({ preventScroll: true })
    } else {
      mainRef.current?.focus()
    }
  }, [page])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <A11yToolbar />
      <Nav />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Page />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  )
}
